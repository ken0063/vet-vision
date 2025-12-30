import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const schema = {
  description: "Animal classification and body condition analysis result",
  type: "object",
  properties: {
    animal: { type: "string" },
    breed: { type: "string" },
    bodyType: { type: "string" },
    frameType: { type: "string" },
    estimatedWeight: { type: "number" },
    weightRange: { type: "string" }
  },
  required: ["animal", "breed", "bodyType", "frameType", "estimatedWeight", "weightRange"]
};

export const analyzeAnimal = async (base64Image, mimeType) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `Identify the animal type and breed. Also determine its body condition (e.g. lean/muscular/overweight), frame (small/medium/large), estimate the weight (kg), and give a typical weight range. 
    Return the result in structured JSON format.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Error analyzing animal:", error);
    throw error;
  }
};
