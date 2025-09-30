'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RiskTakingData, InvestorProfileData, FinancialLiteracyData } from '@/app/page';
import { dospertQuestions, dospertScale, calculateDospertResults } from '@/lib/questionnaire-data';
import { createClient } from '@/lib/supabase-client';

type RiskTakingQuizProps = {
  sessionId: string;
  investorProfileData: InvestorProfileData | null;
  financialLiteracyData: FinancialLiteracyData | null;
  onComplete: (data: RiskTakingData) => void;
};

export default function RiskTakingQuiz({
  sessionId,
  investorProfileData,
  financialLiteracyData,
  onComplete,
}: RiskTakingQuizProps) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [validationError, setValidationError] = useState<string>('');
  const [unansweredIds, setUnansweredIds] = useState<number[]>([]);

  const instruction =
    'Indique a probabilidade de sua ação em cada situação, utilizando a escala de 1 (Extremamente Improvável) a 7 (Extremamente Provável).';

  const handleResponse = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (unansweredIds.includes(questionId)) {
      setUnansweredIds(prev => prev.filter(id => id !== questionId));
    }
  };

  const handleFinalize = async () => {
    const unanswered = dospertQuestions.filter(q => !responses.hasOwnProperty(q.id));

    if (unanswered.length > 0) {
      setValidationError('Por favor, responda a todas as questões.');
      setUnansweredIds(unanswered.map(q => q.id));
      const firstCard = document.getElementById(`question-card-${unanswered[0].id}`);
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationError('');
    const domainScores = calculateDospertResults(responses);
    const riskData: RiskTakingData = { responses, domainScores };

    const supabase = createClient();
    await supabase.from('questionnaire_responses').insert({
      session_id: sessionId,
      investor_profile_data: investorProfileData,
      financial_literacy_data: financialLiteracyData,
      risk_taking_data: riskData,
      completed_at: new Date().toISOString(),
    });

    onComplete(riskData);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-base font-bold text-center text-gray-800">
          Tomada de Risco
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {dospertQuestions.map(q => {
          const currentValue = responses[q.id];
          const hasError = unansweredIds.includes(q.id);

          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className={`bg-gray-50 p-4 rounded-lg border-2 transition-colors ${
                hasError ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              <p className="text-base font-semibold text-gray-800">{q.text}</p>
              <p className="text-xs italic text-gray-500 mt-1">{instruction}</p>
              <fieldset className="mt-4">
                <div className="flex justify-between items-center">
                  {Array.from({ length: 7 }, (_, i) => {
                    const value = i + 1;
                    const isChecked = value === currentValue;
                    return (
                      <label
                        key={value}
                        className="cursor-pointer relative group"
                        title={dospertScale.labels[value] || ''}
                      >
                        <input
                          type="radio"
                          name={`dospert-q${q.id}`}
                          value={value}
                          checked={isChecked}
                          onChange={() => handleResponse(q.id, value)}
                          className="sr-only peer"
                        />
                        <span
                          className={`flex items-center justify-center w-9 h-9 rounded-lg font-semibold transition-all ${
                            isChecked
                              ? 'bg-blue-600 text-white border-2 border-blue-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {value}
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {dospertScale.labels[value]}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          );
        })}
      </div>
      <div className="p-4 mt-auto flex-shrink-0 border-t">
        {validationError && (
          <p className="text-red-600 text-sm text-center mb-2">{validationError}</p>
        )}
        <Button onClick={handleFinalize} className="w-full bg-green-600 hover:bg-green-500 py-6">
          Finalizar
        </Button>
      </div>
    </div>
  );
}
