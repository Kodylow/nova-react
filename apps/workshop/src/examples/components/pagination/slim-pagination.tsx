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
import { VisaChevronLeftTiny, VisaChevronRightTiny } from '@visa/nova-icons-react';
import { Button, Pagination, usePagination } from '@visa/nova-react';

export const SlimPagination = () => {
  const { pages, selectedPage, isFirstPage, isLastPage, onPageChange, onPreviousPage, onNextPage } = usePagination({
    totalPages: 10,
    compact: true,
    blockMaxLength: 5,
  });

  return (
    <nav aria-label="pagination">
      <Pagination className="v-align-items-center v-gap-4">
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
        {pages.map(page => (
          <li key={page} className="v-mobile-container-hide">
            <Button
              aria-current={page === selectedPage ? 'true' : undefined}
              aria-label={`Page ${page}`}
              colorScheme="tertiary"
              onClick={() => onPageChange(+page)}
            >
              {page}
            </Button>
          </li>
        ))}
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
      </Pagination>
    </nav>
  );
};
