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
import { useMemo, useState, type CSSProperties } from 'react';
import { ScreenReader, Table, TableWrapper, Tbody, Td, Th, Thead, Tr, Utility } from '@visa/nova-react';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import ActionsButton from './shared/actions-button';
import './shared/dynamic-table.scss';
import { toggleColumnDropdown } from './shared/filters.utils';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';
import StatusBadge from './shared/badge';

/**
 * Fixed-height table with both vertical and horizontal scrolling.
 */
const VerticalAndHorizontalScrollDynamicTable = () => {
  // Generate demo data
  const defaultColumnData: ColData[] = getDefaultColumnData().slice(-2); // get last two columns from default data
  const columnData: ColData[] = [
    { name: 'Column A', sortable: true, genericHeaderActions: true },
    { name: 'Column B', sortable: true, genericHeaderActions: true },
    { name: 'Column C', sortable: true, genericHeaderActions: true },
    { name: 'Column D', sortable: true, genericHeaderActions: true },
    { name: 'Column E', sortable: true, genericHeaderActions: true },
    { name: 'Column F', sortable: true, genericHeaderActions: true },
    { name: 'Column G', sortable: true, genericHeaderActions: true },
    { name: 'Column H', sortable: true, genericHeaderActions: true },
    { name: 'Column I', sortable: true, genericHeaderActions: true },
    { name: 'Column J', sortable: true, genericHeaderActions: true },
    { name: 'Column K', sortable: true, genericHeaderActions: true },
    ...defaultColumnData.map(col =>
      // rename badge column to 'Column L' to avoid duplicate names
      col.badge ? { ...col, name: 'Column L', render: (row: RowData) => <StatusBadge label={row['Column L']} /> } : col
    ),
  ];
  const data: RowData[] = generateBasicData(12, columnData);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for column dropdowns
  const [columnFiltersOpen, setColumnFiltersOpen] = useState<boolean[]>(columnData.map(() => false));

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  // Store sorted data and update based on sort key and data changes
  const sortedData = useMemo(() => {
    return revisedSortTableData(sortKey, columnData, data);
  }, [sortKey, columnData, data]); // holds filtered data

  /**
   * Updates the sort key to trigger table re-sorting.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setSortKey({ column: column.name, direction: direction });
  };

  return (
    <TableWrapper style={{ '--v-table-wrapper-block-size': '288px' } as CSSProperties}>
      <Table
        style={
          {
            // Use compact spacing
            '--v-table-data-padding-block-default': 'var(--v-table-data-padding-block-small)',
            '--v-table-data-block-default': 'var(--v-table-data-block-small)',
          } as CSSProperties
        }
        alternate
      >
        <ScreenReader tag="caption">Dynamic table with vertical and horizontal scroll.</ScreenReader>
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
                    open={columnFiltersOpen[columnData.indexOf(col)]}
                    setOpen={(isOpen: boolean) => {
                      const index = columnData.indexOf(col);
                      toggleColumnDropdown(index, columnFiltersOpen, setColumnFiltersOpen, isOpen);
                    }}
                  />
                </Utility>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((row, rowIndex) => (
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
  );
};

export default VerticalAndHorizontalScrollDynamicTable;
