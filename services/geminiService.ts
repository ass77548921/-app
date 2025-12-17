import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeatherForecast = async (location: string): Promise<WeatherData> => {
  const modelId = "gemini-2.5-flash"; // Efficient and supports search grounding

  const prompt = `
    I need the weather forecast for ${location} for today and the next 6 days (7 days total).
    Use Google Search to find the most accurate and up-to-date weather information.

    After finding the information, Format the output STRICTLY as a JSON object with the following structure.
    Do not use Markdown formatting (like \`\`\`json) if you can avoid it, but if you do, I will parse it.

    Structure:
    {
      "location": "City, Country",
      "currentTemp": number (current temperature in Celsius),
      "currentCondition": "string (e.g. Sunny)",
      "forecast": [
        {
          "date": "YYYY-MM-DD",
          "day": "Day Name (e.g. Monday)",
          "maxTemp": number (Celsius),
          "minTemp": number (Celsius),
          "condition": "Short condition (Sunny, Cloudy, Rain, Snow, Storm, Fog, Partly Cloudy)",
          "description": "Short description of the day's weather",
          "icon": "one of: sun, cloud, rain, snow, storm, fog, partly-cloudy",
          "precipitationChance": number (0-100)
        }
        ... (7 days total)
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" // Not allowed with googleSearch
      },
    });

    const text = response.text || "";
    
    // Extract JSON from the text response
    // Sometimes the model wraps it in ```json ... ``` or adds conversational text.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error("Raw response:", text);
      throw new Error("Could not parse weather data from Gemini response.");
    }

    const jsonString = jsonMatch[0];
    const parsedData = JSON.parse(jsonString) as WeatherData;

    // Extract grounding sources if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web?.uri && web?.title)
      .map((web: any) => ({ uri: web.uri, title: web.title }));

    return {
      ...parsedData,
      sources: sources || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
