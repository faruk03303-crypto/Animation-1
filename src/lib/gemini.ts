import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const model = "gemini-3-flash-preview";

export async function generateScript(idea: string) {
  const prompt = `
    You are a professional anime and cartoon scriptwriter. 
    Create a high-quality animation script based on this idea: "${idea}".
    
    STYLE REQUIREMENTS:
    - Anime-inspired storytelling.
    - Detailed character movements (e.g., "Running with energy", "Flying gracefully", "Fighting with speed").
    - Multi-character interactions (e.g., "Handshake", "Giving Salam", "Talking with gestures").
    - Emotional depth (Happy, Sad, Angry, Surprised).
    
    The script should include:
    1. Scene descriptions (Background, Lighting, Mood).
    2. Character actions and expressions.
    3. Dialogue for each character.
    4. Camera directions (Zoom, Pan, Cut).
    
    Format the output as a structured JSON object with the following schema:
    {
      "title": "String",
      "scenes": [
        {
          "background": "String (e.g., Village, City, Classroom, Secret Lab)",
          "description": "String",
          "characters": [
            { 
              "name": "String", 
              "action": "String (Must be one of: Walking, Running, Sitting, Talking, Giving Salam, Driving Car, Happy, Sad, Fighting, Flying, Dancing, Handshake, Crying, Surprised, Driving Bike)", 
              "dialogue": "String",
              "position": { "x": Number (0-100), "y": Number (0-100) }
            }
          ],
          "duration": Number (seconds)
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}
