import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('useSweets Hook', () => {
  it('should initialize with empty sweets array', () => {
    const { result } = renderHook(() => useSweets());
    
    expect(result.current.sweets).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should provide all required methods', () => {
    const { result } = renderHook(() => useSweets());
    
    expect(result.current).toHaveProperty('fetchSweets');
    expect(result.current).toHaveProperty('searchSweets');
    expect(result.current).toHaveProperty('purchaseSweet');
    expect(result.current).toHaveProperty('restockSweet');
    expect(result.current).toHaveProperty('deleteSweet');
  });
});