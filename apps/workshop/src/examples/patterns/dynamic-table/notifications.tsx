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
import {
  Badge,
  BadgeEllipse,
  ScreenReader,
  Table,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Utility,
} from '@visa/nova-react';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import ActionsButton from './shared/actions-button';
import './shared/dynamic-table.scss';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';

// Extend ColData to include optional notification property
interface ExtendedColData extends ColData {
  notification?: boolean;
}

/**
 * Table with a notification indicator column.
 */
const NotificationsDynamicTable = () => {
  // Generate demo data with default columns
  const defaultColumnData: ExtendedColData[] = getDefaultColumnData();
  const defaultRowData: RowData[] = generateBasicData(4, defaultColumnData);

  /** Extend data to include notifications */
  const columnData: ExtendedColData[] = [
    {
      name: 'New',
      notification: true,
      sortable: true,
      compact: true,
      render: (row: RowData) =>
        row['New'] !== '' && (
          <Badge badgeType="neutral" clear>
            <BadgeEllipse />
            <span className="v-sr">New notification</span>
          </Badge>
        ),
    },
    ...defaultColumnData,
  ];

  // add a 'New' property to indicate new notifications
  // Assign notifications to every other row initially, but they persist with rows when sorted
  const data: RowData[] = defaultRowData.map((row, index) => ({
    New: index % 2 === 0 ? 'email' : '',
    ...row,
  }));

  // State for sorting, default to descending on 'New' notification column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: 'New', direction: SortType.DESC });

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
    <TableWrapper>
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
        <ScreenReader tag="caption">Dynamic table with notifications.</ScreenReader>
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
                  {col.compact && !col.notification ? <ScreenReader>{col.name}</ScreenReader> : col.name}
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

export default NotificationsDynamicTable;
