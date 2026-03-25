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
import {
  VisaArrowEndTiny,
  VisaArrowStartTiny,
  VisaChevronLeftTiny,
  VisaChevronRightTiny,
  VisaOptionHorizontalTiny,
} from '@visa/nova-icons-react';
import { Button, Pagination, PaginationOverflow, Utility, UtilityFragment, usePagination } from '@visa/nova-react';
import { useState } from 'react';

export const ControlledPageStatePagination = () => {
  // Using controlled state - we manage the selectedPage ourselves
  const [selectedPage, setSelectedPage] = useState(1);

  const paginationData = usePagination({
    maxPageNumber: 10,
    startPage: 1,
    totalPages: 10,
    selectedPage, // Pass our controlled state
    setSelectedPage // Pass our state setter
  });

  const {
    isFirstPage,
    isLastPage,
    onFirstPage,
    onLastPage,
    onNextPage,
    onPageChange,
    onPreviousPage,
    pages,
  } = paginationData;

  return (
    <Utility vFlex vFlexCol vGap={8}>
      <Utility vFlex vFlexRow vGap={2}>
        <Button
          onClick={() => setSelectedPage(6)}
        >
          Jump to Page 6
        </Button>
      </Utility>

      <nav aria-label="controlled page state pagination" role="navigation">
        <UtilityFragment vAlignItems="center" vGap={4}>
          <Pagination>
            <li>
              <Button
                aria-label="Go to first page"
                buttonSize="small"
                colorScheme="tertiary"
                disabled={isFirstPage}
                iconButton
                onClick={onFirstPage}
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
            {pages?.map((pageNumber, index) =>
              pageNumber === -1 ? (
                <UtilityFragment key={`controlled-page-state-pagination-ellipse-${index}`} vAlignItems="center" vFlex>
                  <PaginationOverflow>
                    <VisaOptionHorizontalTiny />
                  </PaginationOverflow>
                </UtilityFragment>
              ) : (
                <li key={`controlled-page-state-pagination-page-${pageNumber}`}>
                  <Button
                    aria-current={selectedPage === pageNumber}
                    aria-label={`Page ${pageNumber}`}
                    colorScheme="tertiary"
                    onClick={() => onPageChange(pageNumber as number)}
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
                onClick={onLastPage}
              >
                <VisaArrowEndTiny rtl />
              </Button>
            </li>
          </Pagination>
        </UtilityFragment>
      </nav>
    </Utility>
  );
};
