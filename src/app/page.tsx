export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            CAT Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Controlled Ambients Telemetry Dashboard
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Welcome
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and analyze environmental telemetry data in real-time.
            This dashboard provides comprehensive insights into controlled ambient conditions.
          </p>
        </div>
      </main>
    </div>
  );
}
