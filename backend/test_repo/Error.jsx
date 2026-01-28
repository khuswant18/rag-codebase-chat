import React from 'react'
import { AlertCircle } from 'lucide-react'

function Error() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading this page. Please try refreshing or go back.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default Error