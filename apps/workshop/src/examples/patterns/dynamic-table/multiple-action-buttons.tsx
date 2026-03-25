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
import { VisaDeleteTiny, VisaEditTiny } from '@visa/nova-icons-react';
import { TableWrapper, Table, ScreenReader, Thead, Tr, Th, Tbody, Td, Button, Utility } from '@visa/nova-react';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import ActionsButton from './shared/actions-button';
import {
  type ColData,
  SortType,
  type RowDataMultiActions,
  ActionButtons,
  type RowData,
  type SortKeyType,
} from './shared/dynamic-table.constants';
import './shared/dynamic-table.scss';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';

/**
 * Table with multiple action buttons per row, allowing users to perform different operations
 * (edit, delete, etc.) directly from each row.
 */
const MultipleActionButtonsDynamicTable = () => {
  // Generate demo data with default columns
  const defaultColumnData: ColData[] = getDefaultColumnData(false);
  const defaultRowData: RowData[] = generateBasicData(4, defaultColumnData);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = defaultColumnData.find(col => col.identifier)?.name || defaultColumnData[0].name;

  // Extend column data to include actions column
  const columnData: ColData[] = [
    ...defaultColumnData,
    {
      name: 'Actions',
      compact: true,
      sortable: false,
      renderActionButtons: (row: RowDataMultiActions) => (
        <div className="actions-wrapper">
          {Array.isArray(row.Actions) &&
            row.Actions.map((action, actionIndex) => (
              <Button
                key={`${action}-${actionIndex}`}
                aria-label={`${action} ${row[identifyingColumn]}`}
                buttonSize="small"
                colorScheme="tertiary"
                iconButton
              >
                {/* with more options, you could store in the same object as ActionButtons */}
                {action === ActionButtons.EDIT ? <VisaEditTiny /> : <VisaDeleteTiny />}
              </Button>
            ))}
        </div>
      ),
    },
  ];

  // add an 'Actions' property to indicate multiple actions
  const data: RowDataMultiActions[] = defaultRowData.map(row => ({
    ...row,
    Actions: [ActionButtons.EDIT, ActionButtons.DELETE],
  }));

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  // Store sorted data and update based on sort key and data changes
  const sortedData = useMemo(() => {
    // Remove action buttons before sorting to use shared sorting logic
    const sortedDataNoActions: RowData[] = data.map(row => {
      const { ...rest } = row;
      // Set Actions to true
      return { ...rest, Actions: '' };
    });
    const sortedRowData = revisedSortTableData(sortKey, columnData, sortedDataNoActions);
    // Restore action buttons after sorting to maintain original data structure
    const restoredSortedData: RowDataMultiActions[] = sortedRowData.map(row => {
      // because the data is sorted, we need to find the original row to get its Actions
      const originalRow = data.find(d => d.id === row.id);
      return {
        ...row,
        Actions: originalRow ? originalRow.Actions : [],
      };
    });
    return restoredSortedData;
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
        <ScreenReader tag="caption">Dynamic table with multiple action buttons.</ScreenReader>
        <Thead>
          <Tr>
            {columnData.map((col, index) => (
              <Th
                key={index}
                scope="col"
                aria-sort={col.name === sortKey.column ? sortKey.direction : undefined}
                className={col.compact ? 'compact-column' : ''}
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
          {sortedData.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columnData.map((col, colIndex) => (
                <Td
                  key={colIndex}
                  scope={col.identifier ? 'row' : undefined}
                  className={col.compact ? 'compact-column' : ''}
                  data-label={col.name}
                >
                  {col.renderActionButtons
                    ? col.renderActionButtons(row)
                    : col.render
                      ? col.render(row as RowData)
                      : row[col.name]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableWrapper>
  );
};

export default MultipleActionButtonsDynamicTable;
