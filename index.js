require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const themes = [
  "Nature",
  "Space",
  "Animals",
  "City life",
  "Fantasy",
  "Sports",
  "Food",
  "Music",
  "Technology",
  "Emotions",
  "Seasons",
  "Mythology",
  "Underwater world",
  "Fairy tales",
  "Travel",
  "History",
  "Superheroes",
  "Abstract concepts",
  "Holidays",
  "Professions",
];
function getRandomTheme() {
  return themes[Math.floor(Math.random() * themes.length)];
}

const axios = require("axios");
const ElevenLabs = require("elevenlabs-node");

const voice = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: "21m00Tcm4TlvDq8ikWAM", // You can choose a different voice ID
});

const PERPLEXITY_API_KEY = process.env.PPLX_API_KEY; //process.env.PPLX_API_KEY;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

async function summarizeChat(messages) {
  const prompt = `Using the whole chat, be the users therapist and provide insights into the users' feelings and emotions. Write as a friend whos trying to help cope with their struggles.:\n\n${messages.join(
    "\n"
  )}\n\nProvide emotional support and emotional analysis  in a conversation with user in the first person. Keep it under 120 words`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes conversations and provides emotional insights and advice.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    return "Unable to generate summary at this time.";
  }
}

const TURN_DURATION = 15; // seconds
let currentDrawer = null;
let turnTimer = null;
let timeLeft = TURN_DURATION;
const users = new Set();
const chatHistory = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  users.add(socket.id);

  if (!currentDrawer) {
    startNewTurn(socket.id);
  }

  socket.on("chat message", async (message) => {
    socket.broadcast.emit("chat message", message);
    chatHistory.push(message);
    try {
      const audioResponse = await voice.textToSpeechStream({
        textInput: message,
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        stability: 0.35,
        similarityBoost: 0.8,
      });

      // Convert the audio stream to a Buffer
      const chunks = [];
      for await (const chunk of audioResponse) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      // Emit the audio to all clients
      io.emit("audio message", audioBuffer.toString("base64"));
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  });

  socket.on("canvas-update", (data) => {
    if (socket.id === currentDrawer) {
      socket.broadcast.emit("canvas-update", data);
    }
  });

  socket.on("end chat", async () => {
    const summary = await summarizeChat(chatHistory);
    io.emit("chat summary", summary);
    chatHistory.length = 0; // Clear chat history after summarization
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    console.log("User disconnected:", socket.id);

    if (socket.id === currentDrawer) {
      const remainingUsers = Array.from(users);
      if (remainingUsers.length > 0) {
        startNewTurn(remainingUsers[0]);
      } else {
        currentDrawer = null;
        clearInterval(turnTimer);
      }
    }
  });
});

function startNewTurn(userId) {
  if (currentDrawer) {
    io.to(currentDrawer).emit("turn-end");
  }

  currentDrawer = userId;
  timeLeft = TURN_DURATION;
  currentTheme = getRandomTheme();
  if (turnTimer) {
    clearInterval(turnTimer);
  }

  io.to(currentDrawer).emit("turn-start");
  io.emit("timer", timeLeft);
  io.emit("new-theme", currentTheme);
  turnTimer = setInterval(() => {
    timeLeft--;
    io.emit("timer", timeLeft);

    if (timeLeft === 0) {
      const userArray = Array.from(users);
      const currentIndex = userArray.indexOf(currentDrawer);
      const nextIndex = (currentIndex + 1) % userArray.length;
      startNewTurn(userArray[nextIndex]);
    }
  }, 1000);
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
