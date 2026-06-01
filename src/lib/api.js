const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://nicholas-cook9-backend.onrender.com/api/v1').replace(/\/$/, '');

const TOKEN_KEY = 'nicholas_cook9_portal_tokens';

export function getStoredSession() {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function storeSession(session) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}, retryOnUnauthorized = true) {
  const session = getStoredSession();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || body?.success === false) {
    if (response.status === 401 && retryOnUnauthorized && session?.refreshToken && path !== '/auth/refresh') {
      try {
        const refreshBody = await request('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: session.refreshToken }),
        }, false);

        storeSession(refreshBody.data);
        return request(path, options, false);
      } catch {
        clearSession();
      }
    }

    throw new Error(body?.message || 'Request failed');
  }

  return body;
}

export const api = {
  async login(credentials) {
    const body = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    storeSession(body.data);
    return body.data;
  },

  async logout() {
    const session = getStoredSession();
    if (!session?.refreshToken) return;

    await request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
  },

  async refreshToken() {
    const session = getStoredSession();
    if (!session?.refreshToken) throw new Error('Refresh token is missing');

    const body = await request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    }, false);
    storeSession(body.data);
    return body.data;
  },

  forgotPassword(email) {
    return request('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp(email, otp) {
    return request('/auth/password/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword(email, resetToken, password) {
    return request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ email, resetToken, password }),
    });
  },

  listUsers() {
    return request('/users').then((body) => body.data.users);
  },

  getMyProfile() {
    return request('/users/me').then((body) => body.data.user);
  },

  updateMyProfile(payload) {
    return request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then((body) => body.data.user);
  },

  changeMyPassword(payload) {
    return request('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getUser(id) {
    return request(`/users/${id}`).then((body) => body.data.user);
  },

  createDealer(payload) {
    return request('/users/dealers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((body) => body.data.user);
  },

  createUser(payload) {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((body) => body.data.user);
  },

  updateUserStatus(id, status) {
    return request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }).then((body) => body.data.user);
  },

  getDashboard() {
    return request('/dashboard').then((body) => body.data.dashboard);
  },

  getDealerDashboard() {
    return request('/dashboard/dealer').then((body) => body.data.dashboard);
  },

  getAnalytics() {
    return request('/dashboard/analytics').then((body) => body.data.analytics);
  },

  getProductPerformance() {
    return request('/dashboard/products').then((body) => body.data.productPerformance);
  },

  listClaims() {
    return request('/claims').then((body) => body.data.claims);
  },

  createClaim(payload) {
    return request('/claims', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((body) => body.data.claim);
  },

  getClaim(id) {
    return request(`/claims/${id}`).then((body) => body.data.claim);
  },

  updateClaimStatus(id, status) {
    return request(`/claims/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }).then((body) => body.data.claim);
  },

  listContracts() {
    return request('/contracts').then((body) => body.data.contracts);
  },

  createContract(payload) {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;

    return request('/contracts', {
      method: 'POST',
      body: isFormData ? payload : JSON.stringify(payload),
    }).then((body) => body.data.contract);
  },

  getContract(id) {
    return request(`/contracts/${id}`).then((body) => body.data.contract);
  },

  listDailyStats() {
    return request('/daily-stats').then((body) => body.data.dailyStats);
  },

  saveDailyStat(payload) {
    return request('/daily-stats', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((body) => body.data.dailyStat);
  },

  listNotifications() {
    return request('/notifications').then((body) => body.data);
  },

  markNotificationRead(id) {
    return request(`/notifications/${id}/read`, {
      method: 'PATCH',
    }).then((body) => body.data.notification);
  },

  markAllNotificationsRead() {
    return request('/notifications/read-all', {
      method: 'PATCH',
    }).then((body) => body.data);
  },
};
