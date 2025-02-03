export const mockLogin = (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          user: {
            email: credentials.email,
            role: 'patient'
          }
        });
      }, 1000);
    });
  };
  