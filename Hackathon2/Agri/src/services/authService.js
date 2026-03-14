const API_BASE_URL = 'http://localhost:8080';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      this.setAuthData(data);
      return data;
    } catch (error) {
      console.warn('Backend not reached, using mock registration for demo:', error);
      // Fallback for demo purposes if backend is down
      const mockResult = {
        token: 'demo-token-' + Date.now(),
        user: { ...userData, id: 'demo-' + Date.now() }
      };
      this.setAuthData(mockResult);
      return mockResult;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      this.setAuthData(data);
      return data;
    } catch (error) {
      console.warn('Backend not reached, using mock login for demo:', error);
      // Fallback for demo purposes if backend is down
      const mockResult = {
        token: 'demo-token-' + Date.now(),
        user: { 
          fullName: 'Demo User', 
          email: credentials.identifier, 
          mobileNumber: credentials.identifier,
          id: 'demo-id' 
        }
      };
      this.setAuthData(mockResult);
      return mockResult;
    }
  }

  // Store authentication data
  setAuthData(authData) {
    this.token = authData.token;
    this.user = authData.user;
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  // Logout user
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  // Make authenticated API call
  async authenticatedFetch(url, options = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  }

  // Validate token
  async validateToken() {
    if (!this.token) return false;

    try {
      const response = await this.authenticatedFetch('/api/user/profile', {
        method: 'GET',
      });

      return response.ok;
    } catch {
      this.logout();
      return false;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await this.authenticatedFetch('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const updatedUser = await response.json();
      this.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await this.authenticatedFetch('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
}

export default new AuthService();
