import React, { useState, useMemo } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

const Login = ({ setIsAuth }) => {
  const cookies = useMemo(() => new Cookies(), []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (event) => {
    event.preventDefault(); // previne reload da página no submit

    if (!username || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

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
        username: resUsername,
      } = res.data;

      // Salva somente dados essenciais e seguros
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      cookies.set("username", resUsername);

      setIsAuth(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Verifique suas credenciais e tente novamente"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login" onSubmit={login}>
      <label>Login</label>
      <input
        required
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <input
        required
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
