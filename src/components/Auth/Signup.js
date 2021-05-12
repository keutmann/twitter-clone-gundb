import React from "react";
//import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import useInput from "../../hooks/useInput";
import Input from ".././Input";
import Button from "../../styles/Button";
import Form from "../../styles/Form";
//import { displayError } from "../../utils";
//import { SIGNUP } from "../../queries/auth";
//import { SignupGun } from "../../gundb";
//import { UserContext, UserObj } from "../../hooks/UserContext";

import useUser from '../../hooks/useUser';


const Signup = ({ changeToLogin, setIsLoggedIn }) => {
  const firstname = useInput("");
  const lastname = useInput("");
  const handle = useInput("t");
  const email = useInput("");
  const password = useInput("1");

  const loading = false;
  const { userSignUp } = useUser();
  
  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      // !firstname.value ||
      // !lastname.value ||
      !handle.value ||
      //!email.value ||
      !password.value
    ) {
      return toast.error("You need to fill in all the fields");
    }

    if (
      handle.value === "/" ||
      handle.value === "explore" ||
      handle.value === "settings/profile" ||
      handle.value === "nofications" ||
      handle.value === "bookmarks"
    ) {
      return toast.error("Your handle is not valid, try a different one");
    }

    const re = /^[a-z0-9]+$/i;

    if (re.exec(handle.value) === null) {
      return toast.error(
        "Your handle contains some non-alphanumeric characters, choose a better handle name"
      );
    }

    try {

      let profile = {
           id: '',
           firstname: firstname.value,
           lastname: lastname.value,
           handle: handle.value,
           email: email.value,
           password: password.value,
           fullname: '',
           avatar: '',
           website: '',
           location: ''
      };

      userSignUp(profile);

      //toast.success("You are logged in");
    } catch (err) {
      //return displayError(err);
      console.log(err);
      return toast.error(err);
    }

    [firstname, lastname, handle, email, password].map((field) =>
      field.setValue("")
    );
  };

  return (
    <Form center onSubmit={handleSignup}>
      {/* <div className="group-input">
        <Input
          text="First Name"
          value={firstname.value}
          onChange={firstname.onChange}
        />
        <Input
          text="Last Name"
          value={lastname.value}
          onChange={lastname.onChange}
        />
      </div> */}
      <Input text="Handle" value={handle.value} onChange={handle.onChange} />
      <div className="group-input">
        {/* <Input
          text="Email"
          type="email"
          value={email.value}
          onChange={email.onChange}
        /> */}
        <Input
          text="Password"
          type="password"
          value={password.value}
          onChange={password.onChange}
        />
      </div>
      <Button xl outline disabled={loading} type="submit">
        {loading ? "Signing in" : "Sign up"}
      </Button>
      <span>or</span>
      <Button xl type="button" onClick={changeToLogin}>
        Login
      </Button>
    </Form>
  );
};

export default Signup;

// /^[a-z0-9]+$/i
