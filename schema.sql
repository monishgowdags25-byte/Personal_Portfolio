-- SQL Schema Setup for Supabase Portfolio Database

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL,
    features TEXT[] NOT NULL,
    github_link TEXT,
    live_link TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Allow public read access to projects" ON projects
    FOR SELECT USING (true);

-- 3. Create Messages (Contact Form) Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public write access to messages
CREATE POLICY "Allow public write access to messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated read access (e.g. for Monish checking messages)
CREATE POLICY "Allow admin read access to messages" ON messages
    FOR SELECT TO authenticated USING (true);

-- 4. Create Visitors Table
CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY,
    count INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on visitors
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to visitors
CREATE POLICY "Allow public read access to visitors" ON visitors
    FOR SELECT USING (true);

-- 5. Atomic Visitor Increment Function (RPC)
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS integer AS $$
DECLARE
  current_count integer;
BEGIN
  -- Insert seed row for visitor count if it doesn't exist, else update it
  INSERT INTO visitors (id, count, updated_at)
  VALUES (1, 1, now())
  ON CONFLICT (id)
  DO UPDATE SET count = visitors.count + 1, updated_at = now()
  RETURNING count INTO current_count;
  
  RETURN current_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to public anon role
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO authenticated;


-- 6. Insert Seed Projects Data
INSERT INTO projects (title, description, tech_stack, features, github_link, live_link, image_url, featured)
VALUES 
(
    'MediGuardian AI',
    'A full-stack healthcare monitoring system for elderly people featuring an interactive user interface, medicine reminders, and emergency assistance.',
    ARRAY['FastAPI', 'React', 'Python', 'WebSockets', 'Tailwind CSS'],
    ARRAY['Full-stack healthcare monitoring system for elderly people with an interactive UI', 'Medicine reminders and automated notifications for missed medications', 'Real-time health tracking/monitoring for family members and caregivers', 'Emergency assistance features connecting users to nearby hospitals'],
    'https://github.com/geethamonishivu/mediguardian-ai',
    'https://mediguardian-ai.vercel.app',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Bharat Nirmaan — Rural Development & Government Services Portal',
    'A responsive platform designed to simplify and streamline rural access to critical government schemes and public services.',
    ARRAY['React', 'Node.js', 'Express.js', 'SQL', 'PostgreSQL', 'Tailwind CSS'],
    ARRAY['Responsive platform simplifying access to government schemes and public services', 'Secure authentication and role-based permissions', 'Optimized SQL operations for smooth, low-latency performance', 'Advanced search/filtering for quick information accessibility'],
    'https://github.com/geethamonishivu/bharat-nirmaan',
    'https://bharatnirmaan.vercel.app',
    'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Chess Tournament Management System — Chaduranga',
    'A robust MERN stack application for coordinating player registrations, arbiter roles, and automating chess pairings with a custom Swiss algorithm. Accepted for research publication (2026).',
    ARRAY['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Swiss Algorithm', 'Tailwind CSS'],
    ARRAY['Full-stack app (MongoDB, Express.js, React.js, Node.js)', 'Player and arbiter management, tournament creation, and match scheduling', 'Custom Swiss pairing algorithm for automated round pairings and live standings', 'Scalable REST APIs and database schema', 'Research Paper Accepted for Publication (2026)'],
    'https://github.com/geethamonishivu/chaduranga-chess',
    'https://chaduranga.vercel.app',
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    true
),
(
    'Notes Management Application',
    'A highly responsive, clean, and secure note-taking utility backed by MongoDB with search indexing and full CRUD operations.',
    ARRAY['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    ARRAY['Secure user authentication and full CRUD operations', 'MongoDB-backed storage with fast retrieval indexing', 'Search functionality and clean, minimal UI/UX for daily note writing'],
    'https://github.com/geethamonishivu/notes-app',
    'https://notes-app-demo.vercel.app',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    false
)
ON CONFLICT DO NOTHING;
