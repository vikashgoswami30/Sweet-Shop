import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePrice,
  validateQuantity,
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for password >= 6 chars', () => {
      expect(validatePassword('password123')).toBe(true);
    });

    it('should return false for password < 6 chars', () => {
      expect(validatePassword('pass')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return true for non-empty string', () => {
      expect(validateRequired('test')).toBe(true);
    });

    it('should return false for empty or whitespace', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });
  });

  describe('validatePrice', () => {
    it('should return true for positive numbers', () => {
      expect(validatePrice('100')).toBe(true);
      expect(validatePrice('99.99')).toBe(true);
    });

    it('should return false for negative or zero', () => {
      expect(validatePrice('0')).toBe(false);
      expect(validatePrice('-10')).toBe(false);
      expect(validatePrice('abc')).toBe(false);
    });
  });

  describe('validateQuantity', () => {
    it('should return true for positive numbers and zero', () => {
      expect(validateQuantity('0')).toBe(true);
      expect(validateQuantity('10')).toBe(true);
    });

    it('should return false for negative numbers', () => {
      expect(validateQuantity('-5')).toBe(false);
      expect(validateQuantity('abc')).toBe(false);
    });
  });
});
