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
import { useEffect, useMemo, useState } from 'react';
import { generateArray } from './utils';

type UsePaginationOptions = {
  /** Max block length for all blocks, this gets overwritten by `startBlockMaxLength`, `middleBlockMaxLength`, `endBlockMaxLength` */
  blockMaxLength?: number;
  /** Doesn't chunk pages */
  compact?: boolean;
  /** Default selected page */
  defaultSelected?: number;
  /** Maximum length of pages to show on the end pagination block */
  endBlockMaxLength?: number;
  /** Maximum page number to be shown, (default null for no maximum) */
  maxPageNumber?: number | null;
  /** Maximum length of pages to show on the middle pagination block */
  middleBlockMaxLength?: number;
  /** Currently selected page (controlled) */
  selectedPage?: number;
  /** Function to set the selected page (controlled) */
  setSelectedPage?: (page: number) => void;
  /** What to separate the pagination array up with, usually this separator will be replaced with icon or ellipses when shown in the UI */
  separator?: number | string;
  /** Maximum length of pages to show on the start pagination block */
  startBlockMaxLength?: number;
  /** Start from this page */
  startPage?: number;
  /** Length of total pages */
  totalPages: number;
};

const defaultOptions = {
  blockMaxLength: 3,
  compact: false,
  defaultSelected: 1,
  maxPageNumber: null,
  separator: -1,
  startPage: 1,
  totalPages: 1,
} satisfies Partial<UsePaginationOptions>;

/**
 * @docs {@link https://design.visa.com/components/pagination/?code_library=react | See Docs}
 * @description This hook is used to manage pagination events, state, and visible page blocks. Supports both controlled and uncontrolled usage.
 * @related pagination
 * @vgar TODO
 * @wcag TODO
 */
export const usePagination = (usePaginationOptions: UsePaginationOptions = defaultOptions) => {
  const defaultBlockMaxLength = usePaginationOptions.blockMaxLength ?? defaultOptions.blockMaxLength;
  /// Options
  const {
    blockMaxLength,
    compact,
    defaultSelected,
    selectedPage: controlledSelectedPage,
    setSelectedPage: setControlledSelectedPage,
    separator,
    totalPages,
  } = {
    ...defaultOptions,
    ...usePaginationOptions,
  };

  let { endBlockMaxLength, maxPageNumber, middleBlockMaxLength, startBlockMaxLength, startPage } = {
    ...defaultOptions,
    endBlockMaxLength: defaultBlockMaxLength,
    middleBlockMaxLength: defaultBlockMaxLength,
    startBlockMaxLength: defaultBlockMaxLength,
    ...usePaginationOptions,
  };

  // Apply defaults for invalid values BEFORE any calculations
  if (startBlockMaxLength < 1) startBlockMaxLength = 3;
  if (middleBlockMaxLength < 1) middleBlockMaxLength = 3;
  if (endBlockMaxLength < 1) endBlockMaxLength = 3;
  if (startPage < 0) startPage = 1;
  if (maxPageNumber !== null && maxPageNumber < 1) maxPageNumber = null;

  /// State
  const [selectedPageInternal, setSelectedPageInternal] = useState(
    Math.min(Math.max(defaultSelected, startPage), totalPages)
  );

  // Only use controlled state if both selectedPage and setSelectedPage are provided
  const isControlled = controlledSelectedPage !== undefined && setControlledSelectedPage !== undefined;
  const selectedPage = isControlled ? controlledSelectedPage : selectedPageInternal;
  const setSelectedPage = isControlled ? setControlledSelectedPage : setSelectedPageInternal;

  // Validate configuration options (warnings only)
  useEffect(() => {
    const opts = { ...defaultOptions, ...usePaginationOptions };

    if (opts.startBlockMaxLength !== undefined && opts.startBlockMaxLength < 1) {
      console.warn(
        `⚠️ usePagination: startBlockMaxLength must be >= 1. Received: ${opts.startBlockMaxLength}. Using default: 3`
      );
    }
    if (opts.middleBlockMaxLength !== undefined && opts.middleBlockMaxLength < 1) {
      console.warn(
        `⚠️ usePagination: middleBlockMaxLength must be >= 1. Received: ${opts.middleBlockMaxLength}. Using default: 3`
      );
    }
    if (opts.endBlockMaxLength !== undefined && opts.endBlockMaxLength < 1) {
      console.warn(
        `⚠️ usePagination: endBlockMaxLength must be >= 1. Received: ${opts.endBlockMaxLength}. Using default: 3`
      );
    }
    if (opts.startPage !== undefined && opts.startPage < 0) {
      console.warn(`⚠️ usePagination: startPage must be >= 0. Received: ${opts.startPage}. Using default: 1`);
    }
    if (opts.maxPageNumber !== null && opts.maxPageNumber !== undefined && opts.maxPageNumber < 1) {
      console.warn(
        `⚠️ usePagination: maxPageNumber must be >= 1 or null. Received: ${opts.maxPageNumber}. Using default: null`
      );
    }
  }, [usePaginationOptions]);

  // Warn if they provide only one of the controlled props
  useEffect(() => {
    const hasSelectedPage = controlledSelectedPage !== undefined;
    const hasSetSelectedPage = setControlledSelectedPage !== undefined;

    if (hasSelectedPage !== hasSetSelectedPage) {
      console.warn(
        `⚠️ usePagination: Both selectedPage and setSelectedPage must be provided together.\n` +
          `Currently: selectedPage=${hasSelectedPage ? controlledSelectedPage : 'undefined'}, setSelectedPage=${
            hasSetSelectedPage ? 'provided' : 'undefined'
          }\n` +
          `Falling back to uncontrolled mode.`
      );
    }
  }, [controlledSelectedPage, setControlledSelectedPage]);

  /// Derived State
  // First page
  const firstPage = startPage;
  // Ideal last page without maxPageNumber interfering
  const idealLastPage = totalPages + startPage - 1;
  // Last page;
  const lastPage = maxPageNumber === null ? idealLastPage : Math.min(maxPageNumber, idealLastPage);
  // Is first element selected
  const isFirstPage = selectedPage === firstPage;
  // Is last element selected
  const isLastPage = selectedPage === lastPage;
  // Can paginate or just show all pages
  const canPaginate = totalPages > endBlockMaxLength + middleBlockMaxLength + startBlockMaxLength;
  // Selected page is in start block
  const isInStartBlock = selectedPage < firstPage + startBlockMaxLength;
  // Selected page is in end block
  const isInEndBlock = selectedPage > lastPage - endBlockMaxLength;
  // Selected page is in middle block
  const isInMiddleBlock = !isInStartBlock && !isInEndBlock;
  // Pages to show at the start
  const startBlock = isInStartBlock ? generateArray(firstPage, startBlockMaxLength) : [firstPage];
  // Pages to show in the middle
  const middleBlock = (() => {
    if (!isInMiddleBlock) return [];
    const middleBlockPadding = Math.floor(middleBlockMaxLength / 2);
    if (selectedPage - middleBlockPadding <= firstPage)
      return generateArray(selectedPage - (selectedPage - firstPage) + 1, middleBlockMaxLength);
    if (selectedPage + middleBlockPadding >= lastPage)
      return generateArray(selectedPage + (lastPage - selectedPage) - middleBlockMaxLength, middleBlockMaxLength);
    return generateArray(selectedPage - middleBlockPadding, middleBlockMaxLength);
  })();
  // Pages to show at the end
  const endBlock = isInEndBlock ? generateArray(lastPage - endBlockMaxLength + 1, endBlockMaxLength) : [lastPage];

  const compactPages = useMemo(() => {
    // Show all pages if we have less than blockMaxLength
    if (blockMaxLength > totalPages) return generateArray(startPage, lastPage - startPage + 1);

    // Show chunk of blockMaxLength pages
    const padding = Math.floor(blockMaxLength / 2);
    if (selectedPage - padding <= startPage) return generateArray(startPage, blockMaxLength);
    if (selectedPage + padding >= lastPage) return generateArray(lastPage - blockMaxLength + 1, blockMaxLength);
    return generateArray(selectedPage - padding, blockMaxLength);
  }, [blockMaxLength, lastPage, selectedPage, startPage, totalPages]);

  // Array of pages arrays to loop over
  const pages = compact
    ? compactPages
    : canPaginate
      ? [startBlock, middleBlock, endBlock]
          .map(block => (block.length ? [...block, separator] : []))
          .flat()
          .slice(0, -1)
      : generateArray(firstPage, lastPage - firstPage + 1);

  /// Events
  // On first page event
  const onFirstPage = () => setSelectedPage(firstPage);
  // On last page event
  const onLastPage = () => setSelectedPage(lastPage);
  // On next page event
  const onNextPage = () => setSelectedPage(Math.min(lastPage, selectedPage + 1));
  // On page change event
  const onPageChange = (pageNumber: number) => {
    if (pageNumber > lastPage) setSelectedPage(lastPage);
    else if (pageNumber < firstPage) setSelectedPage(firstPage);
    else setSelectedPage(pageNumber);
  };
  // On previous page event
  const onPreviousPage = () => setSelectedPage(Math.max(firstPage, selectedPage - 1));

  return {
    /** Is first page currently selected */
    isFirstPage,
    /** Is last page currently selected */
    isLastPage,
    /** Event to handle first page selection */
    onFirstPage,
    /** Event to handle last page selection */
    onLastPage,
    /** Event to handle next page selection */
    onNextPage,
    /** Event to handle page selection */
    onPageChange,
    /** Event to handle previous page selection */
    onPreviousPage,
    /** Array of currently visible pages split by separator */
    pages,
    /** Currently selected page */
    selectedPage,
  };
};

export default usePagination;
export { calculatePagesFromTo, calculateTotalPages } from './utils';

usePagination.displayName = 'usePagination';
