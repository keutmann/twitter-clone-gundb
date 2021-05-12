import React  from "react";
import { toast } from "react-toastify";
import useInput from "../../hooks/useInput";
import Input from ".././Input";
import Button from "../../styles/Button";
import Form from "../../styles/Form";
//import { displayError } from "../../utils";
//import Loader from "../Loader";
import useUser from '../../hooks/useUser';


const Login = ({ changeToSignup }) => {
  const email = useInput("t");
  const password = useInput("1");

  const loading = false;

  const { loginPassword } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.value || !password.value) {
      return toast.error("You need to fill all the fields");
    }

    const result = await loginPassword(email.value, password.value);

    if(!result.success)
      toast.error(result.msg, { autoClose: 5000});

    [email, password].map((field) => field.setValue(""));
  };

  return (
    <Form center onSubmit={handleLogin}>
      <Input
        text="Handle"
        type="text"
        value={email.value}
        onChange={email.onChange}
      />
      <Input
        text="Password"
        type="password"
        value={password.value}
        onChange={password.onChange}
      />

      <Button xl outline disabled={loading} type="submit">
        {loading ? "Logging in" : "Login"}
      </Button>
      <span>or</span>
      <Button xl type="button" onClick={changeToSignup}>
        Signup
      </Button>
    </Form>
  );
};

export default Login;