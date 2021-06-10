import React, { useEffect, useState } from "react";
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

    //const { theme } = useContext(ThemeContext);
    const [,] = useUserChanged(user);

    // const [, setRender] = useState();

    function clickHandler() {
      // Open Visual Graph
      //setNumber(number+1);
    }

    // useEffect(() => {

    //   console.log("Degree -> useEffect called");
    //   user.calculateState();
    //   setRender();

    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [user.relationshipChanged]);
  
  

         
    const color = user.localState.color;
    const title = `Trust: ${user.score.trust} - Follow: ${user.score.follow} - Neutral: ${user.score.neutral} - Mute: ${user.score.mute} - Block: ${user.score.block}`;
    //const number = user.localState.score;
    const degree = user.localState.degree;

  return (
    <Wrapper onClick={clickHandler} title={title} stateColor={color} titel={title}>
        { degree }
    </Wrapper>
  );
};

export default Degree;