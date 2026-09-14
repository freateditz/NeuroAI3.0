import { useState } from "react";

export default function Chatbot() {
    const [isLoading, setIsLoading] = useState(true);
    const CHATBOT_URL = "http://localhost:8501";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <Navbar /> */}

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-spacegroteskbold text-gray-800">
                        🤖 NeuroAI Chatbot 💬
                    </h1>
                    <p className="text-gray-600 font-spacegroteskregular mt-2">
                        Chat with our AI assistant to help with your learning
                        journey
                    </p>
                </div>

                {/* Chatbot Container */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-[600px] bg-gray-100">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-spacegroteskregular">
                                    Loading Chatbot...
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Make sure the chatbot server is running on
                                    port 8501
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Streamlit Iframe */}
                    <iframe
                        src={CHATBOT_URL}
                        title="NeuroAI Chatbot"
                        className={`w-full h-[700px] border-0 ${isLoading ? "hidden" : "block"}`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                        allow="microphone"
                    />
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-blue-50 rounded-xl p-4">
                    <h3 className="font-spacegrotesksemibold text-blue-800 mb-2">
                        💡 How to use:
                    </h3>
                    <ul className="text-blue-700 font-spacegroteskregular space-y-1 text-sm">
                        <li>• Type your message in the input box</li>
                        <li>• Click "Send" to chat with the AI assistant</li>
                        <li>
                            • Click "Generate Analysis Report" to get a PDF
                            summary of your session
                        </li>
                    </ul>
                </div>

                {/* Connection Status */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                        Chatbot server:{" "}
                        <a
                            href={CHATBOT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {CHATBOT_URL}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
