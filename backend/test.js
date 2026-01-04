// Load environment variables
require('dotenv').config();

// Import the Google AI library
const { GoogleGenAI } = require("@google/genai");

// Get your API key
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error("Error: GOOGLE_AI_API_KEY is not set in your .env file.");
  process.exit(1);
}

// Initialize the client
const ai = new GoogleGenAI({ apiKey: apiKey });

async function listModels() {
  console.log("Fetching available models for your API key...");
  try {
    const response = await ai.models.list();

    const models = response.models; // <-- get the array from the response

    console.log("\n--- Available Models for Your Key ---");
    if (!models || models.length === 0) {
      console.log("No models found. Your API key or project might not have the Generative Language API enabled.");
      return;
    }

    for (const model of models) {
      console.log(`- ${model.name}`);
    }
    console.log("\nPick one of these model names and use it in your aiService.js file.");
  } catch (error) {
    console.error("\n❌ Failed to list models. This could indicate an issue with your API key or network.");
    console.error("Error Details:", error.message);
  }
}


listModels();