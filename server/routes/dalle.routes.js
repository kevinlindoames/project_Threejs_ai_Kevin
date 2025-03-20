// Enhanced error handling for DALL-E route
import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log("Received prompt:", prompt);
    console.log("API Key exists:", !!process.env.OPENAI_API_KEY);

    // Add error handling for API call
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    console.log("OpenAI response received");

    // Validate response
    if (
      !response.data ||
      !response.data.data ||
      !response.data.data[0].b64_json
    ) {
      console.error(
        "Invalid response structure:",
        JSON.stringify(response.data)
      );
      return res
        .status(500)
        .json({ message: "Invalid response from OpenAI API" });
    }

    const image = response.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(
      "DALL-E API Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Error generating image",
      error: error.response ? error.response.data : error.message,
    });
  }
});

export default router;
