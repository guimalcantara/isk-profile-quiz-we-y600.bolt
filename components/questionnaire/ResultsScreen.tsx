import { Button } from '@/components/ui/button';
import { InvestorProfileData, FinancialLiteracyData, RiskTakingData } from '@/app/page';
import { dospertDomains, dospertInterpretations } from '@/lib/questionnaire-data';

type ResultsScreenProps = {
  investorProfileData: InvestorProfileData | null;
  financialLiteracyData: FinancialLiteracyData | null;
  riskTakingData: RiskTakingData | null;
  onReset: () => void;
};

export default function ResultsScreen({
  investorProfileData,
  financialLiteracyData,
  riskTakingData,
  onReset,
}: ResultsScreenProps) {
  const domainOrder = ['E', 'H/S', 'R', 'S', 'F'];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 border-b flex-shrink-0 bg-white">
        <h2 className="text-base font-bold text-center text-gray-800">Seus Perfis</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Seu Perfil de Tomada de Risco</h3>

        {riskTakingData &&
          domainOrder.map(key => {
            const info = dospertDomains[key];
            const domainData = riskTakingData.domainScores[key];
            if (!domainData) return null;

            const interpretation = dospertInterpretations[key]?.[domainData.classification];

            return (
              <div
                key={key}
                className={`${info.color} p-4 rounded-xl shadow-sm border border-gray-200`}
              >
                <h4 className={`font-semibold ${info.textColor}`}>{info.name}</h4>
                <p className={`text-xs ${info.textColor}`}>
                  Média: {domainData.average.toFixed(1)}/7 • Perfil: {domainData.classification}
                </p>
                <p className={`mt-3 text-sm ${info.textColor}`}>{interpretation}</p>

                {key === 'F' && investorProfileData && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <h5 className="font-semibold text-green-800">Investimentos</h5>
                    <p className="text-sm font-semibold text-green-800 mt-2">
                      {investorProfileData.profile.title}
                    </p>
                    <p className="text-sm text-green-800 mt-2">
                      {investorProfileData.profile.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="p-4 mt-auto flex-shrink-0 border-t bg-white">
        <p className="text-xs text-gray-500 text-center mb-4">
          Nota: Estes resultados são uma ferramenta de autoconhecimento e não constituem um
          diagnóstico.
        </p>
        <Button onClick={onReset} className="w-full bg-gray-600 hover:bg-gray-500 py-6">
          Refazer Quiz
        </Button>
      </div>
    </div>
  );
}
