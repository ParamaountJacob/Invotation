/*
  # Create submissions system

  1. New Tables
    - `submissions` - stores user idea submissions
    - `submission_files` - stores uploaded files for submissions  
    - `submission_updates` - tracks status changes and comments
    - `score_descriptions` - scoring system descriptions
    - `messages` - communication between users and admins

  2. Security
    - Enable RLS on all tables
    - Users can only see their own submissions
    - Admins can see and modify all submissions
    - Proper file access controls

  3. Features
    - Status tracking (pending, review, approved, rejected, development)
    - File upload support
    - Scoring system
    - Admin messaging
    - Update history
*/

-- Create submission status enum (handle existing type)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM ('pending', 'review', 'approved', 'rejected', 'development');
  END IF;
END $$;

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  idea_name text NOT NULL,
  short_description text NOT NULL,
  idea_stage text NOT NULL,
  idea_details text NOT NULL,
  funding_needs numeric,
  retail_price numeric,
  terms_accepted boolean NOT NULL DEFAULT false,
  status submission_status DEFAULT 'pending' NOT NULL,
  score numeric,
  admin_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create submission files table
CREATE TABLE IF NOT EXISTS submission_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create submission updates table
CREATE TABLE IF NOT EXISTS submission_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  status submission_status NOT NULL,
  comment text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create score descriptions table
CREATE TABLE IF NOT EXISTS score_descriptions (
  score numeric PRIMARY KEY,
  description text NOT NULL,
  market_potential text NOT NULL,
  next_steps text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Submissions policies
CREATE POLICY "Users can insert their own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update any submission"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Submission files policies
CREATE POLICY "Users can view files for their submissions"
  ON submission_files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions 
      WHERE id = submission_files.submission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for their submissions"
  ON submission_files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions 
      WHERE id = submission_files.submission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all submission files"
  ON submission_files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Submission updates policies
CREATE POLICY "Users can view updates for their submissions"
  ON submission_updates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions 
      WHERE id = submission_updates.submission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert submission updates"
  ON submission_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can view all submission updates"
  ON submission_updates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Score descriptions policies (public read)
CREATE POLICY "Anyone can view score descriptions"
  ON score_descriptions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage score descriptions"
  ON score_descriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their received messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = to_user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON submissions(user_id);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions(status);
CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS submission_files_submission_id_idx ON submission_files(submission_id);
CREATE INDEX IF NOT EXISTS submission_updates_submission_id_idx ON submission_updates(submission_id);
CREATE INDEX IF NOT EXISTS messages_from_user_idx ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS messages_to_user_idx ON messages(to_user_id);

-- Insert some sample score descriptions
INSERT INTO score_descriptions (score, description, market_potential, next_steps) VALUES
(85, 'Excellent submission with strong market potential', 'High market demand with clear differentiation', 'Move to development phase immediately'),
(70, 'Good submission with moderate potential', 'Solid market opportunity with some competition', 'Conduct additional market research'),
(55, 'Average submission requiring refinement', 'Limited market potential or high competition', 'Refine concept and resubmit'),
(40, 'Below average submission with significant issues', 'Unclear market fit or major technical challenges', 'Major revisions needed'),
(25, 'Poor submission not suitable for development', 'No clear market opportunity', 'Consider alternative approaches')
ON CONFLICT (score) DO NOTHING;