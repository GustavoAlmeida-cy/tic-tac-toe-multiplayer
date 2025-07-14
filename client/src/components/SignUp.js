import React, { useState, useMemo } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({ setIsAuth }) {
  const cookies = useMemo(() => new Cookies(), []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !username || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await Axios.post("http://localhost:3001/signup", {
        firstName,
        lastName,
        username,
        password,
      });

      const {
        token,
        userId,
        firstName: resFirstName,
        lastName: resLastName,
        username: resUsername,
      } = res.data;

      // Salva somente dados essenciais no cookie (não armazene hashedPassword no frontend)
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("firstName", resFirstName);
      cookies.set("lastName", resLastName);
      cookies.set("username", resUsername);

      setIsAuth(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Erro ao criar usuário. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signUp" onSubmit={signUp}>
      <label>Sign Up</label>

      <input
        required
        placeholder="First name"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={loading}
      />
      <input
        required
        placeholder="Last name"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={loading}
      />
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
        {loading ? "Criando..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SignUp;
