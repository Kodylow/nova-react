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
  calculatePagesFromTo,
  calculateTotalPages,
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
} from '@visa/nova-react';
import { useMemo, useState, type CSSProperties } from 'react';
import ActionsButton from './shared/actions-button';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import './shared/dynamic-table.scss';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';
import DynamicTablePagination from './shared/pagination-shared';

/**
 * Sortable data table with pagination controls for large datasets.
 */
const PaginationDynamicTable = () => {
  // Generate demo data
  const columnData: ColData[] = getDefaultColumnData();
  const data: RowData[] = generateBasicData(300, columnData);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  // Store sorted data and update based on sort key and data changes
  const sortedData = useMemo(() => {
    return revisedSortTableData(sortKey, columnData, data);
  }, [sortKey, columnData, data]);

  /**
   * Updates the sort key to trigger table re-sorting.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setSortKey({ column: column.name, direction: direction });
  };

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);

  // Use useMemo for visible rows
  const visibleRows = useMemo(() => {
    const { from, to } = calculatePagesFromTo(sortedData.length, itemsPerPage, selectedPage);
    return sortedData.slice(from - 1, to);
  }, [sortedData, itemsPerPage, selectedPage]);

  // Pagination
  const totalItems = sortedData?.length ?? 0;
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const currentPage = selectedPage;
  const { onFirstPage, ...remainingPaginationData } = usePagination({
    selectedPage: currentPage,
    setSelectedPage: setSelectedPage,
    totalPages,
  });

  return (
    <Utility vFlex vFlexCol vGap="16">
      <TableWrapper>
        <Table
          style={
            {
              '--v-table-data-padding-block-default': 'var(--v-table-data-padding-block-small)',
              '--v-table-data-block-default': 'var(--v-table-data-block-small)',
            } as CSSProperties
          }
          alternate
        >
          <ScreenReader tag="caption">Dynamic table with pagination.</ScreenReader>
          <Thead>
            <Tr>
              {columnData.map((col, index) => (
                <Th
                  key={index}
                  scope="col"
                  className={col.compact ? 'compact-column' : ''}
                  aria-sort={
                    sortKey.column === col.name
                      ? sortKey.direction === SortType.ASC
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={4}>
                    {col.compact ? <ScreenReader>{col.name}</ScreenReader> : col.name}
                    {col.sortable && (
                      <ActionsButton
                        column={col}
                        label={col.name}
                        sorted={sortKey.column === col.name ? sortKey.direction : undefined}
                        onSort={direction => sort(col, direction)}
                      />
                    )}
                  </Utility>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {visibleRows.map((row, rowIndex) => (
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
            ))}
          </Tbody>
        </Table>
      </TableWrapper>
      <DynamicTablePagination
        id="dynamic-table-pagination"
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

export default PaginationDynamicTable;
