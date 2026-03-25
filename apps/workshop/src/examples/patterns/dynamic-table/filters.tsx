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
import { VisaFilterAltTiny, VisaSettingsTiny } from '@visa/nova-icons-react';
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
  Typography,
  usePagination,
  Utility,
} from '@visa/nova-react';
import { useEffect, useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { SortType, type ColData, type FilterableTableState, type RowData } from './shared/dynamic-table.constants';

import cn from 'clsx';
import AccordionFilterItem from './shared/accordion-filter-items';
import FilterActionBar from './shared/action-bar';
import ActionsButton from './shared/actions-button';
import ChipFilters from './shared/chip-filters';
import './shared/dynamic-table.scss';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import FilterCheckboxGroups from './shared/filter-checkbox-groups';
import {
  applyAllFilters,
  applySingleColumnFilter,
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
 * @property filterDropdownOpen - Whether the filter dropdown is currently open
 * @property setFilterDropdownOpen - Function to open or close the filter dropdown
 * @property columnData - Array of column data
 * @property hiddenColumns - Array of booleans indicating which columns are hidden
 * @property setHiddenColumns - Function to update which columns are hidden
 * @property setColumnData - Function to update column settings
 * @property setTableState - Function to update table sorting and filters
 * @property applyFilters - Function to apply all selected filters
 * @property clearFilters - Function to clear all filters
 */
interface ActionBarProps {
  filterDropdownOpen: boolean;
  setFilterDropdownOpen: (value: boolean) => void;
  columnData: ColData[];
  hiddenColumns: boolean[];
  setHiddenColumns: Dispatch<SetStateAction<boolean[]>>;
  setColumnData: Dispatch<SetStateAction<ColData[]>>;
  setTableState: Dispatch<SetStateAction<FilterableTableState>>;
  applyFilters: () => void;
  clearFilters: () => void;
}

/**
 * ActionBar combines both filter management and table settings in a unified location.
 * It provides a filter dialog for applying filters across multiple columns
 * simultaneously, plus a settings dropdown for managing column visibility.
 */
const ActionBar = ({
  filterDropdownOpen,
  setFilterDropdownOpen,
  columnData,
  hiddenColumns,
  setHiddenColumns,
  setColumnData,
  setTableState,
  applyFilters,
  clearFilters,
}: ActionBarProps) => {
  // State for settings dropdown open, separate from filter dropdown (which lives in parent)
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState<boolean>(false);

  /**
   * Saves column visibility changes and closes the settings dropdown.
   */
  const handleApply = () => {
    manageColumnVisibility(columnData, hiddenColumns, setColumnData);
    setSettingsDropdownOpen(false);
  };

  /**
   * Resets table to its default state.
   */
  const reset = () => {
    setHiddenColumns(columnData.map(() => false));
    resetTable(columnData, setColumnData, setTableState, setSettingsDropdownOpen);
  };

  return (
    // Filter dropdown
    <FilterActionBar>
      <TableDropdownButton
        id="all-filters"
        buttonAriaLabel="Filter table"
        open={!!filterDropdownOpen}
        setOpen={(isOpen: boolean) => {
          setFilterDropdownOpen(isOpen);
        }}
        icon={<VisaFilterAltTiny />}
      >
        <Utility vFlex vFlexCol vGap={10} vFlexGrow vPadding={7}>
          <Typography variant="headline-4">All filters</Typography>
          <Utility vFlex vFlexCol vGap="4" vFlexGrow>
            {columnData.map(
              column =>
                column.headerActions && (
                  <AccordionFilterItem
                    filterLength={column.headerActions.selectedOptions.length}
                    columnName={column.name}
                    key={'accordion-all-filter-item-' + column.name}
                  >
                    <FilterCheckboxGroups column={column} key={'all-filter-checkbox-group' + column.name} />
                  </AccordionFilterItem>
                )
            )}
          </Utility>
          <Utility vFlex vJustifyContent="between" vGap="16">
            <Button onClick={() => applyFilters()}>Apply</Button>
            <Button colorScheme="tertiary" onClick={() => clearFilters()}>
              Clear all
            </Button>
          </Utility>
        </Utility>
      </TableDropdownButton>

      {/* Settings dropdown */}
      <TableDropdownButton
        id="multiple-filters-settings"
        buttonAriaLabel="All filter table settings"
        open={!!settingsDropdownOpen}
        setOpen={(isOpen: boolean) => {
          setSettingsDropdownOpen(isOpen);
        }}
        icon={<VisaSettingsTiny />}
      >
        <Utility vFlex vFlexCol vGap={6} vFlexGrow vMargin={7}>
          <fieldset>
            <Label id="all-filters-legend" tag="legend">
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
                      htmlFor={`all-filters-option-${index}`}
                      key={`all-filters-option-${index}`}
                      tag="label"
                    >
                      <Checkbox
                        checked={!hiddenColumns[index]}
                        className="v-flex-shrink-0"
                        id={`all-filters-option-${index}`}
                        name={`all-filters-option-${index}`}
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
              <InputMessage id="manage-columns-all-filters-amount">
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
 * Advanced table with comprehensive filtering, column management, and pagination.
 */
const FiltersDynamicTable = () => {
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

  // visible columns based on hidden state
  const visibleColumns = useMemo(() => {
    const nonHiddenColumns = columnData.filter(col => !col.hidden);
    if (pinnedColumn) {
      return [pinnedColumn, ...nonHiddenColumns.filter(col => col.name !== pinnedColumn.name)];
    }
    return nonHiddenColumns;
  }, [columnData, pinnedColumn]);

  const [columnFiltersOpen, setColumnFiltersOpen] = useState<boolean[]>(columnData.map(() => false));

  const [tableState, setTableState] = useState<FilterableTableState>({
    column: identifyingColumn,
    direction: SortType.ASC,
    filters: {},
  });

  // holds sorted data (ascending, descending, none)
  const sortedData = useMemo(() => {
    return revisedSortTableData(tableState, columnData, data);
  }, [tableState]);

  // holds filtered data, updates when filters or sorted data change
  const filteredData = useMemo(() => {
    return getFilteredData(tableState.filters, sortedData);
  }, [tableState.filters, sortedData]);

  useEffect(() => {
    // Reset to first page when filters change
    setSelectedPage(1);
  }, [filteredData]);

  /**
   * Sorts the table by a column and returns to the first page.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setTableState({ ...tableState, column: column.name, direction: direction });
    onFirstPage();
  };

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPage, setSelectedPage] = useState(1);

  // holds visible rows based on pagination (computed after filter)
  const visibleRows = useMemo(() => {
    const { from, to } = calculatePagesFromTo(filteredData.length, itemsPerPage, selectedPage);
    return filteredData.slice(from - 1, to);
  }, [filteredData, itemsPerPage, selectedPage]);

  // Pagination
  const totalItems = useMemo(() => filteredData?.length ?? 0, [filteredData]);
  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const currentPage = selectedPage;
  const { onFirstPage, ...remainingPaginationData } = usePagination({
    selectedPage: currentPage,
    setSelectedPage: setSelectedPage,
    totalPages,
  });

  /** Filter, hide/show columns, pin columns */
  const [hiddenColumns, setHiddenColumns] = useState<boolean[]>(columnData.map(col => !!col.hidden));
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<boolean>(false);

  /**
   * Applies selected filters and closes the filter dropdown.
   */
  const applyFilters = () => {
    const updatedFilters = applyAllFilters(columnData);
    setTableState({ ...tableState, filters: updatedFilters });
    setFilterDropdownOpen(false);
  };

  /**
   * Removes all filters from the table.
   *
   * @param closeDropdown - Whether to close the filter dropdown after clearing
   */
  const clearFilters = (closeDropdown = true) => {
    const { updatedColumnData, updatedFilters } = clearMultipleFilters(columnData);
    setColumnData(updatedColumnData);
    setTableState({ ...tableState, filters: updatedFilters });
    if (closeDropdown) setFilterDropdownOpen(false);
  };

  /**
   * Removes a single filter from the table.
   *
   * @param filterName - Name of the filter to remove
   */
  const clearFilter = (filterName: string) => {
    const { updatedColumnData, updatedFilters } = clearSingleFilter(filterName, columnData);
    setColumnData(updatedColumnData);
    setTableState({ ...tableState, filters: updatedFilters });
  };

  /**
   * Applies filters for a specific column from the column header dropdown.
   *
   * @param column - Column to apply filters for
   */
  const applyColumnFilters = (column: ColData) => {
    const updatedFilters = applySingleColumnFilter(column);
    setTableState({ ...tableState, filters: updatedFilters });
    toggleColumnHeaderAction(column);
  };

  /**
   * Removes filters for a specific column from the column header dropdown.
   *
   * @param column - Column to clear filters for
   */
  const clearColumnFilters = (column: ColData) => {
    const { updatedColumnData, updatedFilters } = clearMultipleFilters(columnData);
    setColumnData(updatedColumnData);
    setTableState({ ...tableState, filters: updatedFilters });
    toggleColumnHeaderAction(column);
  };

  /**
   * Opens or closes the column header dropdown menu.
   *
   * @param column - Column to toggle dropdown for
   * @param isOpen - Whether the dropdown should be open
   */
  const toggleColumnHeaderAction = (column: ColData, isOpen = false) => {
    const colIndex = columnData.indexOf(column);
    toggleColumnDropdown(colIndex, columnFiltersOpen, setColumnFiltersOpen, isOpen);
  };

  return (
    <Utility vFlex vFlexCol vGap="16">
      <ActionBar
        filterDropdownOpen={filterDropdownOpen}
        setFilterDropdownOpen={setFilterDropdownOpen}
        columnData={columnData}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
        setColumnData={setColumnData}
        setTableState={setTableState}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
      <ChipFilters
        filters={tableState.filters}
        clearSingleFilter={clearFilter}
        clearAllFilters={() => clearFilters(false)}
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
          <ScreenReader tag="caption">Dynamic table with multiple filters.</ScreenReader>
          <Thead>
            <Tr>
              {visibleColumns.map(col => {
                const columnName = col.name.replace(/\s+/g, '-').toLowerCase();
                return (
                  <Th
                    key={'th-' + columnName}
                    scope="col"
                    className={cn(col.compact && 'compact-column', col.name === pinnedColumn?.name && 'pinned-column')}
                    aria-sort={col.name === tableState.column ? tableState.direction : 'none'}
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
                          toggleColumnHeaderAction(col);
                        }}
                        onHide={() => {
                          handleColumnVisibilityChange(col, hiddenColumns, columnData, setHiddenColumns, setColumnData);
                          toggleColumnHeaderAction(col);
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
        id="dynamic-table-multiple-filters"
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

export default FiltersDynamicTable;
