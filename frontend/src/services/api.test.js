import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authAPI, sweetsAPI } from '../../services/api';

describe('API Services', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('authAPI', () => {
    it('should have register method', () => {
      expect(authAPI.register).toBeDefined();
    });

    it('should have login method', () => {
      expect(authAPI.login).toBeDefined();
    });

    it('should have logout method', () => {
      expect(authAPI.logout).toBeDefined();
    });
  });

  describe('sweetsAPI', () => {
    it('should have getAll method', () => {
      expect(sweetsAPI.getAll).toBeDefined();
    });

    it('should have search method', () => {
      expect(sweetsAPI.search).toBeDefined();
    });

    it('should have CRUD methods', () => {
      expect(sweetsAPI.create).toBeDefined();
      expect(sweetsAPI.update).toBeDefined();
      expect(sweetsAPI.delete).toBeDefined();
    });

    it('should have inventory methods', () => {
      expect(sweetsAPI.purchase).toBeDefined();
      expect(sweetsAPI.restock).toBeDefined();
    });
  });
});