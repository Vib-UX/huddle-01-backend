const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { AccessToken, Role } = require("@huddle01/server-sdk/auth");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to create a room
app.post("/create-room", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const { data } = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      { title },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "ak_9Pb15yhcJBrVj8Fn",
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error creating room:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Endpoint to generate an access token
app.get("/generate-token", async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    const accessToken = new AccessToken({
      apiKey: "ak_9Pb15yhcJBrVj8Fn",
      roomId,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
    });

    const token = await accessToken.toJwt();
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating token:", error.message);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
