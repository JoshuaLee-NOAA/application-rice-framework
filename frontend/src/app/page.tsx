import { Database, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Application Portfolio Management Overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <Database className="h-4 w-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-navy-700">73</div>
          <p className="text-xs text-gray-600 mt-1">In portfolio</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Average RICE Score</p>
            <TrendingUp className="h-4 w-4 text-ocean-600" />
          </div>
          <div className="text-2xl font-bold text-ocean-600">17.2</div>
          <p className="text-xs text-gray-600 mt-1">Across all apps</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">25</div>
          <p className="text-xs text-gray-600 mt-1">Score ≥ 20</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Needs Attention</p>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">26</div>
          <p className="text-xs text-gray-600 mt-1">Score &lt; 10</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <p className="text-gray-600">
          Start by viewing your{' '}
          <a href="/applications" className="text-ocean-600 hover:text-ocean-700 underline">
            applications
          </a>{' '}
          or running a new{' '}
          <a href="/analysis" className="text-ocean-600 hover:text-ocean-700 underline">
            RICE analysis
          </a>
          .
        </p>
      </div>
    </div>
  );
}
