const TOKEN_KEY = 'smartpolls:jwt:v1';

function notifyAuthChange() {
  window.dispatchEvent(new Event('smartpolls-auth-change'));
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}
