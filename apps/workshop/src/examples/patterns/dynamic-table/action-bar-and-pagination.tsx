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
import { VisaChevronDownTiny } from '@visa/nova-icons-react';
import {
  calculatePagesFromTo,
  calculateTotalPages,
  Checkbox,
  InputContainer,
  InputControl,
  Label,
  ScreenReader,
  Select,
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
import { useMemo, useState, type ChangeEvent, type CSSProperties, type JSX } from 'react';
import SearchActionBarDynamicTable from './search-action-bar';
import SelectionBasedActionBarDynamicTable from './selection-based-action-bar';
import ActionsButton from './shared/actions-button';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import './shared/dynamic-table.scss';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';
import DynamicTablePagination from './shared/pagination-shared';
import SubtleActionBarDynamicTable from './subtle-action-bar';
import ToggleActionBarDynamicTable from './toggle-action-bar';

/**
 * Sortable data table with pagination and swappable action bars (selection, search, subtle, toggle).
 * Switching between action bars is for demo purposes only; in a real application, one action bar would be chosen.
 * Checkbox selection state is only included for the selection-based action bar and resets when switching bars.
 */
const ActionBarAndPaginationDynamicTable = () => {
  // Generate demo data
  const columnData: ColData[] = getDefaultColumnData();
  const data: RowData[] = generateBasicData(300, columnData);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  // Store sorted data and update when sortKey or data changes
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

  // Pagination state and calculations
  // State for number of items to display per page (default 10)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);
  const totalItems = sortedData?.length ?? 0;
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const currentPage = selectedPage;
  // usePagination hook provides navigation functions for page controls
  // Extracts onFirstPage separately as it's needed to reset page when items per page changes
  const { onFirstPage, ...remainingPaginationData } = usePagination({
    selectedPage: currentPage,
    setSelectedPage: setSelectedPage,
    totalPages,
  });

  // Calculate visible rows for current page
  // Recomputes whenever sorted data, items per page, or selected page changes
  const visibleRows = useMemo(() => {
    // Calculate the range of items to display (from and to indices)
    const { from, to } = calculatePagesFromTo(sortedData.length, itemsPerPage, selectedPage);
    // Slice the sorted data to get only the rows for the current page
    // Subtract 1 from 'from' because array indices are 0-based but calculatePagesFromTo returns 1-based
    return sortedData.slice(from - 1, to);
  }, [sortedData, itemsPerPage, selectedPage]);

  // action bars
  const actionBars = ['Selection-based', 'Subtle', 'Search', 'Toggle'];
  const [option, setOption] = useState('Selection-based');

  /** Checkbox logic */
  const [headerChecked, setHeaderChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});

  /**
   * Resets multi-select state when action bar option changes.
   *
   * @param e - Change event from select element
   */
  const handleChangeState = (e: ChangeEvent<HTMLSelectElement>) => {
    setOption(e.target.value);
    setCheckedRows({});
    setHeaderChecked(false);
    setIndeterminate(false);
  };

  /**
   * Handles header checkbox change for selecting or deselecting all rows.
   *
   * @param checked - Checked state of the header checkbox
   */
  const onHeaderCheckboxChange = (checked: boolean) => {
    setHeaderChecked(checked);
    setIndeterminate(false);

    if (checked) {
      // select all rows
      const allCheckedRows: Record<string, boolean> = {};
      sortedData.forEach(row => {
        allCheckedRows[row[identifyingColumn] as string] = true;
      });
      setCheckedRows(allCheckedRows);
    } else {
      // unselect all rows
      setCheckedRows({});
    }
  };

  /**
   * Handles individual row checkbox change.
   *
   * @param row - Selected row
   */
  const onRowCheckboxChange = (row: RowData) => {
    const rowId = row[identifyingColumn] as string;
    const updatedCheckedRows = { ...checkedRows };

    if (updatedCheckedRows[rowId]) {
      delete updatedCheckedRows[rowId];
    } else {
      updatedCheckedRows[rowId] = true;
    }

    // Set updated checked rows
    setCheckedRows(updatedCheckedRows);

    // Update header checkbox state - checked and indeterminate
    const checkedCount = Object.keys(updatedCheckedRows).length;
    const totalRows = sortedData.length;

    setHeaderChecked(checkedCount === totalRows);
    setIndeterminate(checkedCount > 0 && checkedCount < totalRows);
  };

  // Action bar options, based on action bar examples available
  const actionBarComponents: Record<string, JSX.Element> = {
    Search: <SearchActionBarDynamicTable />,
    Subtle: <SubtleActionBarDynamicTable />,
    Toggle: <ToggleActionBarDynamicTable />,
    'Selection-based': (
      <SelectionBasedActionBarDynamicTable
        amountSelected={Object.keys(checkedRows).length}
        clearSelection={() => onHeaderCheckboxChange(false)}
      />
    ),
  };

  return (
    <Utility vFlex vFlexCol vGap="16">
      {/* Select field to choose action bar type for demo purposes */}
      <Utility tag="fieldset" vFlex vFlexCol vGap={6} vAlignSelf="start">
        <Label htmlFor="action-bar-select">Action bar</Label>
        <InputContainer>
          <Select id="action-bar-select" name="action-bar-select" onChange={handleChangeState} value={option}>
            <option hidden value="" />
            {actionBars.map((option, index) => (
              <option key={`${option}-${index}`} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <InputControl>
            <VisaChevronDownTiny />
          </InputControl>
        </InputContainer>
      </Utility>

      {/* Render selected action bar */}
      {actionBarComponents[option] || null}

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
              {option === 'Selection-based' ? (
                // If the selection-based action bar is chosen, render header checkbox
                <Td className="v-th compact-column">
                  <Utility vAlignItems="center" vFlex vGap={2}>
                    <Checkbox
                      checked={headerChecked}
                      indeterminate={indeterminate}
                      aria-label={headerChecked ? 'Unselect all' : 'Select all'}
                      onChange={event => onHeaderCheckboxChange(event.currentTarget.checked)}
                      id="header-checkbox-action-bar-and-pagination"
                    />
                  </Utility>
                </Td>
              ) : null}
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
            {visibleRows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {option === 'Selection-based' ? (
                  // If the selection-based action bar is chosen, render row checkbox
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
                ) : null}
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

export default ActionBarAndPaginationDynamicTable;
