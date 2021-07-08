import Graph from "react-vis-network-graph";
import React, { useContext, useState } from "react";
import useUser from "../../hooks/useUser";
import { ThemeContext } from "../../context/ThemeContext";
import resources from "../../utils/resources";
import Identicon from '../../utils/Identicon';
import { useHistory } from "react-router-dom";

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



function lineBreakText(text: string, width: number) {
  if (!text)
    return "";

  let r = [];
  let count = 0;
  let index = 0;
  if (text.length <= width)
    return text;

  while (index < text.length) {
    if (count >= width) {
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

function getColors(claim, theme) { 
  let colors = (claim) ?
    { background: theme[claim.action + "Background"], textColor: theme[claim.action + "Textcolor"] }
    :
    { background: theme.neutralBackground, textColor: theme.neutralTextcolor };
  colors.font = { size: 12, color: theme.secondaryColor, face: theme.font };

  return colors;
}


function createNode(nodeId, user, claim, colors) {

  let label = (user.profile && user.profile.displayname) ? user.profile.displayname : user.id;

  let data = "";
  if (user.profile && user.profile.avatar)
    data = user.profile.avatar;
  else {
    let icon = new Identicon({ string: user.id, size: 20 });
    icon.updateCanvas();
    data = icon.toDataURL();
  }


  let currentNode = {
    id: nodeId,
    label: lineBreakText(label, 9),
    image: data,
    color: {
      color: colors.background
    },
    font: colors.font,
    user: user,
    claim: claim
  };
  return currentNode
}


const ClaimGraph = ({ item, close }) => {

  const graphRef = React.createRef();
  const { theme } = useContext(ThemeContext);
  const history = useHistory();
  const { usersManager } = useUser();


  function InitState() {
    let nodeId = 1;
    let nodes = [];
    let edges = [];


    function load(item) {

      let icon = new Identicon({ string: item.soul, size: 20 });
      icon.updateCanvas();
      const itemImage = icon.toDataURL();
  

      let itemNode = {
        id: nodeId++,
        label: `Confirm: ${item.score.confirm} - Reject: ${item.score.reject}`,
        image: itemImage,
        color: {
          color: item.state.color
        },
        item: item
      };
    
      nodes.push(itemNode);

      const [claimBy,] = item.getScoreClaims();
      if(!claimBy) // There is no claims
        return;

      for (const [userId, claim] of Object.entries(claimBy)) {
        if (claim.action === resources.node.names.neutral)
          continue;
          
        let user = usersManager.getUserContainerById(userId);
        const colors = getColors(claim, theme);
        let userNode = createNode(nodeId++, user, claim, colors);
        nodes.push(userNode);

        edges.push({ from: userNode.id, to: itemNode.id, arrows: "to", color: { color: colors.background }, title: claim.action });
      }
    }

    load(item);

    let data = {
      counter: nodes.length,
      graph: {
        nodes: nodes,
        edges: edges
      },
      events: {
        select: ({ nodes, edges }) => {
        },
        doubleClick: ({ nodes }) => {
          let nodeId = nodes.shift();
          if (nodeId) {
            let node = graphRef.current.nodes.get(nodeId);
            if(node.user)
              history.push("/" + node.user.id);
            close();
          }

        }
      }
    }
    return data;
  }

  const [state] = useState(InitState);

  const { graph, events } = state;
  return (
    <Graph ref={graphRef} graph={graph} options={options} events={events} style={{ height: "640px", with: "640px" }} />
  );
}

export default ClaimGraph;