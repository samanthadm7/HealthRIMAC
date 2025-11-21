interface LeoResponseProps {
  interpretation: string;
}

export function LeoResponse({ interpretation }: LeoResponseProps) {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
        <div className="flex gap-4 items-start">
          {/* Leo Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🦁</span>
            </div>
          </div>
          
          {/* Message Bubble */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl rounded-tl-sm p-5 shadow-md border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-600">Leo</span>
                <span className="text-xs text-slate-400">• Asistente inteligente</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {interpretation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
