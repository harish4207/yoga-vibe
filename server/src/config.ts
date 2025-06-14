import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  port: number;
  mongoUri: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  frontendUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  openai: {
    apiKey: string;
  };
  gemini: {
    apiKey: string;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  env: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/yogavibe',
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretjwtkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  env: process.env.NODE_ENV || 'development',
};

export { config }; 