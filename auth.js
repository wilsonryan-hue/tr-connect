/**
 * Authentication handler for TR-Connect
 * Provides password setup and verification with cross-device support
 */

class AuthHandler {
  constructor() {
    this.credentials = null;
    this.sessionToken = null;
    this.loadCredentials();
  }

  /**
   * Load credentials from staff-auth.json
   */
  async loadCredentials() {
    try {
      const response = await fetch('./staff-auth.json?t=' + Date.now());
      const data = await response.json();
      this.credentials = data.book || {};
    } catch (error) {
      console.error('Failed to load credentials:', error);
      this.credentials = {};
    }
  }

  /**
   * Generate a secure hash using SubtleCrypto (browser native)
   */
  async hashPassword(password) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Hashing error:', error);
      // Fallback to simple hash if SubtleCrypto fails
      return this.simpleHash(password);
    }
  }

  /**
   * Fallback simple hash function
   */
  simpleHash(password) {
    let hash = 0;
    if (password.length === 0) return hash.toString();
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Check if a user needs password setup
   */
  needsPasswordSetup(username) {
    return !this.credentials[username] || this.credentials[username] === null;
  }

  /**
   * Get all users that need password setup
   */
  getUsersNeedingSetup() {
    return Object.keys(this.credentials).filter(user => this.needsPasswordSetup(user));
  }

  /**
   * Set up a new password for a user (first time)
   */
  async setupPassword(username, newPassword) {
    // Ensure credentials are loaded
    if (!this.credentials) {
      await this.loadCredentials();
    }

    // Check if user exists in the system
    if (!(username in this.credentials)) {
      return { success: false, error: 'User not found in system' };
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return { 
        success: false, 
        error: 'Password must contain uppercase, lowercase, and numbers'
      };
    }

    try {
      // Hash the new password
      const passwordHash = await this.hashPassword(newPassword);

      // Update local credentials
      this.credentials[username] = passwordHash;

      // Save to localStorage for immediate use
      this.saveCredentialsLocally();

      // Note: In a real app, you'd send this to a server
      console.log('Password setup for:', username);

      return { success: true, message: 'Password set successfully!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify username and password
   */
  async verify(username, password) {
    // Ensure credentials are loaded
    if (!this.credentials) {
      await this.loadCredentials();
    }

    // Check if user exists
    if (!(username in this.credentials)) {
      return { success: false, error: 'User not found' };
    }

    // Check if password needs setup
    if (this.needsPasswordSetup(username)) {
      return { success: false, error: 'PASSWORD_SETUP_REQUIRED' };
    }

    try {
      // Hash the provided password
      const passwordHash = await this.hashPassword(password);

      // Verify password
      const isValid = this.credentials[username] === passwordHash;

      if (isValid) {
        // Generate session token
        this.sessionToken = this.generateToken();
        this.saveSession(username);
        return { success: true, message: 'Login successful' };
      }

      return { success: false, error: 'Invalid password' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate a secure session token
   */
  generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Save session to localStorage
   */
  saveSession(username) {
    const session = {
      username,
      token: this.sessionToken,
      timestamp: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
    localStorage.setItem('trconnect_session', JSON.stringify(session));
  }

  /**
   * Save credentials to localStorage for offline support
   */
  saveCredentialsLocally() {
    const data = {
      credentials: this.credentials,
      updated: new Date().toISOString()
    };
    localStorage.setItem('trconnect_credentials', JSON.stringify(data));
  }

  /**
   * Load credentials from localStorage if available
   */
  async loadCredentialsLocally() {
    try {
      const data = JSON.parse(localStorage.getItem('trconnect_credentials') || '{}');
      if (data.credentials) {
        this.credentials = data.credentials;
        return true;
      }
    } catch (error) {
      console.error('Failed to load local credentials:', error);
    }
    return false;
  }

  /**
   * Get current session if valid
   */
  getSession() {
    try {
      const session = JSON.parse(localStorage.getItem('trconnect_session') || '{}');
      if (session.expires && new Date(session.expires) > new Date()) {
        return session;
      }
      localStorage.removeItem('trconnect_session');
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.getSession() !== null;
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('trconnect_session');
    this.sessionToken = null;
  }
}

// Export for use
const authHandler = new AuthHandler();

// Make available globally for HTML forms
window.authenticateUser = async function(username, password) {
  const result = await authHandler.verify(username, password);
  if (result.success) {
    window.dispatchEvent(new CustomEvent('auth-success', { detail: { username } }));
  } else if (result.error === 'PASSWORD_SETUP_REQUIRED') {
    window.dispatchEvent(new CustomEvent('password-setup-required', { detail: { username } }));
  } else {
    window.dispatchEvent(new CustomEvent('auth-failed', { detail: { error: result.error } }));
  }
  return result;
};

window.setupPassword = async function(username, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }
  const result = await authHandler.setupPassword(username, newPassword);
  if (result.success) {
    window.dispatchEvent(new CustomEvent('password-setup-success', { detail: { username } }));
  } else {
    window.dispatchEvent(new CustomEvent('password-setup-failed', { detail: { error: result.error } }));
  }
  return result;
};
