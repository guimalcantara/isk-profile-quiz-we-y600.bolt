import { CircleAlert as AlertCircle, Lightbulb, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type InstructionsScreenProps = {
  onContinue: () => void;
};

export default function InstructionsScreen({ onContinue }: InstructionsScreenProps) {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-grow flex flex-col justify-between text-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-center mb-8">Instruções</h1>
          <div className="space-y-4">
            <div className="flex items-start bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <AlertCircle className="w-6 h-6 text-yellow-800 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-yellow-800">FIQUE ATENTO!</h2>
                <ul className="list-disc list-inside text-yellow-700 text-sm mt-1 space-y-1">
                  <li><strong>Duração:</strong> 5 a 10 minutos.</li>
                  <li>Responda todas as perguntas para que possamos calcular seus resultados.</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Lightbulb className="w-6 h-6 text-blue-800 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-blue-800">LEMBRE-SE</h2>
                <p className="text-blue-700 text-sm mt-1">
                  Não há respostas "corretas" ou "erradas", mas é importante preencher o que melhor
                  corresponde ao seu sentimento no momento.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-gray-100 p-4 rounded-lg border border-gray-200">
              <Lock className="w-6 h-6 text-gray-800 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-gray-800">CONFIDENCIALIDADE</h2>
                <p className="text-gray-700 text-sm mt-1">
                  Todas as informações fornecidas neste quiz serão tratadas de forma confidencial
                  e anônima. As respostas não permitem a identificação dos participantes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button
            onClick={onContinue}
            className="w-full bg-yellow-500 text-gray-900 font-bold py-6 hover:bg-yellow-400"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
