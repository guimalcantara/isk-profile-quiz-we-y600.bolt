'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { InvestorProfileData } from '@/app/page';
import { investorQuestions, calculateInvestorScore, getInvestorRiskProfile } from '@/lib/questionnaire-data';

type InvestorProfileQuizProps = {
  onComplete: (data: InvestorProfileData) => void;
};

export default function InvestorProfileQuiz({ onComplete }: InvestorProfileQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const radioGroupRef = useRef<HTMLDivElement>(null);

  const totalQuestions = investorQuestions.length;
  const currentQuestion = investorQuestions[currentStep];
  const currentResponse = responses[currentQuestion.id];

  useEffect(() => {
    if (radioGroupRef.current) {
      const firstRadio = radioGroupRef.current.querySelector('button');
      if (firstRadio) firstRadio.focus();
    }
  }, [currentStep]);

  const handleSelectOption = (questionId: string, choice: string) => {
    setResponses(prev => ({ ...prev, [questionId]: choice }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const score = calculateInvestorScore(responses);
      const profile = getInvestorRiskProfile(score);
      onComplete({ responses, score, profile });
    }
  };

  return (
    <main className="flex flex-col h-full bg-white">
      <header className="p-6 border-b border-gray-200">
        <h2 className="text-base font-bold text-center text-gray-800">
          Perfil de Investidor ({currentStep + 1}/{totalQuestions})
        </h2>
      </header>
      <div className="p-6 flex-grow overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-800 mb-6">{currentQuestion.text}</h2>
        <div ref={radioGroupRef} role="radiogroup" className="flex flex-col space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentResponse === option.choice;
            return (
              <button
                key={option.choice}
                onClick={() => handleSelectOption(currentQuestion.id, option.choice)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={index === 0 ? 0 : -1}
              >
                <span className="font-normal text-sm text-gray-700">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <footer className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-right">
        <Button
          onClick={handleNext}
          disabled={!currentResponse}
          className="px-6 py-3 font-semibold"
        >
          {currentStep === totalQuestions - 1 ? 'Continuar' : 'Próximo'}
        </Button>
      </footer>
    </main>
  );
}
