"use client";

import { adminAPI } from "@/lib/api";
import { QuestionWithAnswer } from "@/types";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionWithAnswer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setError(null);
      const questionsData = await adminAPI.getAllQuestions();
      setQuestions(questionsData);
    } catch (error) {
      setError("Failed to load questions. Please try again.");
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  const handleEdit = (question: QuestionWithAnswer) => {
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    });
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await adminAPI.deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (error) {
      alert("Failed to delete question. Please try again.");
      console.error("Error deleting question:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.questionText.trim()) {
      alert("Question text is required.");
      return;
    }

    if (formData.options.some((option) => !option.trim())) {
      alert("All options are required.");
      return;
    }

    try {
      if (editingQuestion) {
        // Update existing question
        const updatedQuestion = await adminAPI.updateQuestion(
          editingQuestion.id,
          formData
        );
        setQuestions(
          questions.map((q) =>
            q.id === editingQuestion.id ? updatedQuestion : q
          )
        );
      } else {
        // Create new question
        const newQuestion = await adminAPI.createQuestion(formData);
        setQuestions([...questions, newQuestion]);
      }

      resetForm();
    } catch (error) {
      alert("Failed to save question. Please try again.");
      console.error("Error saving question:", error);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-xl text-gray-600">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Question
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={loadQuestions}
              className="ml-4 text-red-800 hover:text-red-900 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Question Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Question Text
                  </label>
                  <textarea
                    value={formData.questionText}
                    onChange={(e) =>
                      setFormData({ ...formData, questionText: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="Enter your question here..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Answer Options
                  </label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() =>
                            setFormData({ ...formData, correctAnswer: index })
                          }
                          className="mr-2"
                        />
                        <span className="mr-2 font-medium">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-gray-600 mt-2">
                    Select the radio button next to the correct answer
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {editingQuestion ? "Update" : "Create"} Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Questions ({questions.length})
            </h2>

            {questions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No questions found. Add your first question to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 flex-1 pr-4">
                        {question.questionText}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(question)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-sm ${
                            index === question.correctAnswer
                              ? "bg-green-100 text-green-800 font-medium"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>{" "}
                          {option}
                          {index === question.correctAnswer && (
                            <span className="ml-2 text-xs">(Correct)</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Created:{" "}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
