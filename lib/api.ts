import axios from "axios";
import { Question, QuestionWithAnswer, TestResult } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin CRUD operations
export const adminAPI = {
  // Savol qo'shish
  createQuestion: async (question: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  }): Promise<QuestionWithAnswer> => {
    const response = await api.post("/admin/questions", question);
    return response.data;
  },

  // Barcha savollar
  getAllQuestions: async (): Promise<QuestionWithAnswer[]> => {
    const response = await api.get("/admin/questions");
    return response.data;
  },

  // Bitta savol
  getQuestion: async (id: number): Promise<QuestionWithAnswer> => {
    const response = await api.get(`/admin/questions/${id}`);
    return response.data;
  },

  // Savolni yangilash
  updateQuestion: async (
    id: number,
    question: Partial<{
      questionText: string;
      options: string[];
      correctAnswer: number;
    }>
  ): Promise<QuestionWithAnswer> => {
    const response = await api.patch(`/admin/questions/${id}`, question);
    console.log(response, "data");
    return response.data;
  },

  // Savolni o'chirish
  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/admin/questions/${id}`);
  },
};

// User test operations
export const testAPI = {
  // Test uchun savollar
  getTestQuestions: async (): Promise<Question[]> => {
    const response = await api.get("/test/questions");
    return response.data;
  },

  // Test natijasini yuborish
  submitTest: async (answers: number[]): Promise<TestResult> => {
    const response = await api.post("/test/submit", { answers });
    return response.data;
  },
};
