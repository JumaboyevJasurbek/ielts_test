"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "../../lib/api";
import { Question } from "../../types";

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const questionsData = await testAPI.getTestQuestions();
      setQuestions(questionsData);
      setAnswers(new Array(questionsData.length).fill(-1));
    } catch (error) {
      setError("Failed to load questions. Please try again.");
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (answers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await testAPI.submitTest(answers);
      // Store result in localStorage and redirect
      localStorage.setItem("testResult", JSON.stringify(result));
      router.push("/result");
    } catch (error) {
      setError("Failed to submit test. Please try again.");
      console.error("Error submitting test:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xl text-gray-600">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={loadQuestions}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            IELTS Mock Test
          </h1>
          <p className="text-gray-600">
            Answer all questions and click submit to get your results
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {questions.map((question, questionIndex) => (
            <div key={question.id} className="mb-8 last:mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {questionIndex + 1}. {question.questionText}
              </h3>

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() =>
                        handleAnswerChange(questionIndex, optionIndex)
                      }
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-700">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4 border-t">
            <button
              onClick={handleSubmit}
              disabled={submitting || answers.includes(-1)}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>

            <div className="mt-4 text-sm text-gray-600">
              Answered: {answers.filter((a) => a !== -1).length} /{" "}
              {questions.length}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
