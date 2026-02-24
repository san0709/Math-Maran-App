import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateBossChallenge(levelId: number, trickTitle: string, secretCode: string) {
  const prompt = `You are Math-Maran, a witty mental math wizard from Chennai. 
  The student is at Level ${levelId}: ${trickTitle}. The secret code is: ${secretCode}.
  
  Generate a "Boss Challenge" for a 7-10 year old kid. 
  The challenge should be a word problem set in a fun Chennai scenario (CSK, Marina Beach, Auto rides, Canteen food, etc.).
  
  Return the response in JSON format:
  {
    "scenario": "A fun story setting the problem",
    "question": "The actual math question (e.g., 'What is 11 x 45?')",
    "answer": 495,
    "maranComment": "A witty Tanglish encouragement"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating challenge:", error);
    // Fallback if AI fails
    return {
      scenario: "The CSK bus is stuck in T.Nagar traffic! To clear the road, you need to solve this.",
      question: "What is 11 x 12?",
      answer: 132,
      maranComment: "Super-pa! You can do it!"
    };
  }
}

export async function getMaranFeedback(isCorrect: boolean, userName: string) {
  const prompt = `You are Math-Maran, a witty mental math wizard from Chennai. 
  A student named ${userName} just ${isCorrect ? 'correctly solved' : 'failed to solve'} a math challenge.
  
  Give a short, witty feedback in Tanglish (English + Tamil sprinkles). 
  If correct: Be super excited, use "Super-pa!", "Correct-u!", "Semma!", "Vera-Level".
  If wrong: Be encouraging, say "Close-u!", "Try the trick again, nanba!", "Don't worry-u!".
  
  Keep it under 20 words.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    return isCorrect ? "Super-pa! You are a genius!" : "Close-u! Try again, nanba!";
  }
}
