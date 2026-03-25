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
  calculateTotalPages,
  ProgressCircular,
  ScreenReader,
  Table,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  usePagination,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import ActionsButton from './shared/actions-button';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import DynamicTablePagination from './shared/pagination-shared';
import './shared/dynamic-table.scss';
import { columnDataFilterDefaults } from './shared/generate-demo-data.utils';
import { getTablePage, type PaginatedResponse } from './shared/mock-table-api.utils';

/**
 * Paginated table with mock server-side data fetching and client-side caching.
 */
const DataFetchOnPaginationDynamicTable = () => {
  // Generate demo data
  const columnData: ColData[] = [...columnDataFilterDefaults];

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  /**
   * Updates the sort key to trigger table re-sorting.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setSortKey({ column: column.name, direction: direction });
  };

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const currentPage = selectedPage;
  const { onFirstPage, ...remainingPaginationData } = usePagination({
    selectedPage: currentPage,
    setSelectedPage: setSelectedPage,
    totalPages,
  });

  const [visibleRows, setVisibleRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Client-side cache to avoid refetching already-loaded pages
   */
  const [cache, setCache] = useState<Map<string, PaginatedResponse>>(new Map());

  // Create a cache key based on current page parameters
  const cacheKey = useMemo(
    () => `${currentPage}-${itemsPerPage}-${JSON.stringify(sortKey)}`,
    [currentPage, itemsPerPage, sortKey]
  );

  /**
   * Fetches data when pagination or sort changes, using client-side cache.
   */
  useEffect(() => {
    getData();
  }, [cacheKey]);

  /**
   * Fetches table data from API or cache.
   */
  const getData = async () => {
    // Check if we already have this data cached
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      setVisibleRows(cached.data);
      setTotalItems(cached.total);
      return; // Skip API call - use cached data
    }

    // Data not in cache - fetch from API
    setLoading(true);
    const response = await getTablePage(currentPage, itemsPerPage, sortKey, columnData);

    // Store response in cache for future use
    setCache(new Map(cache).set(cacheKey, response));

    setTotalItems(response.total);
    setVisibleRows(response.data);
    setLoading(false);
  };

  return (
    <Utility vFlex vFlexCol vGap="16">
      {/* Dynamic table with action bar and pagination */}
      <TableWrapper>
        <Table
          style={
            {
              // use compact spacing
              '--v-table-data-padding-block-default': 'var(--v-table-data-padding-block-small)',
              '--v-table-data-block-default': 'var(--v-table-data-block-small)',
            } as CSSProperties
          }
          alternate
        >
          <ScreenReader tag="caption">Dynamic table with action bar and pagination.</ScreenReader>
          <Thead>
            <Tr>
              {columnData.map((col, index) => (
                <Th
                  key={index}
                  scope="col"
                  className={col.compact ? 'compact-column' : ''}
                  aria-sort={col.name === sortKey.column ? sortKey.direction : undefined}
                >
                  <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={4}>
                    {col.compact ? <ScreenReader>{col.name}</ScreenReader> : col.name}
                    <ActionsButton
                      column={col}
                      label={col.name}
                      onSort={direction => sort(col, direction)}
                      sorted={col.name === sortKey.column ? sortKey.direction : SortType.NONE}
                    />
                  </Utility>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <UtilityFragment vPaddingVertical={20} style={{ textAlign: 'center' }}>
                  <Td colSpan={columnData.length}>
                    <UtilityFragment vFlex vJustifyContent="center">
                      <ProgressCircular className="v-flex-grow" indeterminate>
                        <span className="v-sr" role="alert">
                          Loading...
                        </span>
                      </ProgressCircular>
                    </UtilityFragment>
                  </Td>
                </UtilityFragment>
              </Tr>
            ) : (
              visibleRows.length > 0 &&
              visibleRows.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {columnData.map((col, colIndex) => (
                    <Td
                      key={colIndex}
                      scope={col.identifier ? 'row' : undefined}
                      className={col.compact ? 'compact-column' : ''}
                      data-label={col.name}
                    >
                      {col.render ? col.render(row) : row[col.name]}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableWrapper>

      {/* Shared pagination component */}
      <DynamicTablePagination
        id="dynamic-table-action-bar-and-pagination"
        onFirstPage={onFirstPage}
        onItemsPerPageChange={setItemsPerPage}
        page={currentPage}
        pageSize={itemsPerPage}
        showItemsPerPage={!!visibleRows.length}
        totalCount={totalItems}
        {...remainingPaginationData}
      />
    </Utility>
  );
};

export default DataFetchOnPaginationDynamicTable;
