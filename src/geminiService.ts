import { GoogleGenAI } from "@google/genai";
import { UserStats } from "../types";

/**
 * Service for interacting with the Google Gemini API.
 * Uses relative imports to ensure compatibility with browser ESM.
 */
export const geminiService = {
  /**
   * Generates personalized coaching advice based on user stats.
   */
  async getAiCoachAdvice(stats: UserStats): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [{
            text: `Analyze these memory training statistics and provide 3-4 personalized, encouraging tips for improvement. 
            User Stats: Level ${stats.level}, XP ${stats.xp}, Total Sessions: ${stats.completedSessions}. 
            Format the response in clear, concise Markdown.`
          }]
        }],
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "Keep up the consistent practice to see your memory power grow!";
    } catch (error) {
      console.error("AI Coach Error:", error);
      return "Focus on short, frequent practice sessions to optimize neural consolidation.";
    }
  },

  /**
   * Generates a mnemonic story for a given number sequence.
   */
  async generateMnemonic(numberSequence: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [{
            text: `Create a short, vivid mnemonic story or mental image to help someone memorize this number sequence: ${numberSequence}. 
            Use simple word associations or the Major System where possible.`
          }]
        }],
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "Try breaking the number into 2-digit pairs and associating each with a familiar object.";
    } catch (error) {
      console.error("Mnemonic Generation Error:", error);
      return "Visualize the numbers as a path through your childhood home.";
    }
  }
};