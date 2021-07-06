import Graph from "react-vis-network-graph";
import React, { useContext, useState } from "react";
import useUser from "../../hooks/useUser";
import { ThemeContext } from "../../context/ThemeContext";
import resources from "../../utils/resources";
import Identicon from '../../utils/Identicon';
import { useHistory } from "react-router-dom";

const options = {
  layout: {
    hierarchical: {
      direction: "LR",
      sortMethod: "directed"
    }
  },
  interaction:
  {
    dragNodes: false,
    hover: false
  },
  physics: {
    enabled: false
  },
  nodes: {
    shape: 'circularImage',
    borderWidth: 3,
    size: 20,
    color: {
      border: '#222222',
      background: '#ffffff'
    },
    shadow: true,
    font: {
      color: '#000000',
      multi: 'md',
      face: 'arial',
      size: 9
    }
  },
  edges: {
    arrows: { to: true },
    shadow: true

  },
  autoResize: true
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

function getEdgeColors(state, theme) {

  let colors = (state) ?
    { background: theme[state.action + "Background"], textColor: theme[state.action + "Textcolor"] }
    :
    { background: theme.neutralBackground, textColor: theme.neutralTextcolor };
  colors.font = { size: 12, color: theme.secondaryColor, face: theme.font };

  return colors;
}

function createNode(nodeId, user, theme) {

  let label = (user.profile && user.profile.displayname) ? user.profile.displayname : user.profile.handle;

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
      color: theme.neutralBackground
    },
    font: { size: 12, color: theme.primaryColor, face: theme.font },
    user: user
  };
  return currentNode
}


const ScoreGraph = ({ user, close }) => {

  const graphRef = React.createRef();
  const { theme } = useContext(ThemeContext);
  const history = useHistory();

  const { usersManager, user: logginInUser } = useUser();
  

  function InitState() {
    let nodeId = 1;
    let nodes = [];
    let edges = [];
    let visited = {};

    function load(localUser, childNode, relationship, level) {
      if (visited[localUser.id])
        return; // Do not add the same user again
      visited[localUser.id] = true;


      let currentNode = createNode(nodeId++, localUser, theme);
      nodes.push(currentNode);

      if (childNode) {
        const edgecolor = getEdgeColors(relationship, theme);
        edges.push({ from: currentNode.id, to: childNode.id, arrows: "to", color: { color: edgecolor.background } })
      }

      if (localUser.id === logginInUser.id)
        return; // Stop with oneself

      if (level < 0) // Hard exit, deadman switch
        return;


      const tempList = localUser.getReduceRelationshipBy();
      let first = tempList.find(x => x !== undefined && x.element !== undefined && Object.keys(x.element).length > 0);

      if (first) {
        let relationships = first.element;
        for (const [userId, relationship] of Object.entries(relationships)) {

          // All neutrals are ignored, as they are basically null/cancel objects
          if (relationship.action === resources.node.names.neutral)
            continue;

          if (localUser.id !== user.id) {
            // We are not looking at target User anymore therefore only trust relationships are followed back.
            // Trust is the only relationship that allows to jump to the next user.
            if (relationship.action !== resources.node.names.trust)
              continue;
          }

          let parentUser = usersManager.getUserContainerById(userId);
          load(parentUser, currentNode, relationship, level - 1);
        }


      } else {
        // Something is wrong!!!
      }
    }

    load(user, 4);

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
            history.push("/"+node.user.id);
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

export default ScoreGraph;
