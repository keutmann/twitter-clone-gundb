import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import styled from "styled-components";
import Popup from "reactjs-popup";
import FollowUser from "../MenuItems/FollowUser";
import MuteUser from "../MenuItems/MuteUser";
import BlockUser from "../MenuItems/BlockUser";
import AnalyseGraph from "../MenuItems/AnalyseGraph";

const Wrapper = styled.div`
  .btn {
    cursor: pointer;
  }

  .threedots:after {
    content: '\\2807';
    font-size: 20px;
  }

`;

const TweetMenuBtn = React.forwardRef(({ open, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
     <span className="threedots" ></span>
    </div>
  );
});


const TweetMenu = ({ item }) => {
  const theme = useContext(ThemeContext);

  const contentStyle = {
    width: "260px",
    background: theme.background,
    borderRadius: "6px",
    border: `1px solid ${theme.tertiaryColor}`,
    boxShadow: theme.bs1,
  };

  const overlayStyle = {
    background: "none",
  };

  return (
    <Wrapper>
      <Popup
        className="btn"
        trigger={(open) => <TweetMenuBtn open={open} />}
        position="bottom right"
        closeOnDocumentClick
        contentStyle={contentStyle}
        overlayStyle={overlayStyle}
        arrow={false}
      >
        <FollowUser user={ item.owner } />
        <MuteUser user={ item.owner } />
        <BlockUser user={ item.owner } />
        <AnalyseGraph user={ item.owner }/>
      </Popup> 
    </Wrapper>
  );
};

export default TweetMenu;