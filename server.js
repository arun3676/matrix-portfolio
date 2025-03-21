const express = require('express');
const cors = require('cors');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Store chat histories (in production, use a database instead)
const chatHistories = {};

// Root endpoint to serve the HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Matrix chat endpoint
app.post('/api/chat/matrix', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a mysterious AI from the Matrix. Speak in cryptic, philosophical terms with references to \"the system,\" \"the one,\" and other Matrix movie concepts. Use phrases like \"The Matrix has you\" and \"There is no spoon.\" Your tone should be mysterious and intriguing." },
        { role: "user", content: message }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    res.json({ reply: completion.data.choices[0].message.content });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'The Matrix has glitched. Try again.' });
  }
});

// Universe of Knowledge endpoint
app.post('/api/chat/universe', async (req, res) => {
  try {
    const { message, topic } = req.body;
    
    let prompt = "You are the Universe of Knowledge, an all-knowing entity that explains complex topics in engaging, simple terms. Make your explanations vivid and use metaphors that relate to space, stars, and cosmic phenomena.";
    if (topic) {
      prompt += ` The topic is: ${topic}.`;
    }
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    res.json({ reply: completion.data.choices[0].message.content });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'The universe is currently unexplorable. Try again later.' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});