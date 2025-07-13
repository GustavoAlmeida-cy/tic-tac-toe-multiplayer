import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import { useEffect, useState, useMemo } from "react";

const api_key = process.env.REACT_APP_API_KEY;
const client = StreamChat.getInstance(api_key);

function App() {
  const cookies = useMemo(() => new Cookies(), []);
  const token = cookies.get("token");

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
    client.disconnectUser();
    setIsAuth(false);
  };

  useEffect(() => {
    if (token && !isConnected) {
      const connect = async () => {
        try {
          await client
            .connectUser(
              {
                id: cookies.get("userId"),
                name: cookies.get("username"),
                firstName: cookies.get("firstName"),
                lastName: cookies.get("lastName"),
                hashedPassword: cookies.get("hashedPassword"),
              },
              token
            )
            .then((user) => {
              setIsAuth(true);
              console.log(user);
            });
          setIsConnected(true);
        } catch (error) {
          console.error("Erro ao conectar usuário:", error);
        }
      };

      connect();
    }

    // Cleanup opcional (desconecta ao desmontar)
    return () => {
      if (client && client.disconnectUser) {
        client.disconnectUser();
      }
    };
  }, [token, isConnected, cookies]);

  return (
    <div className="App">
      {isAuth ? (
        <button onClick={logOut}>Log Out</button>
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
