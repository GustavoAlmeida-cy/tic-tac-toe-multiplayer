import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

const Login = ({ setIsAuth }) => {
  const cookies = new Cookies();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const login = () => {
    Axios.post("http://localhost:3001/login", { username, password }).then(
      (res) => {
        const { token, userId, firstName, lastName, username } = res.data;

        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        cookies.set("username", username);

        setIsAuth(true);
      }
    );
  };

  return (
    <div className="login">
      <label>Login</label>
      <input
        placeholder="Username"
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
