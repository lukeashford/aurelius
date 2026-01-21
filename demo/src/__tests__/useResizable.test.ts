import {act, renderHook} from '@testing-library/react';
import {useResizable} from '@lukeashford/aurelius';
import React from 'react';

describe('useResizable', () => {
  const initialProps = {
    initialWidth: 256,
    minWidth: 200,
    maxWidth: 500,
    direction: 'right' as const,
  };

  it('initializes with initialWidth', () => {
    const {result} = renderHook(() => useResizable(initialProps));
    expect(result.current.width).toBe(256);
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

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 100,
      } as unknown as React.MouseEvent);
    });

    // Simulate mousemove
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 150});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // Width should increase by 50 (150 - 100)
    expect(result.current.width).toBe(306);
  });

  it('respects minWidth', () => {
    const {result} = renderHook(() => useResizable(initialProps));

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

    // 256 - 100 = 156, but minWidth is 200
    expect(result.current.width).toBe(200);
  });

  it('respects maxWidth', () => {
    const {result} = renderHook(() => useResizable(initialProps));

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

    // 256 + 900 = 1156, but maxWidth is 500
    expect(result.current.width).toBe(500);
  });

  it('stops resizing on mouseup', () => {
    const {result} = renderHook(() => useResizable(initialProps));

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

    expect(result.current.width).toBe(256);
  });

  it('handles "left" direction correctly', () => {
    const {result} = renderHook(() => useResizable({
      ...initialProps,
      direction: 'left',
    }));

    act(() => {
      result.current.startResizing({
        preventDefault: () => {
        },
        clientX: 500,
      } as unknown as React.MouseEvent);
    });

    // Move mouse to the left (clientX decreases)
    const mouseMoveEvent = new MouseEvent('mousemove', {clientX: 450});
    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // For "left" direction, deltaX = 450 - 500 = -50.
    // factor = -1.
    // newWidth = 256 + (-50 * -1) = 306.
    expect(result.current.width).toBe(306);
  });
});
