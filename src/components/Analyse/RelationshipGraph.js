import Graph from "react-vis-network-graph";
import React, { useContext, useState } from "react";
import useUser from "../../hooks/useUser";
import { ThemeContext } from "../../context/ThemeContext";
import resources from "../../utils/resources";
//import AvatarIdenticon from "../AvatarIdenticon";
import Identicon from '../../utils/Identicon';
//import AvatarIdenticon from "../AvatarIdenticon";
//import ReactDOM from "react-dom";

//import "./styles.css";
// need to import the vis network css in order to show tooltip
//import "./network.css";

const options = {
    layout: {
      hierarchical: false
    },
    nodes: {
      shape: "circularImage",
      size: 20,
    },
    edges: {
      color: "#000000"
    }
  };
  
  

  function lineBreakText(text : string, width: number) {
    if(!text)
        return "";

    let r = [];
    let count = 0;
    let index = 0;
    if(text.length <= width)
        return text;
    
    while(index < text.length) {
        if(count >= width) {
            count = 0;
            r.push("-\n");
            continue;
        }

        r.push(text[index]);
        count++;
        index++;
    }

    return r.join("");
}

    // function createNode(profile)  {
    //     if(!profile.icon) {
    //         //profile.icon = Identicon.createIcon(profile.id, {margin:0.1, size:64, format: 'svg'}); // Need min 15 chars
    //         //AvatarIdenticon.toDataURL("image/png")
    //     }

    //     let label = this.lineBreakText(profile.title, 20);
    //     if(label.length == 0) 
    //         label = this.lineBreakText(this.getData(profile), 20);
        
    //     if(label.length == 0) 
    //         label = this.lineBreakText(profile.id, 20);


    //     let node = {
    //         id: profile.id,
    //         image: profile.icon,
    //         label: label
    //     }
    //     return node;
    // }

function getColors(relationship, theme) {
  theme = theme.theme;
  let colors = (relationship) ? 
  { background: theme[relationship.action+"Background"], textColor: theme[relationship.action+"Textcolor"] } 
  : 
  { background: theme.neutralBackground, textColor: theme.neutralTextcolor };
  colors.font = { size: 12, color: theme.secondaryColor, face: theme.font };

  return colors;
}

function createNode(nodeId, user, relationship, colors) {
            
  let label = (user.profile && user.profile.displayname) ? user.profile.displayname : user.id;
  
  let data = "";
  if(user.profile && user.profile.avatar) 
    data = user.profile.avatar;
  else {
    let icon = new Identicon({ string:user.id, size:20 });
    icon.updateCanvas();
    data = icon.toDataURL();
  }
  //let icon = <AvatarIdenticon id={user.id} profile={user.profile} />;
  //let test = Identicon({ string:user.id, size:40 });
    

  let currentNode = { id: nodeId, 
    label: lineBreakText(label,9), 
    image: data,
    color: {
      color : colors.background
    },
    font : colors.font,
    user: user,
    relationship: relationship  
  };
  return currentNode
}


const RelationshipGraph = ( {user }) => {

  const theme = useContext(ThemeContext);

    const { getUserContainerById } = useUser();


    function InitState() {
        let nodeId = 1;
        let nodes = [];
        let edges = [];
        let visited = {};


        function load(localUser, parentNode, relationship, level) {
            if(visited[localUser.id]) 
              return;
            visited[localUser.id] = true;


            const colors = getColors(relationship, theme);
            
            let currentNode = createNode(nodeId++, localUser, relationship, colors);
            nodes.push(currentNode);

            if(parentNode)
              edges.push({ from: parentNode.id, to: currentNode.id, arrows: "to", color: { color: colors.background } })


            if(level === 0) 
              return; 

            if(relationship && relationship.action !== resources.node.names.trust) // Only continue with Trust relationships
              return;

            for (const [userId, relationship] of Object.entries(localUser.relationships)) {

                if(relationship.action === resources.node.names.neutral)
                  continue;
                
                let childUser = getUserContainerById(userId);
                load(childUser, currentNode, relationship, level-1);
            }
        }

        load(user, null, null, 3);

        let r = { 
            counter: nodes.length,
            graph: {
                nodes: nodes,
                edges: edges
            },
            events: {}
        }
        return r;
    }

    const [state] = useState(InitState);




    // const createNode = (x, y) => {
    //     const color = randomColor();
    //     setState(({ graph: { nodes, edges }, counter, ...rest }) => {
    //       const id = counter + 1;
    //       const from = Math.floor(Math.random() * (counter - 1)) + 1;
    //       return {
    //         graph: {
    //           nodes: [
    //             ...nodes,
    //             { id, label: `Node ${id}`, color, x, y }
    //           ],
    //           edges: [
    //             ...edges,
    //             { from, to: id }
    //           ]
    //         },
    //         counter: id,
    //         ...rest
    //       }
    //     });
    //   }

    //   function GetImage(id) {
    //     //return AvatarIdenticon(id, null).toDataURL("image/png");
    //     return '';
    //   }




    //   const [state, setState] = useState({
    //     counter: 5,
    //     graph: {
    //       nodes: [
    //         { id: 1, label: "Node 1", color: "#e04141" },
    //         { id: 2, label: "Node 2", color: "#e09c41" },
    //         { id: 3, label: "Node 3", color: "#e0df41" },
    //         { id: 4, label: "Node 4", color: "#7be041" },
    //         { id: 5, label: "Node 5", color: "#41e0c9" }
    //       ],
    //       edges: [
    //         { from: 1, to: 2 },
    //         { from: 1, to: 3 },
    //         { from: 2, to: 4 },
    //         { from: 2, to: 5 }
    //       ]
    //     },
    //     events: {
    //       select: ({ nodes, edges }) => {
    //         console.log("Selected nodes:");
    //         console.log(nodes);
    //         console.log("Selected edges:");
    //         console.log(edges);
    //         alert("Selected node: " + nodes);
    //       },
    //       doubleClick: ({ pointer: { canvas } }) => {
    //         createNode(canvas.x, canvas.y);
    //       }
    //     }
    //   })
      const { graph, events } = state;
      return (
        <Graph graph={graph} options={options} events={events} style={{ height: "640px", with: "640px" }} />
      );
}

export default RelationshipGraph;