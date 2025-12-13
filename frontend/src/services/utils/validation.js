export const validateRequired = (value) => {
  if (!value || value.toString().trim() === '') {
    return 'This field is required';
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

export const validatePrice = (value) => {
  if (!value) return 'Price is required';
  const price = parseFloat(value);
  if (isNaN(price) || price <= 0) {
    return 'Price must be a positive number';
  }
  return '';
};

export const validateQuantity = (value) => {
  if (!value && value !== 0) return 'Quantity is required';
  const quantity = parseInt(value);
  if (isNaN(quantity) || quantity < 0) {
    return 'Quantity must be a non-negative number';
  }
  return '';
};