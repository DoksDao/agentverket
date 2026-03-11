export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Logg inn på Agentverket
        </h2>
        {/* placeholder form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-post
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="bruker@eksempel.no"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Passord
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700"
          >
            Logg inn
          </button>
        </form>
      </div>
    </div>
  );
}
