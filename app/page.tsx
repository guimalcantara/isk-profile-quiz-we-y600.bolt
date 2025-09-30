'use client';

import { useState } from 'react';
import InstructionsScreen from '@/components/questionnaire/InstructionsScreen';
import InvestorProfileQuiz from '@/components/questionnaire/InvestorProfileQuiz';
import FinancialLiteracyQuiz from '@/components/questionnaire/FinancialLiteracyQuiz';
import RiskTakingQuiz from '@/components/questionnaire/RiskTakingQuiz';
import ResultsScreen from '@/components/questionnaire/ResultsScreen';

export type InvestorProfileData = {
  responses: Record<string, string>;
  score: number;
  profile: {
    title: string;
    description: string;
  };
};

export type FinancialLiteracyData = {
  responses: Record<string, string>;
  score: {
    objective: number;
    selfScore: number;
    total: number;
  };
  profile: {
    title: string;
    description: string;
  };
};

export type RiskTakingData = {
  responses: Record<number, number>;
  domainScores: Record<string, { average: number; classification: string }>;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const [investorProfileData, setInvestorProfileData] = useState<InvestorProfileData | null>(null);
  const [financialLiteracyData, setFinancialLiteracyData] = useState<FinancialLiteracyData | null>(null);
  const [riskTakingData, setRiskTakingData] = useState<RiskTakingData | null>(null);

  const handleInvestorComplete = (data: InvestorProfileData) => {
    setInvestorProfileData(data);
    setCurrentScreen(3);
  };

  const handleFinancialLiteracyComplete = (data: FinancialLiteracyData) => {
    setFinancialLiteracyData(data);
    setCurrentScreen(4);
  };

  const handleRiskTakingComplete = (data: RiskTakingData) => {
    setRiskTakingData(data);
    setCurrentScreen(5);
  };

  const handleReset = () => {
    setCurrentScreen(1);
    setInvestorProfileData(null);
    setFinancialLiteracyData(null);
    setRiskTakingData(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md h-[812px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-900">
        {currentScreen === 1 && (
          <InstructionsScreen onContinue={() => setCurrentScreen(2)} />
        )}
        {currentScreen === 2 && (
          <InvestorProfileQuiz onComplete={handleInvestorComplete} />
        )}
        {currentScreen === 3 && (
          <FinancialLiteracyQuiz onComplete={handleFinancialLiteracyComplete} />
        )}
        {currentScreen === 4 && (
          <RiskTakingQuiz
            sessionId={sessionId}
            investorProfileData={investorProfileData}
            financialLiteracyData={financialLiteracyData}
            onComplete={handleRiskTakingComplete}
          />
        )}
        {currentScreen === 5 && (
          <ResultsScreen
            investorProfileData={investorProfileData}
            financialLiteracyData={financialLiteracyData}
            riskTakingData={riskTakingData}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
