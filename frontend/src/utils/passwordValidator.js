// Common weak passwords to block
const WEAK_PASSWORDS = [
  '123456', '123456789', '12345678', '1234567', '12345',
  '111111', '123123', '1212121', '000000', '666666',
  'password', 'password123', 'password1', 'admin', 'admin123',
  '123321', '654321', '999999', '888888', '777777',
  'qwerty', 'qwerty123', 'abc123', 'welcome', 'letmein',
  'monkey', 'dragon', 'master', 'shadow', 'superman',
  '121212', '101010', 'iloveyou', 'princess', 'qazwsx',
  'pass', 'pass123', '1111', '2222', '3333', '4444', '5555'
];

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain at least one lowercase letter');
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain at least one number');
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
    errors.push('Must contain at least one special character (!@#$%^&* etc)');
  }

  // Check if password is in weak list
  if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('This password is too common and insecure');
  }

  // Check for sequential numbers
  if (/0123456789|1234567890|12345678|123456|9876543210|987654321/.test(password)) {
    errors.push('Password cannot contain sequential numbers');
  }

  // Check for repeated characters (more than 2 consecutive)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain more than 2 consecutive identical characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get password strength indicator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No password', color: 'gray' };

  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) strength++;

  const levels = [
    { strength: 0, label: 'No password', color: 'gray' },
    { strength: 1, label: 'Very Weak', color: 'red' },
    { strength: 2, label: 'Weak', color: 'orange' },
    { strength: 3, label: 'Fair', color: 'yellow' },
    { strength: 4, label: 'Strong', color: 'blue' },
    { strength: 5, label: 'Very Strong', color: 'green' }
  ];

  return levels[strength] || levels[0];
};
