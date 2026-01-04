const Groq = require("groq-sdk");
const config = require('../config/config');

// Initialize Groq client
const groq = new Groq({ apiKey: config.groq.apiKey });

/**
 * Process natural language text to extract menu item details using Groq
 * @param {string} text - Natural language input 
 * @returns {Object} - Extracted menu item details
 */
const processText = async (text) => {
  try {
    console.log("Processing text with Groq...");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts information about food items into a JSON format. You must only respond with valid JSON."
        },
        {
          role: "user",
          content: `
            Extract a professional title, description, and price from the following natural language text about a food item.

            Text: "${text}"

            Return the result as a JSON object with this format:
            {
              "title": "Professional title of the dish",
              "description": "Detailed description of the dish",
              "price": number (price in the local currency)
            }

            If the price is not explicitly mentioned, estimate a reasonable price based on the dish.
          `
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" } // Force JSON output
    });

    const resultText = chatCompletion.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error("Groq returned an empty response.");
    }

    const parsedResult = JSON.parse(resultText);
    console.log("Groq processed successfully:", parsedResult);
    return parsedResult;

  } catch (error) {
    console.error("Error processing text with Groq:", error);
    throw new Error("Failed to process text with AI");
  }
};

/**
 * Generate a free stock image URL based on the dish title
 * No API key required
 * @param {string} title - Dish title
 * @returns {string} - Image URL
 */
const generateImage = async (title) => {
  try {
    // Use Unsplash Source API to get a random food image
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(title)},food`;
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback to a local placeholder image
    return "/images/default-dish.png";
  }
};

module.exports = {
  processText,
  generateImage
};
