import React from 'react'

const CreateNftSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br text-gray-300 animate-pulse">
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-6">
        <div className="h-12 w-3/4 bg-gray-700 rounded mb-8 mx-auto"></div>
        <div className="space-y-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl">
          <div className="h-48 w-full bg-gray-700 rounded-lg"></div>

          <div className="space-y-6">
            <div>
              <div className="h-4 w-1/4 bg-gray-700 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-700 rounded"></div>
            </div>

            <div>
              <div className="h-4 w-1/3 bg-gray-700 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-700 rounded"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="h-4 w-1/3 bg-gray-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-700 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-1/4 bg-gray-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-700 rounded"></div>
              </div>
            </div>

            <div>
              <div className="h-4 w-1/4 bg-gray-700 rounded mb-2"></div>
              <div className="h-32 w-full bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <div className="h-12 w-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateNftSkeleton

