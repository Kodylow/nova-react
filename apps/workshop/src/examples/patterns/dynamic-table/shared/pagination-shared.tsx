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
import { useRef, type CSSProperties, type FormEvent } from 'react';
import {
  VisaArrowEndTiny,
  VisaArrowStartTiny,
  VisaChevronDownTiny,
  VisaChevronLeftTiny,
  VisaChevronRightTiny,
  VisaOptionHorizontalTiny,
} from '@visa/nova-icons-react';
import {
  Button,
  InputContainer,
  InputControl,
  InputMessage,
  Label,
  Pagination,
  PaginationOverflow,
  Select,
  Utility,
  UtilityFragment,
  calculatePagesFromTo,
  usePagination,
} from '@visa/nova-react';

/**
 * Props for DynamicTablePagination.
 *
 * @property className - (optional) Class name for styling
 * @property disabled - (optional) Whether the pagination is disabled
 * @property onItemsPerPageChange - Function called when changing how many items show per page
 * @property page - Current page number
 * @property pageSize - Current page size
 * @property pageSizeOptions - (optional) Options for page size selection
 * @property showItemsPerPage - (optional) Whether to show the items-per-page selector
 * @property totalCount - Total number of items
 * @property id - Unique identifier for the pagination component
 */
export type DynamicTablePaginationProps = {
  className?: string;
  disabled?: boolean;
  onItemsPerPageChange: (number: number) => void;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showItemsPerPage?: boolean;
  totalCount: number;
  id: string;
} & Omit<ReturnType<typeof usePagination>, 'selectedPage'>;

/**
 * Reusable pagination component that provides page navigation controls and a results-per-page
 * selector. It shows which items you're viewing out of the total, and provides buttons for
 * moving between pages. Works with Nova's usePagination hook to manage the current page.
 */
const DynamicTablePagination = ({
  isFirstPage,
  isLastPage,
  onFirstPage,
  onItemsPerPageChange,
  onLastPage,
  onNextPage,
  onPageChange,
  onPreviousPage,
  page,
  pages,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  showItemsPerPage = true,
  totalCount,
  id,
}: DynamicTablePaginationProps) => {
  const firstPageRef = useRef<HTMLButtonElement>(null);
  const lastPageRef = useRef<HTMLButtonElement>(null);
  const { from, to } = calculatePagesFromTo(totalCount, pageSize, page);

  // Determines if pagination controls should be displayed
  // True when there is more than one page of data
  const canPaginate = pages.length > 1;

  // Hide the entire component if there's only one page and items-per-page selector is disabled
  if (!canPaginate && !showItemsPerPage) return <></>;

  /**
   * Changes the items per page and returns to the first page.
   *
   * @param event - Select element change event
   */
  const handleItemsPerPageChange = (event: FormEvent<HTMLSelectElement>) => {
    onFirstPage();
    onItemsPerPageChange(+event.currentTarget.value);
  };

  /**
   * Navigates to the first page and focuses the first page button.
   */
  const handleFirstPage = () => {
    onFirstPage();
    firstPageRef.current?.focus();
  };

  /**
   * Navigates to the last page and focuses the last page button.
   */
  const handleLastPage = () => {
    onLastPage();
    lastPageRef.current?.focus();
  };

  return (
    <Utility vAlignItems="center" vFlex vFlexRow vFlexWrapReverse vGap={10} vJustifyContent="between">
      <Utility
        style={{ textWrap: 'nowrap' } as CSSProperties}
        tag="fieldset"
        vAlignItems="center"
        vFlex
        vFlexRow
        vGap={12}
      >
        <UtilityFragment vFlexShrink0>
          <Label htmlFor={`${id}-select-items-per-page`}>Results per page</Label>
        </UtilityFragment>
        <InputContainer>
          <Select
            id={`${id}-select-items-per-page`}
            name={`${id}-select-items-per-page`}
            onChange={handleItemsPerPageChange}
            value={pageSize}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <InputControl>
            <VisaChevronDownTiny />
          </InputControl>
        </InputContainer>
        <InputMessage id={`select-message-${id}`}>Showing {`${from} - ${to} of ${totalCount}`}</InputMessage>
      </Utility>
      <UtilityFragment>
        <nav aria-label={`table pagination ${id}`} role="navigation">
          <UtilityFragment vAlignItems="center" vFlex vFlexRow vGap={4}>
            <Pagination>
              <li>
                <Button
                  aria-label="Go to first page"
                  buttonSize="small"
                  colorScheme="tertiary"
                  disabled={isFirstPage}
                  iconButton
                  onClick={handleFirstPage}
                >
                  <VisaArrowStartTiny rtl />
                </Button>
              </li>
              <li>
                <Button
                  aria-label="Go to previous page"
                  buttonSize="small"
                  colorScheme="tertiary"
                  disabled={isFirstPage}
                  iconButton
                  onClick={onPreviousPage}
                >
                  <VisaChevronLeftTiny rtl />
                </Button>
              </li>
              {pages.map((pageNumber, index) =>
                pageNumber === -1 ? (
                  <UtilityFragment key={`${id}-pagination-ellipse-${index}`} vAlignItems="center" vFlex>
                    <PaginationOverflow>
                      <VisaOptionHorizontalTiny />
                    </PaginationOverflow>
                  </UtilityFragment>
                ) : (
                  <li key={`${id}-pagination-page-${pageNumber}`}>
                    <Button
                      aria-current={page === pageNumber}
                      aria-label={`Page ${pageNumber}`}
                      colorScheme="tertiary"
                      onClick={() => onPageChange(pageNumber as number)}
                      ref={index === 0 ? firstPageRef : index === pages.length - 1 ? lastPageRef : undefined}
                    >
                      {pageNumber}
                    </Button>
                  </li>
                )
              )}
              <li>
                <Button
                  aria-label="Go to next page"
                  buttonSize="small"
                  colorScheme="tertiary"
                  disabled={isLastPage}
                  iconButton
                  onClick={onNextPage}
                >
                  <VisaChevronRightTiny rtl />
                </Button>
              </li>
              <li>
                <Button
                  aria-label="Go to last page"
                  buttonSize="small"
                  colorScheme="tertiary"
                  disabled={isLastPage}
                  iconButton
                  onClick={handleLastPage}
                >
                  <VisaArrowEndTiny rtl />
                </Button>
              </li>
            </Pagination>
          </UtilityFragment>
        </nav>
      </UtilityFragment>
    </Utility>
  );
};

export default DynamicTablePagination;
