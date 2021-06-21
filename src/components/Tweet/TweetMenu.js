import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import styled from "styled-components";
import Popup from "reactjs-popup";
import FollowUser from "../MenuItems/FollowUser";
import MuteUser from "../MenuItems/MuteUser";
import BlockUser from "../MenuItems/BlockUser";
import AnalyseGraph from "../MenuItems/AnalyseGraph";
import TrustUser from "../MenuItems/TrustUser";
import DeleteTweetMenuItem from "../MenuItems/DeleteTweetMenuItem";
import ScoreGraph from "../MenuItems/ScoreGraph";

const Wrapper = styled.div`

  vertical-align: text-top;

  .btn {
    cursor: pointer;
  }

  .threedotsRow {
    vertical-align: text-top;
    font-size: 20px;
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
     {/* <span className="threedots" >...</span> */}
     <span className="threedotsRow" >...</span>
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

  const user = item.owner;

  return (
    <Wrapper style={{ display: '' }}>
      <Popup
        className="btn"
        trigger={(open) => <TweetMenuBtn open={open} />}
        position="bottom right"
        closeOnDocumentClick
        nested
        contentStyle={contentStyle}
        overlayStyle={overlayStyle}
        arrow={false}
      >
        {close => (
        <React.Fragment>
          <TrustUser user={ user } popupClose={close} />
          <FollowUser user={ user } />
          <MuteUser user={ user } />
          <BlockUser user={ user } popupClose={close} />
          <DeleteTweetMenuItem item={item} />
          <AnalyseGraph user={ user } popupClose={close} />
          <ScoreGraph user={ user } popupClose={close} />
        </React.Fragment>
        )}
      </Popup> 
    </Wrapper>
  );
};

export default TweetMenu;