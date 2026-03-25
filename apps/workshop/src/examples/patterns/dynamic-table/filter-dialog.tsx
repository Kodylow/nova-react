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
import { VisaFilterAltTiny } from '@visa/nova-icons-react';
import {
  Button,
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
  Typography,
  usePagination,
  Utility,
} from '@visa/nova-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import AccordionFilterItem from './shared/accordion-filter-items';
import FilterActionBar from './shared/action-bar';
import ActionsButton from './shared/actions-button';
import ChipFilters from './shared/chip-filters';
import { SortType, type ColData, type FilterableTableState, type RowData } from './shared/dynamic-table.constants';
import './shared/dynamic-table.scss';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import FilterCheckboxGroups from './shared/filter-checkbox-groups';
import {
  applyAllFilters,
  clearMultipleFilters,
  clearSingleFilter,
  generateFilterData,
  getFilteredData,
} from './shared/filters.utils';
import { columnDataFilterDefaults } from './shared/generate-demo-data.utils';
import DynamicTablePagination from './shared/pagination-shared';
import TableDropdownButton from './shared/table-dropdown-button';

/**
 * Props for ActionBar component.
 *
 * @property open - Whether the filter dialog is currently open
 * @property setOpen - Function to control the dialog open state
 * @property columnData - Array of column configuration objects
 * @property applyFilters - Function to apply all selected filters to the table
 * @property clearFilters - Function to clear all active filters
 */
interface ActionBarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  columnData: ColData[];
  applyFilters: () => void;
  clearFilters: () => void;
}

/**
 * Filter dialog for applying filters across multiple columns simultaneously. The dialog
 * presents all filterable columns in an organized accordion layout, allowing users to
 * configure multiple filters before applying them at once.
 */
const ActionBar = ({ open, setOpen, columnData, applyFilters, clearFilters }: ActionBarProps) => {
  return (
    <FilterActionBar>
      <TableDropdownButton
        id="filter-dialog"
        buttonAriaLabel="Filter table"
        open={!!open}
        setOpen={(isOpen: boolean) => {
          setOpen(isOpen);
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
                    key={'accordion-filter-dialog-item-' + column.name}
                  >
                    <FilterCheckboxGroups column={column} key={'filter-dialog-checkbox-group' + column.name} />
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
    </FilterActionBar>
  );
};

/**
 * Table with centralized filter controls in a dialog interface.
 */
const FilterDialogDynamicTable = () => {
  // Generate demo data
  const [columnData, setColumnData] = useState<ColData[]>(() => [...columnDataFilterDefaults]);
  const data: RowData[] = generateFilterData(100);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  const [tableState, setTableState] = useState<FilterableTableState>({
    column: identifyingColumn,
    direction: SortType.ASC,
    filters: {},
  });

  // holds sorted data (ascending, descending, none)
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

  /** Filtering */
  const [filterPopupOpen, setFilterPopupOpen] = useState<boolean>(false);

  /**
   * Applies filters from dialog to table state.
   */
  const applyFilters = () => {
    const updatedFilters = applyAllFilters(columnData);
    setTableState({ ...tableState, filters: updatedFilters });
    setFilterPopupOpen(false);
  };

  /**
   * Clears all filters from table state.
   *
   * @param closeDropdown - Whether to close dialog after clearing
   */
  const clearFilters = (closeDropdown = true) => {
    const { updatedColumnData, updatedFilters } = clearMultipleFilters(columnData);
    setColumnData(updatedColumnData);
    setTableState({ ...tableState, filters: updatedFilters });
    if (closeDropdown) {
      setFilterPopupOpen(false);
    }
  };

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

  return (
    <Utility vFlex vFlexCol vGap="16">
      <ActionBar
        open={filterPopupOpen}
        setOpen={setFilterPopupOpen}
        columnData={columnData}
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
        >
          <ScreenReader tag="caption">Dynamic table with filter dialog.</ScreenReader>
          <Thead>
            <Tr>
              {columnData.map(col => (
                <Th
                  key={'filter-dialog-th-' + col.name.replace(/\s+/g, '-').toLowerCase()}
                  scope="col"
                  className={col.compact ? 'compact-column' : ''}
                  aria-sort={col.name === tableState.column ? tableState.direction : 'none'}
                >
                  <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={4}>
                    {col.compact ? <ScreenReader>{col.name}</ScreenReader> : col.name}
                    <ActionsButton
                      column={col}
                      label={col.name}
                      sortOnly={col.sortable}
                      onSort={direction => sort(col, direction)}
                      sorted={col.name === tableState.column ? tableState.direction : SortType.NONE}
                    />
                  </Utility>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {visibleRows.map((row, rowIndex) => (
              <Tr key={rowIndex + '-filter-dialog'}>
                {columnData.map(col => (
                  <Td
                    key={'filter-dialog-td-' + col.name.replace(/\s+/g, '-').toLowerCase()}
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
        id="dynamic-table-filter-dialog"
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

export default FilterDialogDynamicTable;
