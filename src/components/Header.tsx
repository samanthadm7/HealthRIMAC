import { Stethoscope } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-2.5 rounded-lg shadow-md">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900">Búscador inteligente de especialistas</h1>
            <p className="text-sm text-red-600">Rimac Hackathon – Reto Data</p>
          </div>
        </div>
      </div>
    </header>
  );
}
