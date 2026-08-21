// Client API wrapper for communicating with the FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function setCurrentUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch (e) {
      // Ignored
    }
    throw new Error(errorDetail);
  }

  // Handle PDF file download responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return response.blob();
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: any) => request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    login: (data: any) => request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    verifyEmail: (data: any) => request('/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    forgotPassword: (data: any) => request('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    resetPassword: (data: any) => request('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    logout: () => {
      removeAuthToken();
      return Promise.resolve({ message: 'Logged out successfully' });
    }
  },
  users: {
    me: () => request('/users/me'),
    getAll: () => request('/users'),
    updateRole: (userId: string, role: string) => request(`/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    }),
    delete: (userId: string) => request(`/users/${userId}`, {
      method: 'DELETE',
    }),
  },
  detector: {
    news: (text: string | null, url: string | null) => request('/detect/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, url }),
    }),
    deepfake: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/detect/deepfake', {
        method: 'POST',
        body: formData, // fetch will set content-type boundary automatically
      });
    }
  },
  reports: {
    generate: (analysisType: string, analysisId: string) => request(`/reports/generate/${analysisType}/${analysisId}`, {
      method: 'POST',
    }),
    getAll: () => request('/reports'),
    download: async (reportId: string, filename: string) => {
      const blob = await request(`/reports/download/${reportId}`);
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    }
  },
  analytics: {
    dashboard: () => request('/analytics/dashboard'),
    admin: () => request('/analytics/admin'),
  }
};
