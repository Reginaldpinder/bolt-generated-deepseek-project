import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { config } from 'dotenv';

config();

const firebaseConfig = {
  credential: process.env.FIREBASE_PRIVATE_KEY
    ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
    : undefined,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Routes
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const response = await fetch(`https://api.deepseek.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-distill',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    res.status(200).json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
