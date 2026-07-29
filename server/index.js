const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Request Parsing Middleware
app.use(helmet());
app.use(express.json());

// CORS configuration (allow frontend access)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Supabase Client Setup with Mock Fallback
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isMockDb = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-supabase-project.supabase.co') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Successfully connected to Supabase client.');
  } catch (error) {
    console.error('Failed to initialize Supabase. Running in mock mode.', error.message);
    isMockDb = true;
  }
} else {
  console.warn('WARNING: Supabase credentials are missing or default in environment. Running in Mock Database Mode.');
  isMockDb = true;
}

// --- Mock Database Memory Store ---
let mockVisitorsCount = 137; // initial mock visitor number
let mockMessages = [];
const mockProjects = [
  {
    id: "1-mock",
    title: 'MediGuardian AI (Mock)',
    description: 'A full-stack healthcare monitoring system for elderly people featuring an interactive user interface, medicine reminders, and emergency assistance.',
    tech_stack: ['FastAPI', 'React', 'Python', 'WebSockets', 'Tailwind CSS'],
    features: [
      'Full-stack healthcare monitoring system for elderly people with an interactive UI',
      'Medicine reminders and automated notifications for missed medications',
      'Real-time health tracking/monitoring for family members and caregivers',
      'Emergency assistance features connecting users to nearby hospitals'
    ],
    github_link: 'https://github.com/geethamonishivu/mediguardian-ai',
    live_link: 'https://mediguardian-ai.vercel.app',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: "2-mock",
    title: 'Bharat Nirmaan — Rural Development & Government Services Portal (Mock)',
    description: 'A responsive platform designed to simplify and streamline rural access to critical government schemes and public services.',
    tech_stack: ['React', 'Node.js', 'Express.js', 'SQL', 'PostgreSQL', 'Tailwind CSS'],
    features: [
      'Responsive platform simplifying access to government schemes and public services',
      'Secure authentication and role-based permissions',
      'Optimized SQL operations for smooth, low-latency performance',
      'Advanced search/filtering for quick information accessibility'
    ],
    github_link: 'https://github.com/geethamonishivu/bharat-nirmaan',
    live_link: 'https://bharatnirmaan.vercel.app',
    image_url: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: "3-mock",
    title: 'Chess Tournament Management System — Chaduranga (Mock)',
    description: 'A robust MERN stack application for coordinating player registrations, arbiter roles, and automating chess pairings with a custom Swiss algorithm. Accepted for research publication (2026).',
    tech_stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Swiss Algorithm', 'Tailwind CSS'],
    features: [
      'Full-stack app (MongoDB, Express.js, React.js, Node.js)',
      'Player and arbiter management, tournament creation, and match scheduling',
      'Custom Swiss pairing algorithm for automated round pairings and live standings',
      'Scalable REST APIs and database schema',
      'Research Paper Accepted for Publication (2026)'
    ],
    github_link: 'https://github.com/geethamonishivu/chaduranga-chess',
    live_link: 'https://chaduranga.vercel.app',
    image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: "4-mock",
    title: 'Notes Management Application (Mock)',
    description: 'A highly responsive, clean, and secure note-taking utility backed by MongoDB with search indexing and full CRUD operations.',
    tech_stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    features: [
      'Secure user authentication and full CRUD operations',
      'MongoDB-backed storage with fast retrieval indexing',
      'Search functionality and clean, minimal UI/UX for daily note writing'
    ],
    github_link: 'https://github.com/geethamonishivu/notes-app',
    live_link: 'https://notes-app-demo.vercel.app',
    image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

// --- Rate Limiters ---
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact submissions per windowMs
  message: { error: 'Too many messages sent from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const visitorLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 visitor page loads per minute
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

// --- API ROUTES ---

// 1. GET /api/projects
app.get('/api/projects', async (req, res) => {
  if (isMockDb) {
    return res.status(200).json(mockProjects);
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    // Graceful fallback to mock data on DB query failure
    res.status(200).json(mockProjects);
  }
});

// 2. GET /api/visitors
app.get('/api/visitors', visitorLimiter, async (req, res) => {
  if (isMockDb) {
    mockVisitorsCount++;
    return res.status(200).json({ count: mockVisitorsCount });
  }

  try {
    // Call the atomic PL/pgSQL RPC function setup in schema.sql
    const { data, error } = await supabase.rpc('increment_visitor_count');
    if (error) throw error;
    res.status(200).json({ count: data });
  } catch (error) {
    console.error('Error incrementing visitors:', error.message);
    // Graceful fallback to mock counter increment
    mockVisitorsCount++;
    res.status(200).json({ count: mockVisitorsCount });
  }
});

// 3. POST /api/contact
app.post(
  '/api/contact',
  contactLimiter,
  [
    // Validate and sanitize inputs
    body('name').trim().notEmpty().withMessage('Name is required.').escape(),
    body('email').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message content is required.').escape(),
  ],
  async (req, res) => {
    // Spam Protection: Honeypot check
    // bots will fill in all inputs they discover. 'website' is invisible to normal users.
    if (req.body.website) {
      console.log('Spam attempt detected via honeypot field');
      return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    if (isMockDb) {
      const newMessage = { id: `msg-${Date.now()}`, name, email, message, created_at: new Date() };
      mockMessages.push(newMessage);
      console.log('Mock Message Saved:', newMessage);
      return res.status(201).json({ success: true, message: 'Message sent successfully (Mock Mode).' });
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ name, email, message }]);

      if (error) throw error;
      res.status(201).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
      console.error('Error saving message:', error.message);
      res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
  }
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', databaseMode: isMockDb ? 'mock' : 'supabase' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
