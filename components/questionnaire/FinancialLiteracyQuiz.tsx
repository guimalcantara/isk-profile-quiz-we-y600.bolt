'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FinancialLiteracyData } from '@/app/page';
import { financialLiteracyQuestions, calculateFinLitScore, getFinLitProfile } from '@/lib/questionnaire-data';

type FinancialLiteracyQuizProps = {
  onComplete: (data: FinancialLiteracyData) => void;
};

export default function FinancialLiteracyQuiz({ onComplete }: FinancialLiteracyQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const groupRef = useRef<HTMLDivElement>(null);

  const totalQuestions = financialLiteracyQuestions.length;
  const currentQuestion = financialLiteracyQuestions[currentStep];
  const currentResponse = responses[currentQuestion.id];
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (groupRef.current) {
      const first = groupRef.current.querySelector('button, input[type="radio"]');
      if (first) (first as HTMLElement).focus();
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(s => s + 1);
    } else {
      const score = calculateFinLitScore(responses);
      const profile = getFinLitProfile(score.total);
      onComplete({ responses, score, profile });
    }
  };

  return (
    <main className="flex flex-col h-full bg-white">
      <header className="p-4 border-b flex-shrink-0">
        <h2 className="text-base font-bold text-center text-gray-800">
          Conhecimento Financeiro ({currentStep + 1}/{totalQuestions})
        </h2>
        <p className="text-xs text-gray-500 text-center mt-1">
          Indique sua resposta e avance.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="p-6 flex-grow overflow-y-auto">
        <h3 className="text-base font-semibold text-gray-900 mb-5">{currentQuestion.text}</h3>

        {currentQuestion.type === 'likert-5' ? (
          <div ref={groupRef}>
            <fieldset className="mt-4">
              <div role="radiogroup" className="flex justify-between items-center">
                {currentQuestion.options.map((opt) => (
                  <label key={opt.choice} className="cursor-pointer">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={opt.choice}
                      checked={currentResponse === opt.choice}
                      onChange={() => setResponses(p => ({ ...p, [currentQuestion.id]: opt.choice }))}
                      className="sr-only peer"
                    />
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-700 font-semibold transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-2 peer-checked:border-blue-600">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Baixo</span>
                <span>Médio</span>
                <span>Alto</span>
              </div>
            </fieldset>
          </div>
        ) : (
          <div ref={groupRef} role="radiogroup" className="flex flex-col space-y-4">
            {currentQuestion.options.map((opt, i) => {
              const selected = currentResponse === opt.choice;
              return (
                <button
                  key={opt.choice}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setResponses(p => ({ ...p, [currentQuestion.id]: opt.choice }))}
                  tabIndex={i === 0 ? 0 : -1}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selected
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-offset-2 ring-blue-500'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <span className="font-normal text-sm text-gray-700">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
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
