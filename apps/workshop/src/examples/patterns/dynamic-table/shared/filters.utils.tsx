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
  badgeConfigs,
  type ColData,
  type FilterableTableState,
  type FilterOption,
  type RowData,
  SortType,
} from './dynamic-table.constants';
import { filterOptions } from './generate-demo-data.utils';

/**
 * Generates seeded random numbers using the Mulberry32 algorithm.
 * Using a seed ensures the same sequence of numbers is generated each time.
 *
 * @param seed - Seed value for consistent random numbers
 * @returns Function that returns a random number between 0 and 1
 */
export const pseudoRandomGenerator = (seed: number) => {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Generates row data for the dynamic table based on the provided filter options.
 *
 * @param numRows - Number of rows to generate
 * @returns Generated row data
 */
export const generateFilterData = (numRows: number): RowData[] => {
  const rows: RowData[] = [];
  const fileNames = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8', 'I9', 'J10'];
  // Use a seeded pseudo-random generator for deterministic results
  const seed = 42;

  for (let i = 0; i < numRows; i++) {
    const rand = pseudoRandomGenerator(seed + i);

    rows.push({
      'File name': fileNames[i % fileNames.length] + '-' + (i + 100),
      'Added by': filterOptions.addedBy[i % filterOptions.addedBy.length].label,
      'File size': `${Math.floor(rand() * 900) + 100} KB`,
      'File type': filterOptions.fileTypes[i % filterOptions.fileTypes.length].label,
      Status: badgeConfigs[Math.floor(rand() * badgeConfigs.length)].text ?? 'approved',
      Region: filterOptions.region[i % filterOptions.region.length].label,
      Actions: '',
    });
  }
  return rows;
};

/**
 * Filters the provided rows based on the applied filters.
 *
 * @param filters - Current applied filters
 * @param rows - Current row data
 * @returns Filtered row data
 */
export const getFilteredData = (filters: Record<string, string[]>, rows: RowData[]): RowData[] => {
  let updatedRows: RowData[] = [...rows];
  Object.keys(filters).forEach(columnName => {
    const selectedOptions = filters[columnName];
    if (selectedOptions.length > 0) {
      if (columnName === 'File size') {
        // Special handling for file size ranges
        updatedRows = updatedRows.filter(row => {
          const fileSizeStr = row['File size'];
          const fileSizeNum = parseFloat(fileSizeStr.replace(' KB', ''));
          const returnVar = selectedOptions.some(option => {
            if (option === '< 300 KB') return fileSizeNum < 300;
            if (option === '300-600 KB') return fileSizeNum >= 300 && fileSizeNum <= 600;
            if (option === '> 600 KB') return fileSizeNum > 600;
            return false;
          });
          return returnVar;
        });
      } else {
        updatedRows = updatedRows.filter(row => selectedOptions.includes(row[columnName]));
      }
    }
  });
  return updatedRows;
};

/**
 * Collects all selected filters from all columns and returns them.
 *
 * @param columnData - Column data containing filter selections
 * @returns Updated filters object
 */
export const applyAllFilters = (columnData: ColData[]): Record<string, string[]> => {
  const updatedFilters: Record<string, string[]> = {};
  columnData.forEach(column => {
    if (column.headerActions) {
      const selectedOptions = column.headerActions.selectedOptions;
      updatedFilters[column.name] = selectedOptions;
    }
  });
  return updatedFilters;
};

/**
 * Gets and returns the selected filters for a single column.
 *
 * @param column - Column data containing filter selections
 * @returns Updated filters object
 */
export const applySingleColumnFilter = (column: ColData): Record<string, string[]> => {
  const updatedFilters: Record<string, string[]> = {};
  if (column.headerActions) {
    const selectedOptions = column.headerActions.selectedOptions;
    updatedFilters[column.name] = selectedOptions;
  }
  return updatedFilters;
};

/**
 * Removes all filters by resetting column selections.
 *
 * @param columnData - Column data to reset
 * @returns Updated column data and filters
 */
export const clearMultipleFilters = (
  columnData: ColData[]
): {
  updatedColumnData: ColData[];
  updatedFilters: Record<string, string[]>;
} => {
  const resetColData = columnData.map(col => {
    if (col.headerActions) {
      (col.headerActions.options as FilterOption[]).forEach(option => {
        // since option.checked is optional, verify it's there before unsetting
        if (option.checked) option.checked = false;
      });
      col.headerActions.selectedOptions = [];
    }
    return col;
  });
  return {
    updatedColumnData: resetColData,
    updatedFilters: {},
  };
};

/**
 * Removes a single filter from the column data.
 *
 * @param filter - Name of the filter to remove
 * @param columnData - Column data to update
 * @returns Updated column data and filters
 */
export const clearSingleFilter = (
  filter: string,
  columnData: ColData[]
): {
  updatedColumnData: ColData[];
  updatedFilters: Record<string, string[]>;
} => {
  const updatedFilters: Record<string, string[]> = {};
  const updatedColData = columnData.map(col => {
    if (col.headerActions) {
      // Remove the filter from selectedOptions
      col.headerActions.selectedOptions = col.headerActions.selectedOptions.filter(opt => opt !== filter);
      updatedFilters[col.name] = col.headerActions.selectedOptions;
      // Uncheck the option if present
      (col.headerActions.options as FilterOption[]).forEach(option => {
        if (option.label === filter && option.checked) {
          option.checked = false;
        }
      });
    }
    return col;
  });
  return {
    updatedColumnData: updatedColData,
    updatedFilters: updatedFilters,
  };
};

/**
 * Resets column data to default state.
 *
 * @param columnData - Column data to reset
 * @returns Reset column data
 */
export const getResetColumnData = (columnData: ColData[]): ColData[] => {
  return columnData.map(column => ({
    ...column,
    hidden: false,
    sorted: SortType.NONE,
    pinned: false,
    headerActions: column.headerActions ? { ...column.headerActions, selectedOptions: [] } : column.headerActions,
  }));
};

/**
 * Resets the table to its default state, including column visibility and filters.
 *
 * @param columnData - Current column data
 * @param setColumnData - Function to update column data
 * @param setTableState - Function to update table state
 * @param setFilterPopupOpen - Function to update filter popup open state (to close after reset)
 */
export const resetTable = (
  columnData: ColData[],
  setColumnData: React.Dispatch<React.SetStateAction<ColData[]>>,
  setTableState: React.Dispatch<React.SetStateAction<FilterableTableState>>,
  setFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Reset hidden columns
  const resetColData = getResetColumnData(columnData);
  setColumnData(resetColData);
  // Reset filters
  setTableState({
    column: '',
    direction: SortType.NONE,
    filters: {},
  });
  setFilterPopupOpen(false);
};

/**
 * Updates column visibility based on which columns should be hidden.
 *
 * @param columnData - Current column data
 * @param hiddenColumns - Array indicating which columns should be hidden
 * @param setColumnData - Function to update column data
 */
export const manageColumnVisibility = (
  columnData: ColData[],
  hiddenColumns: boolean[],
  setColumnData: React.Dispatch<React.SetStateAction<ColData[]>>
) => {
  const updatedColData = [...columnData];
  updatedColData.forEach((column, index) => {
    column.hidden = hiddenColumns[index];
  });
  setColumnData(updatedColData);
};

/**
 * Shows or hides a column and updates the hidden columns array.
 *
 * @param column - Column to show or hide
 * @param hiddenColumns - Array indicating which columns are hidden
 * @param columnData - Current column data
 * @param setHiddenColumns - Function to update hidden columns
 * @param setColumnData - Optional function to update column data - if provided, applies change immediately
 */
export const handleColumnVisibilityChange = (
  column: ColData,
  hiddenColumns: boolean[],
  columnData: ColData[],
  setHiddenColumns: React.Dispatch<React.SetStateAction<boolean[]>>,
  setColumnData?: React.Dispatch<React.SetStateAction<ColData[]>>
) => {
  const columnIndex = columnData.indexOf(column);
  const updatedHiddenColumns = [...hiddenColumns];
  updatedHiddenColumns[columnIndex] = !updatedHiddenColumns[columnIndex];
  setHiddenColumns(updatedHiddenColumns);

  // If setColumnData is provided, apply the change immediately to columnData
  if (setColumnData) {
    const updatedColData = [...columnData];
    updatedColData[columnIndex] = { ...updatedColData[columnIndex], hidden: updatedHiddenColumns[columnIndex] };
    setColumnData(updatedColData);
  }
};

/**
 * Opens or closes a column filter dropdown.
 *
 * @param index - Index from columnData (not visibleColumnData)
 * @param columnFiltersOpen - Array indicating which column filter dropdowns are open
 * @param setColumnFiltersOpen - Function to update column filter dropdowns
 * @param isOpen - Optional boolean to set the open state explicitly; defaults to false
 */
export const toggleColumnDropdown = (
  index: number,
  columnFiltersOpen: boolean[],
  setColumnFiltersOpen: React.Dispatch<React.SetStateAction<boolean[]>>,
  isOpen = false
) => {
  const updatedOpenStates = [...columnFiltersOpen];
  updatedOpenStates[index] = isOpen;
  setColumnFiltersOpen(updatedOpenStates);
};
