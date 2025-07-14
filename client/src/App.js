import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { useEffect, useState, useMemo } from "react";
import JoinGame from "./components/JoinGame";

function App() {
  const cookies = useMemo(() => new Cookies(), []);
  const token = cookies.get("token");
  const api_key = process.env.REACT_APP_API_KEY;

  const client = useMemo(() => {
    if (!api_key) {
      console.error("❌ API key não definida. Verifique seu .env.");
      return null;
    }
    return StreamChat.getInstance(api_key);
  }, [api_key]);

  const [isConnected, setIsConnected] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // alterna entre Login e SignUp

  const logOut = () => {
    const keys = [
      "token",
      "userId",
      "firstName",
      "lastName",
      "username",
      "hashedPassword",
      "channelName",
    ];
    keys.forEach((key) => cookies.remove(key));

    if (client) {
      client.disconnectUser();
    }

    setIsAuth(false);
    setIsConnected(false);
  };

  useEffect(() => {
    const connectUser = async () => {
      if (!token || !client || isConnected) return;

      try {
        await client.connectUser(
          {
            id: cookies.get("userId"),
            name: cookies.get("username"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedPassword"),
          },
          token
        );

        setIsAuth(true);
        setIsConnected(true);
      } catch (error) {
        console.error("Erro ao conectar usuário:", error);
        setIsAuth(false);
        setIsConnected(false);
      }
    };

    connectUser();
  }, [token, client, cookies, isConnected]);

  if (!api_key) {
    return (
      <div className="App">
        <p className="error-message">
          ❌ API Key não definida. Verifique o arquivo `.env` e reinicie o
          servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <nav className="navbar">
            <button className="logout-button" onClick={logOut}>
              🔓 Sair
            </button>
          </nav>
          <JoinGame />
        </Chat>
      ) : (
        <div className="auth-container">
          {showLogin ? (
            <Login setIsAuth={setIsAuth} />
          ) : (
            <SignUp setIsAuth={setIsAuth} />
          )}
          <button
            className="toggle-auth-btn"
            onClick={() => setShowLogin((prev) => !prev)}
          >
            {showLogin ? "🔁 Criar nova conta" : "🔐 Já tenho conta"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
