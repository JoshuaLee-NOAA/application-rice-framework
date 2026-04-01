import { RefreshCw } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-navy-500 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">RICE Framework</h1>
            <p className="text-xs text-ocean-200">
              NOAA Fisheries OCIO
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="px-3 py-1.5 text-sm font-medium bg-ocean-500 text-white border border-ocean-600 rounded-md hover:bg-ocean-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Run Analysis
          </button>
        </div>
      </div>
    </header>
  );
}
