"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TestResult } from "../../types";

export default function ResultPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedResult = localStorage.getItem("testResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // If no result found, redirect to home
      router.push("/");
    }
  }, [router]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 80) return "Great job! Very good score!";
    if (percentage >= 70) return "Good work! Above average performance!";
    if (percentage >= 60) return "Fair performance. Keep practicing!";
    if (percentage >= 50) return "Below average. More practice needed.";
    return "Poor performance. Significant improvement required.";
  };

  const handleRetakeTest = () => {
    localStorage.removeItem("testResult");
    router.push("/test");
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xl text-gray-600">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Results
          </h1>
          <p className="text-gray-600">
            Here`s how you performed on the IELTS mock test
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Score Circle */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mb-4">
              <span
                className={`text-4xl font-bold ${getScoreColor(
                  result.percentage
                )}`}
              >
                {result.percentage}%
              </span>
            </div>
            <h2
              className={`text-xl font-semibold ${getScoreColor(
                result.percentage
              )}`}
            >
              {getScoreMessage(result.percentage)}
            </h2>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">
                Correct Answers:
              </span>
              <span className="text-xl font-bold text-green-600">
                {result.score}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">
                Total Questions:
              </span>
              <span className="text-xl font-bold text-gray-800">
                {result.total}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">
                Incorrect Answers:
              </span>
              <span className="text-xl font-bold text-red-600">
                {result.total - result.score}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Accuracy:</span>
              <span
                className={`text-xl font-bold ${getScoreColor(
                  result.percentage
                )}`}
              >
                {result.percentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {result.score}/{result.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetakeTest}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Retake Test
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Practice regularly to improve your IELTS
              score. Focus on areas where you made mistakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
