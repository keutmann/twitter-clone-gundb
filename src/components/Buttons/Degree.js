import React from "react";
import styled from "styled-components";
import useUserChanged from "../../hooks/useUserChanged";
// import useUser from "../../hooks/useUser";
// import { ThemeContext } from "../../context/ThemeContext";

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.secondaryColor};
  text-align: center;
  border-radius: 5px;
  width: 25px;
  height: 25px; 
  cursor: pointer;
  background-color: ${(props) => props.stateColor}

  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
`

const Degree = ({ user }) => {

    const [,] = useUserChanged(user);

    function clickHandler() {
      // Open Visual Graph
      //setNumber(number+1);
    }
         
    const color = user.localState.color;
    const title = `Trust: ${user.score.trust} - Follow: ${user.score.follow} - Neutral: ${user.score.neutral} - Mute: ${user.score.mute} - Block: ${user.score.block}`;
    var number = user.localState.degree + 1;

    if(user.localState.name === "neutral")
      return null;

  return (
    <Wrapper onClick={clickHandler} title={title} stateColor={color} titel={title}>
        {number}
    </Wrapper>
  );
};

export default Degree;