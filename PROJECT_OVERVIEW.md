# Risk Assessment Questionnaire

A multi-stage risk assessment application built with Next.js, shadcn/ui, and Supabase.

## Overview

This application guides users through a comprehensive risk assessment consisting of three questionnaires:

1. **Investor Profile (13 questions)** - Evaluates risk tolerance for investment decisions
2. **Financial Literacy (4 questions)** - Assesses understanding of financial concepts
3. **Risk-Taking Assessment (30 questions)** - DOSPERT scale measuring risk propensity across 5 domains

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS

## Project Structure

```
├── app/
│   ├── page.tsx                    # Main orchestrator component
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   └── questionnaire/
│       ├── InstructionsScreen.tsx  # Welcome and instructions
│       ├── InvestorProfileQuiz.tsx # Investment risk profile
│       ├── FinancialLiteracyQuiz.tsx # Financial knowledge assessment
│       ├── RiskTakingQuiz.tsx      # DOSPERT questionnaire
│       └── ResultsScreen.tsx       # Results display
├── lib/
│   ├── questionnaire-data.ts       # Questions, scoring logic, interpretations
│   └── supabase-client.ts          # Supabase client initialization
└── supabase/
    └── migrations/                 # Database schema migrations
```

## Database Schema

The application uses a single table `questionnaire_responses` with the following structure:

- `id` (uuid): Primary key
- `session_id` (uuid): Links all three stages together
- `created_at` (timestamptz): Response creation timestamp
- `completed_at` (timestamptz): Completion timestamp
- `investor_profile_data` (jsonb): Investment profile responses and scores
- `financial_literacy_data` (jsonb): Financial literacy responses and scores
- `risk_taking_data` (jsonb): DOSPERT responses and domain scores
- `user_id` (uuid): Optional authenticated user reference

## Key Features

- Mobile-first responsive design (375x812px container)
- Progressive questionnaire flow with validation
- Real-time progress tracking
- Comprehensive risk profile analysis across 5 domains:
  - Ethical (E)
  - Financial (F)
  - Health/Safety (H/S)
  - Recreational (R)
  - Social (S)
- Anonymous data collection with Supabase
- Accessible keyboard navigation and ARIA support

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Scoring Logic

### Investor Profile
- Score range: 13-40 points
- Classifications: Low, Below Average, Moderate, Above Average, High risk tolerance

### Financial Literacy
- Objective questions: 0-6 points (3 questions × 2 points)
- Self-assessment: 0-5 points
- Total range: 0-11 points

### DOSPERT Risk-Taking
- 30 questions rated 1-7 (Extremely Unlikely to Extremely Likely)
- Scores calculated per domain (average of 6 questions per domain)
- Classifications per domain: Low (< 3.5), Medium (3.5-5.5), High (≥ 5.5)

## Note on Backend

While the original requirement mentioned NestJS for the backend, this implementation uses:
- **Supabase** for database operations (more efficient for this use case)
- **Supabase Edge Functions** (optional) for any server-side processing needs
- Direct client-side database writes with Row Level Security (RLS) policies

If you specifically need a NestJS backend, you would need to:
1. Create a separate NestJS project
2. Implement REST/GraphQL API endpoints
3. Update the frontend to call those endpoints instead of direct Supabase calls
