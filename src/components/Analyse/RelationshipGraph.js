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

function getColors(relationship, theme) {
  theme = theme.theme;
  let colors = (relationship) ?
    { background: theme[relationship.action + "Background"], textColor: theme[relationship.action + "Textcolor"] }
    :
    { background: theme.neutralBackground, textColor: theme.neutralTextcolor };
  colors.font = { size: 12, color: theme.secondaryColor, face: theme.font };

  return colors;
}

function createNode(nodeId, user, relationship, colors) {

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
    relationship: relationship
  };
  return currentNode
}


const RelationshipGraph = ({ user, close }) => {

  const graphRef = React.createRef();
  const { theme } = useContext(ThemeContext);
  const history = useHistory();
  const { getUserContainerById } = useUser();


  function InitState() {
    let nodeId = 1;
    let nodes = [];
    let edges = [];
    let visited = {};


    function load(localUser, parentNode, relationship, level) {
      if (visited[localUser.id])
        return;
      visited[localUser.id] = true;


      const colors = getColors(relationship, theme);

      let currentNode = createNode(nodeId++, localUser, relationship, colors);
      nodes.push(currentNode);

      if (parentNode)
        edges.push({ from: parentNode.id, to: currentNode.id, arrows: "to", color: { color: colors.background } })


      if (level === 0)
        return;

      if (relationship && relationship.action !== resources.node.names.trust) // Only continue with Trust relationships
        return;

      for (const [userId, relationship] of Object.entries(localUser.relationships)) {

        if (relationship.action === resources.node.names.neutral)
          continue;

        let childUser = getUserContainerById(userId);
        load(childUser, currentNode, relationship, level - 1);
      }
    }

    load(user, null, null, 3);

    let r = {
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
            history.push("/" + node.user.id);
            close();
          }

        }
      }
    }
    return r;
  }

  const [state] = useState(InitState);

  const { graph, events } = state;
  return (
    <Graph ref={graphRef} graph={graph} options={options} events={events} style={{ height: "640px", with: "640px" }} />
  );
}

export default RelationshipGraph;