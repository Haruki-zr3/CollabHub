const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(body.detail)
      ? body.detail.map(item => item.msg || 'Invalid request').join(' ')
      : body.detail;
    throw new Error(detail || body.message || 'The server request failed.');
  }
  return body;
}

export function withUserId(path, userId) {
  return `${path}${path.includes('?') ? '&' : '?'}user_id=${encodeURIComponent(userId)}`;
}
