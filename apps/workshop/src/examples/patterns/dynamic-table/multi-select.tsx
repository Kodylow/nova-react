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
import { Checkbox, ScreenReader, Table, TableWrapper, Tbody, Td, Th, Thead, Tr, Utility } from '@visa/nova-react';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import ActionsButton from './shared/actions-button';
import './shared/dynamic-table.scss';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';

/**
 * Sortable data table with row selection and header checkbox for select all.
 * Displays indeterminate state when some rows are selected.
 */
const MultiSelectDynamicTable = () => {
  /** Checkbox logic */
  const [headerChecked, setHeaderChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});

  // Generate demo data
  const columnData: ColData[] = getDefaultColumnData();
  const data: RowData[] = generateBasicData(4, columnData);

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

  /**
   * Handles header checkbox change to select or unselect all rows.
   *
   * @param checked - Checked state of header checkbox
   */
  const onHeaderCheckboxChange = (checked: boolean) => {
    // Update header checkbox state to reflect the new checked value
    setHeaderChecked(checked);
    // Clear indeterminate state since we're explicitly selecting all or none
    setIndeterminate(false);

    if (checked) {
      // Build a new object with all row IDs mapped to true
      const allCheckedRows: Record<string, boolean> = {};
      sortedData.forEach(row => {
        allCheckedRows[row[identifyingColumn] as string] = true;
      });
      // Update state with all rows selected
      setCheckedRows(allCheckedRows);
    } else {
      // Clear the checked rows object to deselect everything
      setCheckedRows({});
    }
  };

  /**
   * Handles individual row checkbox change.
   *
   * @param row - Row that was checked or unchecked
   */
  const onRowCheckboxChange = (row: RowData) => {
    const rowId = row[identifyingColumn] as string;
    const updatedCheckedRows = { ...checkedRows };

    if (updatedCheckedRows[rowId]) {
      // Row is currently checked, so uncheck it by removing from the object
      delete updatedCheckedRows[rowId];
    } else {
      // Row is currently unchecked, so check it by adding to the object
      updatedCheckedRows[rowId] = true;
    }

    // Update the checked rows state with the new selection
    setCheckedRows(updatedCheckedRows);

    // Calculate how many rows are now selected
    const checkedCount = Object.keys(updatedCheckedRows).length;
    const totalRows = sortedData.length;

    // Update header checkbox state based on selection count
    // Header is checked only if all rows are selected
    setHeaderChecked(checkedCount === totalRows);
    // Header is indeterminate if some (but not all) rows are selected
    setIndeterminate(checkedCount > 0 && checkedCount < totalRows);
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
        <ScreenReader tag="caption">Dynamic table with multi-select.</ScreenReader>
        <Thead>
          <Tr>
            <Td className="v-th compact-column">
              <Utility vAlignItems="center" vFlex vGap={2}>
                <Checkbox
                  checked={headerChecked}
                  indeterminate={indeterminate}
                  aria-label={headerChecked ? 'Unselect all' : 'Select all'}
                  onChange={event => onHeaderCheckboxChange(event.currentTarget.checked)}
                  id="header-checkbox"
                />
              </Utility>
            </Td>
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
          {sortedData.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              <Td className="compact-column">
                <Utility vAlignItems="center" vFlex vGap={2}>
                  <Checkbox
                    className="row-selection-checkbox"
                    checked={!!checkedRows[row[identifyingColumn] as string]}
                    aria-label={
                      checkedRows[row[identifyingColumn] as string]
                        ? `Unselect ${row[identifyingColumn]}`
                        : `Select ${row[identifyingColumn]}`
                    }
                    onChange={() => onRowCheckboxChange(row)}
                    id={`checkbox-${rowIndex}`}
                  />
                </Utility>
              </Td>
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

export default MultiSelectDynamicTable;
