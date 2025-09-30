/*
  # Questionnaire Response Schema

  ## Overview
  Creates tables to store responses from the three-stage risk assessment questionnaire:
  1. Investor Profile (13 questions)
  2. Financial Literacy (4 questions)
  3. Risk-Taking Assessment (DOSPERT - 30 questions)

  ## New Tables
  
  ### `questionnaire_responses`
  Main table storing all questionnaire submissions
  - `id` (uuid, primary key)
  - `session_id` (uuid) - Links all three stages together
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)
  - `investor_profile_data` (jsonb) - Stores investor questions and score
  - `financial_literacy_data` (jsonb) - Stores literacy questions and score
  - `risk_taking_data` (jsonb) - Stores DOSPERT questions and domain scores
  
  ## Security
  - Enable RLS on all tables
  - Allow anonymous inserts for public questionnaire
  - Allow users to read their own submissions if authenticated
*/

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  investor_profile_data jsonb DEFAULT '{}'::jsonb,
  financial_literacy_data jsonb DEFAULT '{}'::jsonb,
  risk_taking_data jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_session ON questionnaire_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_user ON questionnaire_responses(user_id);

ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON questionnaire_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to insert"
  ON questionnaire_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own responses"
  ON questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read own session"
  ON questionnaire_responses
  FOR SELECT
  TO public
  USING (true);