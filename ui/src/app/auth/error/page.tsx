export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
                <p className="text-gray-400 mb-6">
                    There was a problem signing you in. Please try again.
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                    Return Home
                </a>
            </div>
        </div>
    )
}
