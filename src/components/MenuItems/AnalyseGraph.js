import React, { useContext } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { Diagram2 } from 'react-bootstrap-icons';

const AnalyseGraph = ({ user }) => {

  const { theme } = useContext(ThemeContext);

  const handleClick = () => {

  }

  return (
    <MenuButton onClick={handleClick}>
      <Diagram2 color={theme.accentColor} />
      <p>Analyse connections</p>
    </MenuButton>
  );
};

export default AnalyseGraph;
