export const validateEmail = (email: string): string => {
  if (!email) {
    return 'Email is required';
  }
  
  // Standard regular expression for email validation
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return '';
};

export const validateName = (name: string): string => {
  if (!name) {
    return 'Name is required';
  }
  
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  return '';
}; 