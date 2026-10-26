import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing large base64 image uploads
app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: !!apiKey });
});

// API: Text-to-Speech using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, speed = 1.0 } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    const promptText = `Please pronounce the following Cantonese words clearly and naturally with standard Hong Kong Cantonese pronunciation: "${text}". Speak in Cantonese with a warm, encouraging pedagogical tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText,
              speechMetadata: {
                style: 'Clear, authentic native Hong Kong Cantonese language teacher',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Failed to generate speech audio' });
    }

    res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({
      error: 'TTS generation failed: ' + (err?.message || 'Unknown error'),
    });
  }
});

// API: Analyze Photo for Non-Chinese Speaking students (NCS)
app.post('/api/analyze-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const systemPrompt = `You are an expert Hong Kong Cantonese language teacher specializing in teaching Cantonese to Non-Chinese Speaking (NCS) students (非華語學生).
The student has taken or uploaded a photo of something in daily life in Hong Kong (e.g. street signs, MTR station signs, restaurant menus, food items, grocery labels, classroom notices, advertisements, daily objects).

Your tasks:
1. Identify all visible Chinese text and key everyday objects/scenes shown in the photo.
2. For each detected Chinese phrase or object label, provide:
   - "chinese": Traditional Chinese characters (繁體中文).
   - "jyutping": Standard Linguistic Society of Hong Kong (LSHK) Jyutping with tone numbers (1-6) e.g., "gwong2 dung1 waa2".
   - "english": Natural, accurate English meaning suitable for school students.
   - "category": One of "Food & Dining", "Transport & Directions", "Daily Life & Shopping", "School & Campus", "Signs & Notices", "Social & People".
   - "characters": Array of each individual character in the phrase:
     - "char": the single Chinese character
     - "jyutping": single character jyutping syllable with tone number (e.g., "dim2")
     - "tone": tone number 1 to 6
     - "toneName": Tone descriptive name, e.g., "Tone 2 (陰上 - High Rising 35)"
     - "meaning": English meaning of this single character
   - "colloquialNote": A practical, friendly tip about how Hong Kongers use this in real daily life (e.g., colloquial spoken Cantonese slang or dining culture).
   - "exampleSentence": An authentic everyday spoken Cantonese dialogue sentence using this word, with:
     - "chinese": Traditional Chinese sentence
     - "jyutping": Full Jyutping
     - "english": English translation
3. Provide a friendly scene summary ("sceneSummary") in English and Traditional Chinese explaining the context of this photo.
4. Provide 2-3 practical cultural/living tips ("culturalTips") for non-Chinese speaking students living or studying in Hong Kong.

Return the response strictly adhering to the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: systemPrompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Short title of the photo in Traditional Chinese and English (e.g. 茶餐廳點餐 (Tea Restaurant Order))',
            },
            sceneSummary: {
              type: Type.STRING,
              description: 'Encouraging explanation of what is in the photo for NCS students.',
            },
            culturalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Practical tips about Hong Kong life and Cantonese communication for this context.',
            },
            detectedTexts: {
              type: Type.ARRAY,
              description: 'List of vocabulary phrases detected in the photo.',
              items: {
                type: Type.OBJECT,
                properties: {
                  chinese: { type: Type.STRING, description: 'Traditional Chinese text' },
                  jyutping: { type: Type.STRING, description: 'Standard LSHK Jyutping with tones' },
                  english: { type: Type.STRING, description: 'English translation' },
                  category: { type: Type.STRING, description: 'Category' },
                  colloquialNote: { type: Type.STRING, description: 'Practical HK Cantonese colloquial tip' },
                  characters: {
                    type: Type.ARRAY,
                    description: 'Character-by-character breakdown',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        char: { type: Type.STRING },
                        jyutping: { type: Type.STRING },
                        tone: { type: Type.INTEGER },
                        toneName: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                      },
                      required: ['char', 'jyutping', 'tone', 'toneName', 'meaning'],
                    },
                  },
                  exampleSentence: {
                    type: Type.OBJECT,
                    properties: {
                      chinese: { type: Type.STRING },
                      jyutping: { type: Type.STRING },
                      english: { type: Type.STRING },
                    },
                    required: ['chinese', 'jyutping', 'english'],
                  },
                },
                required: ['chinese', 'jyutping', 'english', 'characters'],
              },
            },
          },
          required: ['title', 'sceneSummary', 'detectedTexts'],
        },
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Analyze photo error:', err);
    res.status(500).json({
      error: 'Failed to analyze photo: ' + (err?.message || 'Unknown error'),
    });
  }
});

// API: Convert custom Chinese text into detailed Jyutping breakdown
app.post('/api/convert-text', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    const prompt = `Convert and analyze the following text for a Non-Chinese Speaking student learning Hong Kong Cantonese:
Text: "${text}"

Provide:
1. Standard Traditional Chinese ("chinese")
2. Full standard LSHK Jyutping with tones ("jyutping")
3. Clear English translation ("english")
4. Character-by-character breakdown:
   - "char": single character
   - "jyutping": single syllable with tone
   - "tone": tone number (1-6)
   - "toneName": descriptive tone name (e.g. Tone 1 High Level 55)
   - "meaning": English meaning
5. Practical colloquial usage note ("colloquialNote") for daily HK conversation.
6. A natural example dialogue sentence using it.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chinese: { type: Type.STRING },
            jyutping: { type: Type.STRING },
            english: { type: Type.STRING },
            colloquialNote: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  jyutping: { type: Type.STRING },
                  tone: { type: Type.INTEGER },
                  toneName: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ['char', 'jyutping', 'tone', 'toneName', 'meaning'],
              },
            },
            exampleSentence: {
              type: Type.OBJECT,
              properties: {
                chinese: { type: Type.STRING },
                jyutping: { type: Type.STRING },
                english: { type: Type.STRING },
              },
              required: ['chinese', 'jyutping', 'english'],
            },
          },
          required: ['chinese', 'jyutping', 'english', 'characters'],
        },
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (err: any) {
    console.error('Convert text error:', err);
    res.status(500).json({
      error: 'Failed to convert text: ' + (err?.message || 'Unknown error'),
    });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Cantonese Jyutping Learning Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
