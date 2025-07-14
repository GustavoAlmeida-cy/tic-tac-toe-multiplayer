import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

const Login = ({ setIsAuth }) => {
  const cookies = new Cookies();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await Axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      const {
        token,
        userId,
        firstName,
        lastName,
        username: responseUsername,
      } = res.data;

      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      cookies.set("username", responseUsername);

      setIsAuth(true);
    } catch (err) {
      console.error(
        "Erro no login:",
        err?.response?.data?.message || err.message
      );
      alert(
        "Erro no login: " +
          (err?.response?.data?.message || "Verifique suas credenciais")
      );
    }
  };

  return (
    <div className="login">
      <label>Login</label>
      <input
        required
        placeholder="Username"
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        required
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
