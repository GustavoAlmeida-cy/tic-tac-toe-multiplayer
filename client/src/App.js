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

  // Cria client apenas se a api_key existir
  const client = useMemo(() => {
    if (!api_key) {
      console.error("API key não definida!");
      return null;
    }
    return StreamChat.getInstance(api_key);
  }, [api_key]);

  const [isConnected, setIsConnected] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("username");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");

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
        const user = await client.connectUser(
          {
            id: cookies.get("userId"),
            name: cookies.get("username"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedPassword"),
          },
          token
        );

        console.log("Usuário conectado:", user);
        setIsAuth(true);
        setIsConnected(true);
      } catch (error) {
        console.error("Erro ao conectar usuário:", error);
        setIsAuth(false);
        setIsConnected(false);
      }
    };

    connectUser();

    // Não desconectamos aqui para evitar perda de token inesperada
  }, [token, client, cookies, isConnected]);

  if (!api_key) {
    return (
      <div className="App">
        <p style={{ color: "red" }}>
          ERRO: API Key não definida. Verifique seu arquivo .env e reinicie o
          servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button onClick={logOut}>Log Out</button>
        </Chat>
      ) : (
        <>
          <SignUp setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;
