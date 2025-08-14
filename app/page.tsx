"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 animate-slideUp">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IELTS Mock Test Platform
          </h1>
          <p className="text-xl text-gray-600">
            Test your English skills with our mock IELTS examination
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            href="/test"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-8 px-6 rounded-lg text-center transition duration-200 transform hover:scale-105 animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-2xl mb-2">🎯</div>
            <h2 className="text-xl mb-2">Start Test</h2>
            <p className="text-blue-100">Begin your IELTS mock examination</p>
          </Link>

          <Link
            href="/admin"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-8 px-6 rounded-lg text-center transition duration-200 transform hover:scale-105 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h2 className="text-xl mb-2">Admin Panel</h2>
            <p className="text-green-100">Manage questions and settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
