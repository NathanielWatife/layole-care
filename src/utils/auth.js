export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };
  
  export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const login = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };