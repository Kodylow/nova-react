/**
 *              © 2025-2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **/
import { renderHook, act } from '@testing-library/react';

import useDebounce from '.';

vi.useFakeTimers();

describe('useDebounce', () => {
  it('delays the callback by the default delay', () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useDebounce(callback));

    act(() => {
      result.current();
    });

    // Callback should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance timers by the delay
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Now the callback should have been called
    expect(callback).toHaveBeenCalled();
  });
  it('delays the callback by the specified delay', () => {
    const callback = vi.fn();
    const delay = 250;
    const { result } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current();
    });

    // Callback should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance timers by the delay
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // Now the callback should have been called
    expect(callback).toHaveBeenCalled();
  });

  it('should reset the callback after recall', () => {
    const callback = vi.fn();
    const delay = 250;
    const { result } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current();
    });

    // Callback should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance timers by the delay
    act(() => {
      vi.advanceTimersByTime(delay - 1);
    });
    // Callback should not have been called yet
    expect(callback).not.toHaveBeenCalled();
    // Recall callback
    act(() => {
      result.current();
    });
    // Advance timers by the delay
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // Now the callback should have been called
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
