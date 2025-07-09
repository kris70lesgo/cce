import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Types
interface TasteGraph {
  primary: string[];
  adjacent: string[];
  emerging: string[];
}

interface TasteProfileRequest {
  seed: string;
}

interface EnrichPromptRequest {
  prompt: string;
  tasteGraph: TasteGraph;
}

interface QlooResponse {
  insights?: {
    primary?: string[];
    adjacent?: string[];
    emerging?: string[];
  };
  data?: any;
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// Route 1: POST /api/taste-profile
app.post('/api/taste-profile', async (req: Request<{}, {}, TasteProfileRequest>, res: Response) => {
  try {
    const { seed } = req.body;

    if (!seed || typeof seed !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Seed is required and must be a string'
      });
    }

    if (!process.env.QLOO_API_KEY || !process.env.QLOO_API_URL) {
      return res.status(500).json({
        error: 'Qloo API credentials not found',
        message: 'QLOO_API_KEY and QLOO_API_URL must be set in environment variables'
      });
    }

    try {
      console.log(`Calling Qloo API for seed: ${seed}`);
      const qlooResponse = await axios.post<QlooResponse>(
        `${process.env.QLOO_API_URL}/taste-profile`,
        { seed },
        {
          headers: {
            'Authorization': `Bearer ${process.env.QLOO_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Extract taste graph from Qloo response
      const insights = qlooResponse.data.insights || qlooResponse.data;
      const tasteGraph: TasteGraph = {
        primary: insights.primary || [],
        adjacent: insights.adjacent || [],
        emerging: insights.emerging || []
      };

      console.log('Qloo API call successful');
      res.json({
        seed,
        tasteGraph,
        source: 'qloo'
      });
    } catch (qlooError) {
      console.error('Qloo API failed:', (qlooError as AxiosError).message);
      res.status(502).json({
        error: 'Failed to fetch data from Qloo API',
        message: (qlooError as AxiosError).message
      });
    }
  } catch (error) {
    console.error('Error in /api/taste-profile:', error);
    res.status(500).json({
      error: 'Failed to generate taste profile',
      message: (error as Error).message
    });
  }
});

// Route 2: POST /api/enrich-prompt
app.post('/api/enrich-prompt', async (req: Request<{}, {}, EnrichPromptRequest>, res: Response) => {
  try {
    const { prompt, tasteGraph } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt is required and must be a string'
      });
    }

    if (!tasteGraph || !tasteGraph.primary || !tasteGraph.adjacent || !tasteGraph.emerging) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'TasteGraph is required with primary, adjacent, and emerging arrays'
      });
    }

    let enrichedPrompt: string;

    // Try to call Gemini API
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_URL) {
      try {
        console.log('Calling Gemini API for prompt enrichment');

        const systemPrompt = `You are a cultural context engine that enriches user prompts with personalized cultural insights. 

Given a user's taste profile, enhance their prompt by:
1. Adding culturally relevant references and contexts
2. Suggesting personalized elements based on their interests
3. Incorporating their emerging interests in subtle ways
4. Maintaining the original intent while making it more engaging

Taste Profile:
- Primary interests: ${tasteGraph.primary.join(', ')}
- Adjacent interests: ${tasteGraph.adjacent.join(', ')}
- Emerging interests: ${tasteGraph.emerging.join(', ')}

User's original prompt: "${prompt}"

Provide an enriched version of the user's prompt that feels natural and personalized.`;

        const geminiResponse = await axios.post<GeminiResponse>(
          `${process.env.GEMINI_API_URL}/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1000
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        );

        enrichedPrompt = geminiResponse.data.candidates[0].content.parts[0].text;
        console.log('Gemini API call successful');

      } catch (geminiError) {
        console.warn('Gemini API failed, using fallback enrichment:', (geminiError as AxiosError).message);
        
        // Fallback enrichment logic
        const primaryInterests = tasteGraph.primary.slice(0, 2).join(' and ');
        const adjacentInterests = tasteGraph.adjacent.slice(0, 2).join(' and ');
        const emergingInterests = tasteGraph.emerging[0];

        enrichedPrompt = `${prompt}

Consider incorporating elements that resonate with your interests in ${primaryInterests}. You might also enjoy exploring connections to ${adjacentInterests}, and perhaps touch on emerging trends like ${emergingInterests} for a fresh perspective.`;
      }
    } else {
      console.warn('Gemini API credentials not found, using fallback enrichment');
      
      // Simple fallback enrichment
      const allInterests = [...tasteGraph.primary, ...tasteGraph.adjacent, ...tasteGraph.emerging];
      const selectedInterests = allInterests.slice(0, 3).join(', ');
      
      enrichedPrompt = `${prompt}

Based on your cultural interests in ${selectedInterests}, this has been personalized to better match your taste profile.`;
    }

    res.json({
      originalPrompt: prompt,
      enrichedPrompt,
      tasteGraph,
      source: process.env.GEMINI_API_KEY ? 'gemini' : 'fallback'
    });

  } catch (error) {
    console.error('Error in /api/enrich-prompt:', error);
    res.status(500).json({
      error: 'Failed to enrich prompt',
      message: (error as Error).message
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'CCE (Cultural Context Engine) API',
    version: '1.0.0',
    endpoints: {
      'POST /api/taste-profile': 'Generate taste profile from seed',
      'POST /api/enrich-prompt': 'Enrich prompt with cultural context',
      'GET /health': 'Health check'
    }
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CCE Backend Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Qloo API: ${process.env.QLOO_API_KEY && process.env.QLOO_API_URL ? 'Configured' : 'Not configured (API calls will fail)'}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured (using fallback)'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;