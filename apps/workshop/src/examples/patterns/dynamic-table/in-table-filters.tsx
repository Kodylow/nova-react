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
import { VisaSettingsTiny } from '@visa/nova-icons-react';
import {
  Button,
  calculatePagesFromTo,
  calculateTotalPages,
  Checkbox,
  InputMessage,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
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
import cn from 'clsx';
import { useEffect, useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import FilterActionBar from './shared/action-bar';
import ActionsButton from './shared/actions-button';
import ChipFilters from './shared/chip-filters';
import { SortType, type ColData, type FilterableTableState, type RowData } from './shared/dynamic-table.constants';
import './shared/dynamic-table.scss';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import {
  applyAllFilters,
  clearMultipleFilters,
  clearSingleFilter,
  generateFilterData,
  getFilteredData,
  handleColumnVisibilityChange,
  manageColumnVisibility,
  resetTable,
  toggleColumnDropdown,
} from './shared/filters.utils';
import { columnDataFilterDefaults } from './shared/generate-demo-data.utils';
import DynamicTablePagination from './shared/pagination-shared';
import TableDropdownButton from './shared/table-dropdown-button';

/**
 * Props for ActionBar component.
 *
 * @property columnData - Array of column configuration objects
 * @property hiddenColumns - Array of booleans indicating hidden state of columns
 * @property setHiddenColumns - Function to update hidden columns state
 * @property setColumnData - Function to update column configuration
 * @property setTableState - Function to update table state including sort and filters
 */
interface ActionBarProps {
  columnData: ColData[];
  hiddenColumns: boolean[];
  setHiddenColumns: Dispatch<SetStateAction<boolean[]>>;
  setColumnData: Dispatch<SetStateAction<ColData[]>>;
  setTableState: Dispatch<SetStateAction<FilterableTableState>>;
}

/**
 * Table settings and column visibility management.
 */
const ActionBar = ({ columnData, hiddenColumns, setHiddenColumns, setColumnData, setTableState }: ActionBarProps) => {
  // State for settings dropdown open/closed
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState<boolean>(false);

  /**
   * Applies column visibility changes.
   */
  const handleApply = () => {
    manageColumnVisibility(columnData, hiddenColumns, setColumnData);
    setSettingsDropdownOpen(false);
  };

  /**
   * Resets table to default state.
   */
  const reset = () => {
    setHiddenColumns(columnData.map(() => false));
    resetTable(columnData, setColumnData, setTableState, setSettingsDropdownOpen);
  };

  return (
    <FilterActionBar>
      <TableDropdownButton
        id="in-table-filters"
        buttonAriaLabel="In-table filter settings"
        open={!!settingsDropdownOpen}
        setOpen={setSettingsDropdownOpen}
        icon={<VisaSettingsTiny />}
      >
        <Utility vFlex vFlexCol vGap={6} vFlexGrow vMargin={7}>
          <fieldset>
            <Label id="in-table-filters-legend" tag="legend">
              Show columns
            </Label>
            <ListboxContainer>
              <Listbox scroll tag="div">
                {columnData.map((column, index) => {
                  {
                    /* Don't allow compact or identifier columns to be hidden */
                  }
                  return !column.identifier && !column.compact ? (
                    <ListboxItem<'label'>
                      htmlFor={`in-table-filters-option-${index}`}
                      key={`in-table-filters-option-${index}`}
                      tag="label"
                    >
                      <Checkbox
                        checked={!hiddenColumns[index]}
                        className="v-flex-shrink-0"
                        id={`in-table-filters-option-${index}`}
                        name={`in-table-filters-option-${index}`}
                        onChange={() =>
                          handleColumnVisibilityChange(column, hiddenColumns, columnData, setHiddenColumns)
                        }
                      />
                      <Label tag="span">{column.name}</Label>
                    </ListboxItem>
                  ) : null;
                })}
              </Listbox>
            </ListboxContainer>
            {columnData.filter(col => col.hidden).length > 0 && (
              <InputMessage id="manage-columns-in-table-amount">
                {columnData.filter(col => col.hidden).length} column(s) hidden
              </InputMessage>
            )}
          </fieldset>
          <Utility vFlex vMarginTop={8} vGap={10} vJustifyContent="between">
            <Button onClick={handleApply}>Apply</Button>
            <Button colorScheme="tertiary" onClick={reset}>
              Reset table
            </Button>
          </Utility>
        </Utility>
      </TableDropdownButton>
    </FilterActionBar>
  );
};

/**
 * Table with inline filtering controls within column headers.
 */
const InTableFiltersDynamicTable = () => {
  // Generate demo data - deep copy to avoid shared state with other examples
  const [columnData, setColumnData] = useState<ColData[]>(() =>
    columnDataFilterDefaults.map(col => ({
      ...col,
      headerActions: col.headerActions ? { ...col.headerActions, selectedOptions: [] } : col.headerActions,
    }))
  );
  const data: RowData[] = generateFilterData(100);

  // State for pinned column, default to Column D
  const [pinnedColumn, setPinnedColumn] = useState<ColData | null>(null);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // visible columns based on hidden/pinned state
  const visibleColumns = useMemo(() => {
    const nonHiddenColumns = columnData.filter(col => !col.hidden);
    if (pinnedColumn) {
      return [pinnedColumn, ...nonHiddenColumns.filter(col => col.name !== pinnedColumn.name)];
    }
    return nonHiddenColumns;
  }, [columnData, pinnedColumn]);

  // track open state of column filter dropdowns
  const [columnFiltersOpen, setColumnFiltersOpen] = useState<boolean[]>(columnData.map(() => false));

  // Table state for sorting and filtering
  const [tableState, setTableState] = useState<FilterableTableState>({
    column: identifyingColumn,
    direction: SortType.ASC,
    filters: {},
  });

  // initial full data set
  const sortedData = useMemo(() => {
    return revisedSortTableData(tableState, columnData, data);
  }, [tableState]);

  // holds filtered data
  const filteredData = useMemo(() => {
    return getFilteredData(tableState.filters, sortedData);
  }, [tableState.filters, sortedData]);

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);

  // holds visible rows based on pagination (computed after filter)
  const visibleRows = useMemo(() => {
    const { from, to } = calculatePagesFromTo(filteredData.length, itemsPerPage, selectedPage);
    return filteredData.slice(from - 1, to);
  }, [filteredData, itemsPerPage, selectedPage]);

  /**
   * Updates the sort key to trigger table re-sorting.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setTableState({ ...tableState, column: column.name, direction: direction });
    onFirstPage();
  };

  /**
   * Resets to first page when filters change.
   */
  useEffect(() => {
    setSelectedPage(1);
  }, [filteredData]);

  // Pagination
  const totalItems = useMemo(() => filteredData?.length ?? 0, [filteredData]);
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const currentPage = selectedPage;
  const { onFirstPage, ...remainingPaginationData } = usePagination({
    selectedPage: currentPage,
    setSelectedPage: setSelectedPage,
    totalPages,
  });

  // State for hidden columns
  const [hiddenColumns, setHiddenColumns] = useState<boolean[]>(columnData.map(col => !!col.hidden));

  /**
   * Clears a single filter from table state.
   *
   * @param filterName - Name of filter to clear
   */
  const clearFilter = (filterName: string) => {
    const { updatedColumnData, updatedFilters } = clearSingleFilter(filterName, columnData);
    setColumnData(updatedColumnData);
    setTableState({ ...tableState, filters: updatedFilters });
  };

  /**
   * Applies filters from column to table state.
   *
   * @param column - Column containing filters to apply
   */
  const applyColumnFilters = (column: ColData) => {
    const updatedFilters = applyAllFilters(columnData);
    setTableState({ ...tableState, filters: updatedFilters });
    toggleColumnHeaderAction(column);
  };

  /**
   * Clears all filters from table state.
   *
   * @param column - Optional column to close dropdown
   * @param closeDropdown - Whether to close dropdown after clearing
   */
  const clearColumnFilters = (column?: ColData, closeDropdown = true) => {
    const { updatedColumnData, updatedFilters } = clearMultipleFilters(columnData);
    setColumnData(updatedColumnData);
    setTableState({ ...tableState, filters: updatedFilters });
    if (closeDropdown && column) {
      toggleColumnHeaderAction(column);
    }
  };

  /**
   * Toggles column header action dropdown open/closed state.
   *
   * @param column - Column to toggle dropdown for
   * @param isOpen - Whether dropdown should be open
   */
  const toggleColumnHeaderAction = (column: ColData, isOpen = false) => {
    const colIndex = columnData.indexOf(column);
    toggleColumnDropdown(colIndex, columnFiltersOpen, setColumnFiltersOpen, isOpen);
  };

  return (
    <Utility vFlex vFlexCol vGap="16">
      <ActionBar
        columnData={columnData}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
        setColumnData={setColumnData}
        setTableState={setTableState}
      />
      <ChipFilters
        filters={tableState.filters}
        clearSingleFilter={clearFilter}
        clearAllFilters={() => clearColumnFilters(undefined, false)}
      />
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
          className="fixed-table"
        >
          <ScreenReader tag="caption">Dynamic table with in-table filters.</ScreenReader>
          <Thead>
            <Tr>
              {visibleColumns.map(col => {
                const columnName = col.name.replace(/\s+/g, '-').toLowerCase();
                return (
                  <Th
                    key={'th-' + columnName}
                    scope="col"
                    className={cn(col.compact && 'compact-column', col.name === pinnedColumn?.name && 'pinned-column')}
                    aria-sort={col.name === tableState.column ? tableState.direction : SortType.NONE}
                  >
                    <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={4}>
                      {col.compact ? <ScreenReader>{col.name}</ScreenReader> : col.name}
                      <ActionsButton
                        column={col}
                        label={col.name}
                        onSort={direction => sort(col, direction)}
                        sorted={col.name === tableState.column ? tableState.direction : SortType.NONE}
                        open={columnFiltersOpen[columnData.indexOf(col)]}
                        setOpen={(isOpen: boolean) => {
                          toggleColumnHeaderAction(col, isOpen);
                        }}
                        pinned={col.name === pinnedColumn?.name}
                        onPin={() => {
                          setPinnedColumn(prev => {
                            if (prev && prev === col) {
                              // unpin the column
                              return null;
                            } else {
                              // pin the new column
                              return col;
                            }
                          });
                          const index = columnData.indexOf(col);
                          toggleColumnDropdown(index, columnFiltersOpen, setColumnFiltersOpen);
                        }}
                        onHide={() => {
                          handleColumnVisibilityChange(col, hiddenColumns, columnData, setHiddenColumns, setColumnData);
                        }}
                        applyColumnFilters={column => applyColumnFilters(column)}
                        clearColumnFilters={column => clearColumnFilters(column)}
                      />
                    </Utility>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {visibleRows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {visibleColumns.map(col => (
                  <Td
                    key={'td-' + col.name.replace(/\s+/g, '-').toLowerCase()}
                    scope={col.identifier ? 'row' : undefined}
                    className={cn(col.compact && 'compact-column', col.name === pinnedColumn?.name && 'pinned-column')}
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
        id="dynamic-table-in-table-filters"
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

export default InTableFiltersDynamicTable;
