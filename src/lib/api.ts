import axios, { AxiosInstance, AxiosError } from 'axios';
import { useEnvStore } from '@/stores/env-store';

class ApiClient {
  private instance: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use((config) => {
      const { config: envConfig, currentEnv } = useEnvStore.getState();
      config.baseURL = envConfig.apiUrl;

      // Add environment header
      config.headers['x-studio-environment'] = currentEnv.toUpperCase();

      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }

      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.accessToken = null;
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  // Books
  async getBooks(params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const response = await this.instance.get('/api/v1/content-studio/books', { params });
    return response.data;
  }

  async getBook(bookId: string) {
    const response = await this.instance.get(`/api/v1/content-studio/books/${bookId}`);
    return response.data;
  }

  async getBookChapters(bookId: string) {
    const response = await this.instance.get(`/api/v1/content-studio/books/${bookId}/chapters`);
    return response.data;
  }

  async getChapterDetail(chapterId: string) {
    const response = await this.instance.get(
      `/api/v1/content-studio/chapters/${chapterId}`
    );
    return response.data;
  }

  async updateChapterContent(chapterId: string, data: {
    htmlContent: string;
    corrections?: Array<{
      bookId: string;
      chapterId: string;
      actionType: string;
      selector: string;
      beforeHtml: string;
      afterHtml: string;
      lineNumber?: number;
    }>;
  }) {
    const response = await this.instance.put(
      `/api/v1/content-studio/chapters/${chapterId}`,
      data
    );
    return response.data;
  }

  async cleanChapterContent(chapterId: string) {
    const response = await this.instance.post(
      `/api/v1/content-studio/chapters/${chapterId}/clean`
    );
    return response.data;
  }

  async cleanBookContent(bookId: string) {
    const response = await this.instance.post(
      `/api/v1/content-studio/books/${bookId}/clean`
    );
    return response.data;
  }

  async startReview(bookId: string, reviewedBy: string) {
    const response = await this.instance.put(
      `/api/v1/content-studio/books/${bookId}/start-review`,
      { reviewedBy }
    );
    return response.data;
  }

  async approveBook(bookId: string, data: {
    reviewedBy: string;
    reviewNotes?: string;
    confirmText?: string;
  }) {
    const response = await this.instance.put(
      `/api/v1/content-studio/books/${bookId}/approve`,
      data
    );
    return response.data;
  }

  async rejectBook(bookId: string, data: {
    reviewedBy: string;
    reviewNotes: string;
  }) {
    const response = await this.instance.put(
      `/api/v1/content-studio/books/${bookId}/reject`,
      data
    );
    return response.data;
  }

  // Corrections
  async createCorrection(data: {
    bookId: string;
    chapterId: string;
    actionType: string;
    selector: string;
    beforeHtml: string;
    afterHtml: string;
    lineNumber?: number;
    ruleId?: string;
    ruleName?: string;
    confidence?: number;
  }) {
    const response = await this.instance.post('/api/v1/content-studio/corrections', data);
    return response.data;
  }

  async updateCorrection(correctionId: string, data: {
    status?: string;
    afterHtml?: string;
  }) {
    const response = await this.instance.put(
      `/api/v1/content-studio/corrections/${correctionId}`,
      data
    );
    return response.data;
  }

  async batchUpdateCorrections(correctionIds: string[], status: string) {
    const response = await this.instance.post('/api/v1/content-studio/corrections/batch', {
      correctionIds,
      status,
    });
    return response.data;
  }

  // Rules
  async getRules(params?: {
    source?: 'builtin' | 'learned' | 'custom';
    category?: string;
    isActive?: boolean;
  }) {
    const response = await this.instance.get('/api/v1/content-studio/rules', { params });
    return response.data;
  }

  async getRule(ruleId: string) {
    const response = await this.instance.get(`/api/v1/content-studio/rules/${ruleId}`);
    return response.data;
  }

  async createRule(data: {
    name: string;
    description: string;
    category: string;
    actionType: string;
    selector: string;
    pattern?: string;
    replacement?: string;
    priority?: number;
  }) {
    const response = await this.instance.post('/api/v1/content-studio/rules', data);
    return response.data;
  }

  async updateRule(ruleId: string, data: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    priority: number;
  }>) {
    const response = await this.instance.put(`/api/v1/content-studio/rules/${ruleId}`, data);
    return response.data;
  }

  async deleteRule(ruleId: string) {
    const response = await this.instance.delete(`/api/v1/content-studio/rules/${ruleId}`);
    return response.data;
  }

  async migrateRules(ruleIds: string[], targetEnvironment: string) {
    const response = await this.instance.post('/api/v1/content-studio/rules/migrate', {
      ruleIds,
      targetEnvironment,
    });
    return response.data;
  }

  async initializeBuiltInRules() {
    const response = await this.instance.post('/api/v1/content-studio/rules/initialize');
    return response.data;
  }

  // Learning
  async getPatterns(params?: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    minConfidence?: number;
  }) {
    const response = await this.instance.get('/api/v1/content-studio/learning/patterns', { params });
    return response.data;
  }

  async updatePatternStatus(patternId: string, status: 'APPROVED' | 'REJECTED') {
    const response = await this.instance.put(
      `/api/v1/content-studio/learning/patterns/${patternId}`,
      { status }
    );
    return response.data;
  }

  async getLearningStats() {
    const response = await this.instance.get('/api/v1/content-studio/learning/stats');
    return response.data;
  }
}

export const apiClient = new ApiClient();
