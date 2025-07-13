import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";

// Carrega o .env a partir da raiz
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT_BECKEND || 3001;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

// Verifica se as variáveis existem
if (!api_key || !api_secret) {
  console.error("❌ API_KEY ou API_SECRET não definidas no .env");
  process.exit(1);
}

const serverClient = StreamChat.getInstance(api_key, api_secret);

const app = express();
app.use(cors());
app.use(express.json());

// Banco de dados em memória
const users = [];

// Rota de cadastro
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);

    const user = { userId, firstName, lastName, username, hashedPassword };
    users.push(user);

    res.json({ token, ...user });
  } catch (error) {
    console.error("Erro no /signup:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = serverClient.createToken(user.userId);
    res.json({ token, ...user });
  } catch (error) {
    console.error("Erro no /login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`[express] Server is running on port ${PORT}`);
});
