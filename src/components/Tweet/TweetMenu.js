import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import styled from "styled-components";
import Popup from "reactjs-popup";
import ToggleTheme from "../ToggleTheme";
import Settings from "../Settings/SettingsMenuButton";
import ChangeColor from "../ChangeColor";

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
        <ToggleTheme  />
        <ChangeColor  />
        <Settings />
      </Popup> 
    </Wrapper>
  );
};

export default TweetMenu;
// import React from "react";
// //import "./styles.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Dropdown from "react-bootstrap/Dropdown";
// import styled from "styled-components";


// const Wrapper = styled.div`
//     float: right;
//     display: flex;
//     padding-left: 0.5rem;
    
//     .dropdown a:hover { 
//         text-decoration-line: none; 
//     }

//     .threedots:after {
//         content: '\\2807';
//         font-size: 30px;
//     }
// `;


// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   // eslint-disable-next-line jsx-a11y/anchor-is-valid
//   <a
//     href=""
//     ref={ref}
//     onClick={e => {
//       e.preventDefault();
//       onClick(e);
//     }}
//   >
//     {children}
//     <span className="threedots" ></span>
//   </a>
// ));

// const TweetMenu = ({ item }) => {
//   return (
//     <Wrapper>
//         <Dropdown>
//           <Dropdown.Toggle as={CustomToggle} />
//           <Dropdown.Menu size="sm" title="">
//             <Dropdown.Header>Options</Dropdown.Header>
//             <Dropdown.Item>abcd</Dropdown.Item>
//             <Dropdown.Item>erty</Dropdown.Item>
//             <Dropdown.Item>hnjm</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Wrapper>
//   );
// }
// export default TweetMenu;
