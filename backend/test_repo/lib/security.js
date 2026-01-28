
export const secureStorage = {
  set: (key, value) => {
    try {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Failed to store in localStorage:', error);
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to retrieve from localStorage:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
};


export const securityCheck = {
  hasSensitiveData: () => {
    const sensitiveKeys = ['auth_token', 'auth_user', 'user', 'token', 'jwt'];
    try {
      for (const key of sensitiveKeys) {
        if (localStorage.getItem(key)) {
          console.warn(`⚠️  SECURITY WARNING: Sensitive data found in localStorage: ${key}`);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  },


  clearSensitiveData: () => {
    const sensitiveKeys = ['auth_token', 'auth_user', 'user', 'token', 'jwt'];
    try {
      sensitiveKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      // console.log('✅ Cleared any sensitive data from localStorage');
    } catch (error) {
      console.warn('Failed to clear sensitive data:', error);
    }
  },


  validateAuthState: () => {
    const hasSensitive = securityCheck.hasSensitiveData();
    if (hasSensitive) {
      securityCheck.clearSensitiveData();
    }
    return !hasSensitive;
  }
};

if (typeof window !== 'undefined') {

  setTimeout(() => {
    securityCheck.validateAuthState();
  }, 1000);


  window.addEventListener('beforeunload', () => {
    securityCheck.clearSensitiveData();
  });
}