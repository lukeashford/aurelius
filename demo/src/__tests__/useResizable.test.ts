import {act, renderHook} from '@testing-library/react';
import {useResizable} from '@lukeashford/aurelius';
import React from 'react';

describe('useResizable', () => {
  const initialProps = {
    initialWidthPercent: 25,
    minWidthPercent: 20,
    maxWidthPercent: 50,
    direction: 'right' as const,
  };

  it('initializes with initialWidthPercent', () => {
    const {result} = renderHook(() => useResizable(initialProps));
    expect(result.current.width).toBe('25vw');
    expect(result.current.widthPercent).toBe(25);
    expect(result.current.isResizing).toBe(false);
  });

  it('starts resizing on mousedown', () => {
    const {result} = renderHook(() => useResizable(initialProps));
    const mockEvent = {
      preventDefault: jest.fn(),
      clientX: 100,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.startResizing(mockEvent);
    });

    expect(result.current.isResizing).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('updates width on mousemove when resizing', () => {
    const {result} = renderHook(() => useResizable(initialProps));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1000});

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 100,
      } as unknown as React.MouseEvent);
    });

    // Simulate mousemove
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 200});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // Width should increase by 10% ((200 - 100) / 1000 * 100)
    // 25% + 10% = 35%
    expect(result.current.widthPercent).toBe(35);
    expect(result.current.width).toBe('35vw');
  });

  it('respects minWidthPercent', () => {
    const {result} = renderHook(() => useResizable(initialProps));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1000});

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 100,
      } as unknown as React.MouseEvent);
    });

    // Simulate mousemove to the left
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 0});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // 25% - 10% = 15%, but minWidthPercent is 20%
    expect(result.current.widthPercent).toBe(20);
    expect(result.current.width).toBe('20vw');
  });

  it('respects maxWidthPercent', () => {
    const {result} = renderHook(() => useResizable(initialProps));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1000});

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 100,
      } as unknown as React.MouseEvent);
    });

    // Simulate mousemove to the right
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 1000});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // 25% + 90% = 115%, but maxWidthPercent is 50%
    expect(result.current.widthPercent).toBe(50);
    expect(result.current.width).toBe('50vw');
  });

  it('stops resizing on mouseup', () => {
    const {result} = renderHook(() => useResizable(initialProps));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1000});

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 100,
      } as unknown as React.MouseEvent);
    });

    expect(result.current.isResizing).toBe(true);

    const mouseUpEvent = new MouseEvent('mouseup');
    act(() => {
      window.dispatchEvent(mouseUpEvent);
    });

    expect(result.current.isResizing).toBe(false);

    // Further mousemove should not update width
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 200});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    expect(result.current.widthPercent).toBe(25);
    expect(result.current.width).toBe('25vw');
  });

  it('handles "left" direction correctly', () => {
    const {result} = renderHook(() => useResizable({
      ...initialProps,
      direction: 'left',
    }));

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1000});

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 500,
      } as unknown as React.MouseEvent);
    });

    // Move mouse to the left (clientX decreases)
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 400});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // For "left" direction, deltaX = 400 - 500 = -100.
    // deltaPercent = -100 / 1000 * 100 = -10.
    // factor = -1.
    // newPercent = 25 + (-10 * -1) = 35.
    expect(result.current.widthPercent).toBe(35);
    expect(result.current.width).toBe('35vw');
  });
});
