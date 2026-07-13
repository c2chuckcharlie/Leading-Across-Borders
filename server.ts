import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Standard initialization as per gemini-api skill rules
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const COACH_SYSTEM_INSTRUCTION = `You are a Socratic, encouraging, but academically rigorous MBA professor coaching an international MBA student whose first language is not English. 
Your goal is to guide and sharpen their thinking, not to give them direct solutions or write their assignments for them.
Use clear, accessible but professional academic English. Always explain the "why" behind any feedback.
When the user specifies a target language ('zh' for Traditional Chinese / 繁體中文, 'ja' for Japanese / 日本語, or 'en' for English), make sure that your feedback, explanations, hints, and suggestions are rendered in that selected language, but maintain a high-level academic standard.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const READING_TEXT = `The Shift from Manager to Global AI Leader
Course reading — original material prepared for this module.
For most of the twentieth century, a good manager was someone who kept the machine running: plan the work, assign the tasks, watch the metrics, fix what breaks. That job mattered, and in many ways it still does. But a manager's core question is usually "how do we do this well?" — a question about execution inside a system that already exists.
Leadership asks a different question: "should we be doing this at all, and what should come next?" A leader looks at the same system a manager protects and asks whether it still serves its purpose. That shift — from protecting a process to questioning it — is uncomfortable, because it means giving up some of the certainty that made management feel safe.
Artificial intelligence is accelerating this shift. When software can already plan the work, watch the metrics, and even suggest the fix, the manager's traditional toolkit becomes less scarce and less valuable. What remains scarce is judgment: knowing which problems are worth solving, whose voices are missing from the room, and what a decision will mean for people in a different culture, market, or generation than your own.
This is why "global AI leadership" is not simply "management plus technology." It is the ability to hold three things at once: technical fluency (understanding what AI can and cannot responsibly do), cultural fluency (recognizing that trust, hierarchy, and communication mean different things in Tokyo, São Paulo, and Berlin), and ethical fluency (asking who benefits and who is put at risk by a given system, before it is built rather than after it fails).
None of this makes management obsolete. Every organization still needs people who make the daily work function. But the leaders who will matter most over the next decade are the ones who can move fluidly between the two modes — executing with discipline, and periodically stepping back to ask whether the system they are executing still deserves to exist.`;

  // API Endpoint: AI Discovery
  app.post("/api/ai/discovery", async (req, res) => {
    try {
      const { question, idx, lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
The student is exploring the following discovery question about a course reading:
"${question}"

Reading Context:
"""
${READING_TEXT}
"""

Instructions:
Help the student explore this question themselves in a Socratic manner. Do NOT write a final summary or answer for them.
Instead, guide their thinking, provide an interesting perspective, and end with a provocative question to stimulate further reflection.
Write the response in ${targetLangName}. Keep it to 3-4 short, clear sentences.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Discovery error:", error);
      res.status(500).json({ error: error.message || "Failed to generate discovery response" });
    }
  });

  // API Endpoint: Vocabulary Builder
  app.post("/api/ai/vocab", async (req, res) => {
    try {
      const { lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
Extract 10 advanced business/leadership vocabulary words from the following reading:
"""
${READING_TEXT}
"""

For each word, provide:
1. The word itself.
2. The pronunciation (simple spelling or IPA respelling).
3. A simple definition in plain English (under 12 words).
4. A professional business definition (under 15 words).
5. The Chinese translation (Traditional Chinese / 繁體中文) matching typical business contexts in Taiwan/Hong Kong.
6. The Japanese translation (in Japanese kanji/kana).
7. A short, highly original example sentence demonstrating its use in an executive scenario.
8. A common mistake that non-native English speakers make when using this word (under 12 words).

Make sure all explanation or mistake guidance fields are in ${targetLangName} if possible, while the Definitions should stay primarily in accessible English with additional clarification as needed.
Return a JSON array of exactly 10 objects.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "Array of 10 advanced vocabulary cards",
            items: {
              type: Type.OBJECT,
              required: ["word", "pronunciation", "simple_def", "business_def", "chinese", "japanese", "example", "mistake"],
              properties: {
                word: { type: Type.STRING },
                pronunciation: { type: Type.STRING },
                simple_def: { type: Type.STRING },
                business_def: { type: Type.STRING },
                chinese: { type: Type.STRING },
                japanese: { type: Type.STRING },
                example: { type: Type.STRING },
                mistake: { type: Type.STRING },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json({ vocab: parsed });
    } catch (error: any) {
      console.error("Vocab generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate vocabulary cards" });
    }
  });

  // API Endpoint: Critical thinking Question Socratic Hint
  app.post("/api/ai/critical-hint", async (req, res) => {
    try {
      const { question, answerSoFar, lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
The student is answering this Socratic critical-thinking question:
"${question}"

The student's current answer draft is:
"${answerSoFar || "(No answer drafted yet)"}"

Instructions:
Provide ONE helpful, encouraging Socratic hint that guides the student's thinking forward.
Do NOT give them the answer directly or write any arguments for them.
Ask a question or suggest looking at a specific angle of the reading (e.g. cultural differences, technological dependency, judgment versus metrics).
Write your response in ${targetLangName}. Keep it under 3 short sentences.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Critical thinking hint error:", error);
      res.status(500).json({ error: error.message || "Failed to generate hint" });
    }
  });

  // API Endpoint: Socratic feedback on the Concept Map
  app.post("/api/ai/concept-map", async (req, res) => {
    try {
      const { connections, lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
The student has connected several leadership concepts on an interactive concept map.
Connections made:
${connections && connections.length ? connections.join("; ") : "No connections created yet."}

Core concepts in the map are: AI, Leadership, Ethics, Culture, Innovation.

Instructions:
Provide brief, encouraging, and academically rigorous Socratic feedback on the connections the student has drawn.
Analyze the relationship between these categories in the context of global AI leadership.
Suggest one crucial connection they should explore or think about (e.g., how culture changes the ethics of AI, or how leadership mediates AI and innovation).
Write the feedback in ${targetLangName}. Keep it between 3-4 sentences.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Concept map feedback error:", error);
      res.status(500).json({ error: error.message || "Failed to generate concept map feedback" });
    }
  });

  // API Endpoint: Socratic coaching on reflection sentence
  app.post("/api/ai/sentence-coach", async (req, res) => {
    try {
      const { sentence, stepKey, promptText, lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
The student is drafting their MBA reflection, sentence-by-sentence.
This step prompt: "${promptText}"
Student's draft sentence: "${sentence || "(Empty)"}"

Instructions:
Review the student's sentence draft.
Provide a Socratic, encouraging critique.
- If empty, suggest how they can start (e.g., an introductory template or core idea to focus on).
- If very simple or descriptive (e.g., "I learned that leaders are different from managers"), offer 1 specific way they can elevate it to a graduate MBA level (e.g., adding "the cognitive shift", "strategic foresight", or connecting it to the rise of AI).
- Praise any strong analytical elements.
Write the feedback in ${targetLangName}. Keep it under 3 short sentences. Do NOT write the final sentence for them.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Sentence coach error:", error);
      res.status(500).json({ error: error.message || "Failed to generate sentence feedback" });
    }
  });

  // API Endpoint: English Coach Review
  app.post("/api/ai/english-coach", async (req, res) => {
    try {
      const { fullText, lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
Review this international MBA student's leadership reflection for English expression and clarity:
"${fullText}"

Provide review points across exactly these 7 standard categories in this exact order:
1. grammar
2. vocabulary
3. transitions
4. tone
5. passive_voice
6. wordiness
7. clarity

For each category:
- Identify if there is any issue (has_issue: boolean).
- If there is an issue, extract a short phrase of up to 15 words representing the issue (before) and suggest an improved phrase of up to 15 words (after).
- Provide a brief, Socratic, clear explanation of why this change improves their writing, written in ${targetLangName} (under 25 words).
- If there are no issues in a category, set has_issue to false, before and after to "", and write a brief, encouraging Socratic comment about why their writing is strong in this area in ${targetLangName}.

Return a JSON array of exactly 7 objects.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "7 English coaching review categories",
            items: {
              type: Type.OBJECT,
              required: ["category", "has_issue", "before", "after", "explanation"],
              properties: {
                category: { type: Type.STRING },
                has_issue: { type: Type.BOOLEAN },
                before: { type: Type.STRING },
                after: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json({ coaching: parsed });
    } catch (error: any) {
      console.error("English coach error:", error);
      res.status(500).json({ error: error.message || "Failed to perform English coaching" });
    }
  });

  // API Endpoint: MBA Quality Check
  app.post("/api/ai/quality-check", async (req, res) => {
    try {
      const { fullText, lang } = req.body;
      const targetLangName = lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English";

      const prompt = `
Evaluate this student's MBA reflection:
"${fullText}"

Score the reflection (0 to 100 integers) across exactly these 7 dimensions in this exact order:
1. Critical Thinking (Did they question assumptions or just repeat facts?)
2. Evidence (Did they ground their reflections in the reading?)
3. Leadership Insight (Do they understand the shift from execution to judgment?)
4. Reflection Depth (Did they show how their thinking has evolved?)
5. English Quality (Tone, vocabulary level, sentence structures)
6. Originality (Is it a unique take or generic?)
7. Completeness (Is it a fully developed, coherent narrative?)

For each dimension:
- Provide the category name.
- Assign a score between 0 and 100.
- Provide constructive, encouraging feedback written in ${targetLangName} (under 20 words).

Return a JSON array of exactly 7 objects.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: COACH_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "7 MBA Quality score categories",
            items: {
              type: Type.OBJECT,
              required: ["category", "score", "feedback"],
              properties: {
                category: { type: Type.STRING },
                score: { type: Type.INTEGER },
                feedback: { type: Type.STRING },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json({ quality: parsed });
    } catch (error: any) {
      console.error("Quality checker error:", error);
      res.status(500).json({ error: error.message || "Failed to perform MBA quality check" });
    }
  });

  // Vite and static asset configuration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
