const API_BASE = '/api';

export const AUTH_TOKEN_KEY = 'cm_auth_token';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = endpoint.startsWith('/') ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(url, config);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || `Lỗi yêu cầu máy chủ (${response.status})`);
  }

  return json.data !== undefined ? json.data : json;
}
