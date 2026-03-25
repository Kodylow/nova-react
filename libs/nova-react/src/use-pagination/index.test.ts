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
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import usePagination, { calculatePagesFromTo, calculateTotalPages } from '.';
import { generateArray } from './utils';

const originalError = console.error;
const originalWarn = console.warn;

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});
describe('usePagination', () => {
  describe('generateArray', () => {
    it('should generate array from 0 to 4', () => {
      const result = generateArray(0, 5);
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });
    it('should generate array from 9 to 14', () => {
      const result = generateArray(9, 6);
      expect(result).toEqual([9, 10, 11, 12, 13, 14]);
    });
  });

  describe('calculateTotalPages', () => {
    it('should correctly calculate pages with perfect items length', () => {
      const result = calculateTotalPages(100, 10);
      expect(result).toBe(10);
    });
    it('should correctly calculate pages with overflow items length', () => {
      const result = calculateTotalPages(101, 10);
      expect(result).toBe(11);
    });
  });
  describe('calculatePagesFromTo', () => {
    it('should correctly to/from all zeros', () => {
      const result = calculatePagesFromTo(0, 0, 0, 0);
      expect(result.to).toEqual(0);
      expect(result.from).toEqual(0);
    });
    it('should correctly to/from on page zero', () => {
      const result = calculatePagesFromTo(100, 10, 0, 0);
      expect(result.from).toEqual(1);
      expect(result.to).toEqual(10);
    });

    it('should correctly to/from with firstPage 1000', () => {
      const result = calculatePagesFromTo(100, 10, 100, 99);
      expect(result.from).toEqual(11);
      expect(result.to).toEqual(20);
    });
    it('should correctly to/from on first page', () => {
      const result = calculatePagesFromTo(100, 10, 1);
      expect(result.from).toBe(1);
      expect(result.to).toBe(10);
    });
    it('should correctly to/from on middle page', () => {
      const result = calculatePagesFromTo(100, 10, 5);
      expect(result.from).toBe(41);
      expect(result.to).toBe(50);
    });
    it('should correctly to/from on last page', () => {
      const result = calculatePagesFromTo(100, 10, 10);
      expect(result.from).toBe(91);
      expect(result.to).toBe(100);
    });

    it('should correctly to/from on with last page overflow', () => {
      const result = calculatePagesFromTo(101, 10, 11);
      expect(result.from).toBe(101);
      expect(result.to).toBe(101);
    });
  });

  describe('props', () => {
    it('should have proper results with default props', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 10 }));
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(false);
      expect(result.current.pages).toEqual([1, 2, 3, -1, 10]);
    });
    it('should allow for custom separator', () => {
      const { result } = renderHook(() => usePagination({ separator: '*', totalPages: 10 }));
      expect(result.current.pages).toEqual([1, 2, 3, '*', 10]);
    });
    it('should allow for custom startBlockMaxLength', () => {
      const { result } = renderHook(() => usePagination({ startBlockMaxLength: 2, totalPages: 10 }));
      expect(result.current.pages).toEqual([1, 2, -1, 10]);
    });
    it('should allow for custom middleBlockMaxLength', () => {
      const { result } = renderHook(() =>
        usePagination({ defaultSelected: 5, middleBlockMaxLength: 2, totalPages: 10 })
      );
      expect(result.current.pages).toEqual([1, -1, 4, 5, -1, 10]);
    });
    it('should allow for custom endBlockMaxLength', () => {
      const { result } = renderHook(() => usePagination({ defaultSelected: 9, endBlockMaxLength: 2, totalPages: 10 }));
      expect(result.current.pages).toEqual([1, -1, 9, 10]);
    });
    it('should render correctly if minPageNumber is larger than defaultSelected', () => {
      const { result } = renderHook(() => usePagination({ defaultSelected: 1, startPage: 3, totalPages: 10 }));
      expect(result.current.selectedPage).toEqual(3);
    });
    it('should render correctly with zero pages', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 0 }));
      expect(result.current.selectedPage).toEqual(0);
    });
  });

  describe('events', () => {
    describe('onFirstPage', () => {
      it('should navigate to first page', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 8, totalPages: 10 }));
        act(() => result.current.onFirstPage());
        expect(result.current.selectedPage).toEqual(1);
      });
    });
    describe('onLastPage', () => {
      it('should navigate to first page', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 8, totalPages: 10 }));
        act(() => result.current.onLastPage());
        expect(result.current.selectedPage).toEqual(10);
      });
    });
    describe('onNextPage', () => {
      it('should navigate to next page with default props', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        act(() => result.current.onNextPage());
        expect(result.current.selectedPage).toEqual(2);
      });
      it("shouldn't navigate to next page when on last page", () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 10, totalPages: 10 }));
        act(() => result.current.onNextPage());
        expect(result.current.selectedPage).toEqual(10);
      });
    });
    describe('onPreviousPage', () => {
      it("shouldn't navigate to prev page with default props", () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        act(() => result.current.onPreviousPage());
        expect(result.current.selectedPage).toEqual(1);
      });
      it('should navigate to prev page with default props', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 5, totalPages: 10 }));
        act(() => result.current.onPreviousPage());
        expect(result.current.selectedPage).toEqual(4);
      });
      it("shouldn't navigate to prev page when on first page", () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 1, totalPages: 10 }));
        act(() => result.current.onPreviousPage());
        expect(result.current.selectedPage).toEqual(1);
      });
    });
    describe('onPageChange', () => {
      it('should navigate to page when possible', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        act(() => result.current.onPageChange(5));
        expect(result.current.selectedPage).toEqual(5);
      });
      it("shouldn't navigate to page when larger than total pages", () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        act(() => result.current.onPageChange(11));
        expect(result.current.selectedPage).toEqual(10);
      });
      it("shouldn't navigate to page when less than first page", () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        act(() => result.current.onPageChange(0));
        expect(result.current.selectedPage).toEqual(1);
      });
    });
  });

  describe('derived state', () => {
    describe('isFirst', () => {
      it('should be true if first page selected', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        expect(result.current.isFirstPage).toBe(true);
      });
      it('should be false if last page selected', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 10, totalPages: 10 }));
        expect(result.current.isFirstPage).toBe(false);
      });
    });
    describe('isLast', () => {
      it('should be true if first page selected', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 10, totalPages: 10 }));
        expect(result.current.isLastPage).toBe(true);
      });
      it('should be false if first page selected', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        expect(result.current.isLastPage).toBe(false);
      });
    });
    describe('pages', () => {
      it('should show all pages if not enough pages', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 3 }));
        expect(result.current.pages).toEqual([1, 2, 3]);
      });
      it('should show all pages if just enough pages', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 9 }));
        expect(result.current.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
      it('should paginate if just enough pages', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        expect(result.current.pages).toEqual([1, 2, 3, -1, 10]);
      });
      it('should be in first block if first page selected', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        expect(result.current.pages).toEqual([1, 2, 3, -1, 10]);
      });
      it('should be in first block if third page selected', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10 }));
        expect(result.current.pages).toEqual([1, 2, 3, -1, 10]);
      });

      it('should be in middle block if fourth page selected', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 4, totalPages: 10 }));
        expect(result.current.pages).toEqual([1, -1, 3, 4, 5, -1, 10]);
      });
      it('should be in middle block if 7th page selected', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 7, totalPages: 10 }));
        expect(result.current.pages).toEqual([1, -1, 6, 7, 8, -1, 10]);
      });
      it('should be in last block if 8th page selected', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 8, totalPages: 10 }));
        expect(result.current.pages).toEqual([1, -1, 8, 9, 10]);
      });
      it('should be in last block if last page selected', () => {
        const { result } = renderHook(() => usePagination({ defaultSelected: 10, totalPages: 10 }));
        expect(result.current.pages).toEqual([1, -1, 8, 9, 10]);
      });

      it('should be offset by min page number', () => {
        const { result } = renderHook(() => usePagination({ startPage: 20, totalPages: 11 }));
        expect(result.current.pages).toEqual([20, 21, 22, -1, 30]);
      });

      it('should be offset by min page number, allowing for max page number', () => {
        const { result } = renderHook(() => usePagination({ maxPageNumber: 30, startPage: 20, totalPages: 100 }));
        expect(result.current.pages).toEqual([20, 21, 22, -1, 30]);
      });
      it('should show one page', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 1 }));
        expect(result.current.pages).toEqual([1]);
      });
      it('should show no pages', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 0 }));
        expect(result.current.pages).toEqual([]);
      });
      it('should show middle range pages within bounds of last page', () => {
        const { result } = renderHook(() =>
          usePagination({
            defaultSelected: 9,
            middleBlockMaxLength: 5,
            startBlockMaxLength: 1,
            endBlockMaxLength: 1,
            totalPages: 10,
          })
        );
        expect(result.current.pages).toEqual([1, -1, 5, 6, 7, 8, 9, -1, 10]);
      });
      it('should show middle range pages within bounds of last page, with second from last middle index', () => {
        const { result } = renderHook(() =>
          usePagination({
            defaultSelected: 8,
            middleBlockMaxLength: 5,
            startBlockMaxLength: 1,
            endBlockMaxLength: 1,
            totalPages: 10,
          })
        );
        expect(result.current.pages).toEqual([1, -1, 5, 6, 7, 8, 9, -1, 10]);
      });

      it('should show middle range pages within bounds of last page', () => {
        const { result } = renderHook(() =>
          usePagination({
            defaultSelected: 2,
            middleBlockMaxLength: 5,
            startBlockMaxLength: 1,
            endBlockMaxLength: 1,
            totalPages: 10,
          })
        );
        expect(result.current.pages).toEqual([1, -1, 2, 3, 4, 5, 6, -1, 10]);
      });
      it('should show middle range pages within bounds of last page, with second selected middle index', () => {
        const { result } = renderHook(() =>
          usePagination({
            defaultSelected: 3,
            middleBlockMaxLength: 5,
            startBlockMaxLength: 1,
            endBlockMaxLength: 1,
            totalPages: 10,
          })
        );
        expect(result.current.pages).toEqual([1, -1, 2, 3, 4, 5, 6, -1, 10]);
      });
    });
    it('should warn and apply defaults if limits are less than 1', () => {
      vi.clearAllMocks();
      renderHook(() => usePagination({ totalPages: 1, middleBlockMaxLength: 0 }));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('middleBlockMaxLength must be >= 1'));

      vi.clearAllMocks();
      renderHook(() => usePagination({ totalPages: 1, startBlockMaxLength: 0 }));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('startBlockMaxLength must be >= 1'));

      vi.clearAllMocks();
      renderHook(() => usePagination({ totalPages: 1, endBlockMaxLength: 0 }));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('endBlockMaxLength must be >= 1'));
    });
    it('should warn and apply defaults if start page or maxPageNumber are less than 1 or zero', () => {
      vi.clearAllMocks();
      renderHook(() => usePagination({ totalPages: 1, maxPageNumber: 0 }));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('maxPageNumber must be >= 1'));

      vi.clearAllMocks();
      renderHook(() => usePagination({ totalPages: 1, startPage: -1 }));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('startPage must be >= 0'));
    });
  });

  describe('controlled state', () => {
    describe('basic controlled behavior', () => {
      it('should use controlled selectedPage when provided', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 5,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        expect(result.current.selectedPage).toBe(5);
        expect(result.current.isFirstPage).toBe(false);
        expect(result.current.isLastPage).toBe(false);
      });

      it('should call controlled setSelectedPage when navigating', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 5,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        act(() => result.current.onNextPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(6);

        act(() => result.current.onPreviousPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(4);

        act(() => result.current.onPageChange(8));
        expect(mockSetSelectedPage).toHaveBeenCalledWith(8);

        act(() => result.current.onFirstPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(1);

        act(() => result.current.onLastPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(10);
      });

      it('should handle selectedPage of 0 correctly in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 0,
            setSelectedPage: mockSetSelectedPage,
            startPage: 0,
          })
        );

        expect(result.current.selectedPage).toBe(0);
        expect(result.current.isFirstPage).toBe(true);
      });
    });

    describe('uncontrolled behavior (fallback)', () => {
      it('should use internal state when controlled props are not provided', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 10, defaultSelected: 3 }));

        expect(result.current.selectedPage).toBe(3);

        act(() => result.current.onNextPage());
        expect(result.current.selectedPage).toBe(4);
      });
    });

    describe('controlled state edge cases', () => {
      it('should respect page boundaries in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 10,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        // Try to go beyond last page
        act(() => result.current.onNextPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(10); // Should stay on last page

        // Try to go beyond page bounds with onPageChange
        act(() => result.current.onPageChange(15));
        expect(mockSetSelectedPage).toHaveBeenCalledWith(10); // Should clamp to last page
      });

      it('should respect page boundaries below first page in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 1,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        // Try to go before first page
        act(() => result.current.onPreviousPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(1); // Should stay on first page

        // Try to go below page bounds with onPageChange
        act(() => result.current.onPageChange(0));
        expect(mockSetSelectedPage).toHaveBeenCalledWith(1); // Should clamp to first page
      });

      it('should work with custom startPage in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 5,
            startPage: 10,
            selectedPage: 12,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        expect(result.current.selectedPage).toBe(12);
        expect(result.current.isFirstPage).toBe(false);

        act(() => result.current.onFirstPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(10); // Should go to startPage

        act(() => result.current.onLastPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(14); // startPage + totalPages - 1
      });

      it('should work with maxPageNumber in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 100,
            maxPageNumber: 15,
            selectedPage: 15,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        expect(result.current.selectedPage).toBe(15);
        expect(result.current.isLastPage).toBe(true);

        act(() => result.current.onNextPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(15); // Should respect maxPageNumber
      });
    });

    describe('pages array with controlled state', () => {
      it('should generate correct pages array based on controlled selectedPage', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 7,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        expect(result.current.pages).toEqual([1, -1, 6, 7, 8, -1, 10]);
      });

      it('should update pages array when controlled selectedPage changes', () => {
        const mockSetSelectedPage = vi.fn();
        let selectedPage = 1;

        const { result, rerender } = renderHook(
          ({ currentPage }) =>
            usePagination({
              totalPages: 10,
              selectedPage: currentPage,
              setSelectedPage: mockSetSelectedPage,
            }),
          { initialProps: { currentPage: selectedPage } }
        );

        expect(result.current.pages).toEqual([1, 2, 3, -1, 10]);

        // Simulate controlled state change
        selectedPage = 5;
        rerender({ currentPage: selectedPage });

        expect(result.current.pages).toEqual([1, -1, 4, 5, 6, -1, 10]);
      });
    });

    describe('mixed controlled/uncontrolled scenarios', () => {
      it('should switch from uncontrolled to controlled when props are added', () => {
        let controlledProps = {};
        const mockSetSelectedPage = vi.fn();

        const { result, rerender } = renderHook(
          props => usePagination({ totalPages: 10, defaultSelected: 3, ...props }),
          { initialProps: controlledProps }
        );

        // Initially uncontrolled
        expect(result.current.selectedPage).toBe(3);

        act(() => result.current.onNextPage());
        expect(result.current.selectedPage).toBe(4);

        // Switch to controlled
        controlledProps = { selectedPage: 8, setSelectedPage: mockSetSelectedPage };
        rerender(controlledProps);

        expect(result.current.selectedPage).toBe(8);

        act(() => result.current.onNextPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(9);
      });
    });

    describe('warning behavior', () => {
      it('should warn when only selectedPage is provided without setSelectedPage', () => {
        vi.clearAllMocks();
        renderHook(() => usePagination({ totalPages: 10, selectedPage: 5 }));
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('selectedPage and setSelectedPage must be provided together')
        );
      });

      it('should warn when only setSelectedPage is provided without selectedPage', () => {
        const mockSetSelectedPage = vi.fn();
        vi.clearAllMocks();
        renderHook(() => usePagination({ totalPages: 10, setSelectedPage: mockSetSelectedPage }));
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('selectedPage and setSelectedPage must be provided together')
        );
      });

      it('should not warn when both controlled props are provided', () => {
        const mockSetSelectedPage = vi.fn();
        vi.clearAllMocks();
        renderHook(() =>
          usePagination({
            totalPages: 10,
            selectedPage: 5,
            setSelectedPage: mockSetSelectedPage,
          })
        );
        expect(console.warn).not.toHaveBeenCalled();
      });

      it('should not warn when neither controlled prop is provided', () => {
        vi.clearAllMocks();
        renderHook(() => usePagination({ totalPages: 10 }));
        expect(console.warn).not.toHaveBeenCalled();
      });
    });
  });

  describe('compact mode', () => {
    describe('basic compact functionality', () => {
      it('should show all pages when totalPages is less than blockMaxLength', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 5, compact: true, blockMaxLength: 7 }));
        expect(result.current.pages).toEqual([1, 2, 3, 4, 5]);
      });

      it('should show blockMaxLength pages centered on selected page', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([3, 4, 5, 6, 7]);
      });

      it('should show pages from start when selected page is near beginning', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, defaultSelected: 2 })
        );
        expect(result.current.pages).toEqual([1, 2, 3, 4, 5]);
      });

      it('should show pages from end when selected page is near the end', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, defaultSelected: 9 })
        );
        expect(result.current.pages).toEqual([6, 7, 8, 9, 10]);
      });

      it('should show pages from start when on first page', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, defaultSelected: 1 })
        );
        expect(result.current.pages).toEqual([1, 2, 3, 4, 5]);
      });

      it('should show pages from end when on last page', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, defaultSelected: 10 })
        );
        expect(result.current.pages).toEqual([6, 7, 8, 9, 10]);
      });
    });

    describe('compact mode with different blockMaxLength values', () => {
      it('should work with blockMaxLength of 3', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([4, 5, 6]);
      });

      it('should work with blockMaxLength of 7', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 20, compact: true, blockMaxLength: 7, defaultSelected: 10 })
        );
        expect(result.current.pages).toEqual([7, 8, 9, 10, 11, 12, 13]);
      });

      it('should work with even blockMaxLength', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 4, defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([3, 4, 5, 6]);
      });

      it('should work with blockMaxLength of 1', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 1, defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([5]);
      });
    });

    describe('compact mode with startPage offset', () => {
      it('should work with custom startPage', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, startPage: 20, defaultSelected: 22 })
        );
        expect(result.current.pages).toEqual([20, 21, 22, 23, 24]);
      });

      it('should center on selected page with custom startPage in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            compact: true,
            blockMaxLength: 5,
            startPage: 10,
            selectedPage: 15,
            setSelectedPage: mockSetSelectedPage,
          })
        );
        expect(result.current.pages).toEqual([13, 14, 15, 16, 17]);
      });

      it('should show end pages with custom startPage near the end in controlled mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            compact: true,
            blockMaxLength: 5,
            startPage: 10,
            selectedPage: 18,
            setSelectedPage: mockSetSelectedPage,
          })
        );
        expect(result.current.pages).toEqual([15, 16, 17, 18, 19]);
      });
    });

    describe('compact mode with maxPageNumber', () => {
      it('should respect maxPageNumber', () => {
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 100,
            compact: true,
            blockMaxLength: 5,
            maxPageNumber: 20,
            defaultSelected: 18,
          })
        );
        expect(result.current.pages).toEqual([16, 17, 18, 19, 20]);
      });

      it('should show limited pages when maxPageNumber restricts range', () => {
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 3,
            compact: true,
            blockMaxLength: 10,
            maxPageNumber: 5,
          })
        );
        expect(result.current.pages).toEqual([1, 2, 3]);
      });
    });

    describe('compact mode navigation', () => {
      it('should navigate to next page and update visible pages', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([4, 5, 6]);

        act(() => result.current.onNextPage());
        expect(result.current.selectedPage).toBe(6);
        expect(result.current.pages).toEqual([5, 6, 7]);
      });

      it('should navigate to previous page and update visible pages', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([4, 5, 6]);

        act(() => result.current.onPreviousPage());
        expect(result.current.selectedPage).toBe(4);
        expect(result.current.pages).toEqual([3, 4, 5]);
      });

      it('should navigate to first page and show pages from start', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 5 })
        );

        act(() => result.current.onFirstPage());
        expect(result.current.selectedPage).toBe(1);
        expect(result.current.pages).toEqual([1, 2, 3]);
      });

      it('should navigate to last page and show pages from end', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 5 })
        );

        act(() => result.current.onLastPage());
        expect(result.current.selectedPage).toBe(10);
        expect(result.current.pages).toEqual([8, 9, 10]);
      });

      it('should navigate to specific page and center visible pages', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 20, compact: true, blockMaxLength: 5, defaultSelected: 5 })
        );

        act(() => result.current.onPageChange(15));
        expect(result.current.selectedPage).toBe(15);
        expect(result.current.pages).toEqual([13, 14, 15, 16, 17]);
      });

      it('should not navigate beyond last page in compact mode', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 10 })
        );

        act(() => result.current.onNextPage());
        expect(result.current.selectedPage).toBe(10);
        expect(result.current.pages).toEqual([8, 9, 10]);
      });

      it('should not navigate before first page in compact mode', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 3, defaultSelected: 1 })
        );

        act(() => result.current.onPreviousPage());
        expect(result.current.selectedPage).toBe(1);
        expect(result.current.pages).toEqual([1, 2, 3]);
      });
    });

    describe('compact mode with controlled state', () => {
      it('should work with controlled selectedPage', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            compact: true,
            blockMaxLength: 5,
            selectedPage: 7,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        expect(result.current.pages).toEqual([5, 6, 7, 8, 9]);
        expect(result.current.selectedPage).toBe(7);
      });

      it('should call controlled setSelectedPage when navigating in compact mode', () => {
        const mockSetSelectedPage = vi.fn();
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 10,
            compact: true,
            blockMaxLength: 5,
            selectedPage: 5,
            setSelectedPage: mockSetSelectedPage,
          })
        );

        act(() => result.current.onNextPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(6);

        act(() => result.current.onPreviousPage());
        expect(mockSetSelectedPage).toHaveBeenCalledWith(4);
      });

      it('should update visible pages when controlled selectedPage changes', () => {
        const mockSetSelectedPage = vi.fn();
        let selectedPage = 3;

        const { result, rerender } = renderHook(
          ({ currentPage }) =>
            usePagination({
              totalPages: 10,
              compact: true,
              blockMaxLength: 5,
              selectedPage: currentPage,
              setSelectedPage: mockSetSelectedPage,
            }),
          { initialProps: { currentPage: selectedPage } }
        );

        expect(result.current.pages).toEqual([1, 2, 3, 4, 5]);

        selectedPage = 8;
        rerender({ currentPage: selectedPage });

        expect(result.current.pages).toEqual([6, 7, 8, 9, 10]);
      });
    });

    describe('compact mode edge cases', () => {
      it('should handle single page', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 1, compact: true, blockMaxLength: 5 }));
        expect(result.current.pages).toEqual([1]);
      });

      it('should handle zero pages', () => {
        const { result } = renderHook(() => usePagination({ totalPages: 0, compact: true, blockMaxLength: 5 }));
        expect(result.current.pages).toEqual([]);
      });

      it('should handle totalPages equal to blockMaxLength', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 5, compact: true, blockMaxLength: 5, defaultSelected: 3 })
        );
        expect(result.current.pages).toEqual([1, 2, 3, 4, 5]);
      });

      it('should correctly calculate isFirstPage and isLastPage in compact mode', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, defaultSelected: 1 })
        );
        expect(result.current.isFirstPage).toBe(true);
        expect(result.current.isLastPage).toBe(false);

        act(() => result.current.onLastPage());
        expect(result.current.isFirstPage).toBe(false);
        expect(result.current.isLastPage).toBe(true);
      });

      it('should not include separator in compact mode', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 10, compact: true, blockMaxLength: 5, separator: '...', defaultSelected: 5 })
        );
        expect(result.current.pages).toEqual([3, 4, 5, 6, 7]);
        expect(result.current.pages).not.toContain('...');
      });
    });

    describe('compact mode with blockMaxLength from prop inheritance', () => {
      it('should use blockMaxLength as default when no specific block lengths provided', () => {
        const { result } = renderHook(() =>
          usePagination({ totalPages: 20, compact: true, blockMaxLength: 7, defaultSelected: 10 })
        );
        expect(result.current.pages).toEqual([7, 8, 9, 10, 11, 12, 13]);
      });

      it('should ignore startBlockMaxLength, middleBlockMaxLength, endBlockMaxLength in compact mode', () => {
        const { result } = renderHook(() =>
          usePagination({
            totalPages: 20,
            compact: true,
            blockMaxLength: 5,
            startBlockMaxLength: 2,
            middleBlockMaxLength: 2,
            endBlockMaxLength: 2,
            defaultSelected: 10,
          })
        );
        expect(result.current.pages).toEqual([8, 9, 10, 11, 12]);
      });
    });
  });
});
