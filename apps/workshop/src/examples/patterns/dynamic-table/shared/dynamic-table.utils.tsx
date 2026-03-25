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
import type { BadgeProperties } from '@visa/nova-react';
import { badgeConfigs, SortType, type ColData, type RowData, type SortKeyType } from './dynamic-table.constants';

/**
 * Sorts the data based on the given column and updates the sort state.
 *
 * @param sortKey - The key and direction to sort by
 * @param currentColumnData - Current column definitions
 * @param currentSortedData - Current data to be sorted
 * @returns Sorted data
 */
export const revisedSortTableData = (
  sortKey: SortKeyType,
  currentColumnData: ColData[] | ColData[],
  currentSortedData: RowData[]
): RowData[] => {
  const columnName = sortKey.column;
  // Create a copy of the column data to avoid mutating the original
  const columnDataCopy = currentColumnData.map(col => ({ ...col }));

  const columnToSort = columnDataCopy.find(c => c.name === columnName);
  if (!columnToSort || !columnToSort.sortable) return currentSortedData;

  // Create a copy of the data before sorting to avoid mutating the original array
  const preSortedData = [...currentSortedData].sort((item1, item2) => {
    const a = item1[columnName];
    const b = item2[columnName];
    if (columnToSort.badge) {
      const aType = badgeConfigs.find(badge => badge.text === a)?.type;
      const bType = badgeConfigs.find(badge => badge.text === b)?.type;
      /** badge sorting */
      return sortBadgeItems(aType, bType);
    } else if (typeof a === 'string' && typeof b === 'string') {
      /** string sorting */
      return sortStringItems(a, b);
    } else if (typeof a === 'boolean' && typeof b === 'boolean') {
      /** boolean sorting */
      return sortBoolItems(a, b);
    }
    return 0;
  });

  // return sorted data using new direction
  if (sortKey.direction === SortType.ASC) {
    return preSortedData;
  } else {
    const reversedData = [...preSortedData].reverse();
    return reversedData;
  }
};

/**
 * Sorts boolean items.
 *
 * @param a - First boolean value
 * @param b - Second boolean value
 * @returns Sorting order
 */
export const sortBoolItems = (a: boolean, b: boolean): number => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  }
  return 0;
};

/**
 * Sorts string items.
 *
 * @param a - First string value
 * @param b - Second string value
 * @returns Sorting order
 */
export const sortStringItems = (a: string, b: string): number => {
  // START GENAI@CHATGPT5
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  // END GENAI@CHATGPT5
};

/**
 * Sorts badge items by critical to least critical.
 *
 * @param a - Badge type of first item
 * @param b - Badge type of second item
 * @returns Sorting order
 */
export const sortBadgeItems = (a: BadgeProperties['badgeType'], b: BadgeProperties['badgeType']): number => {
  const badgeOrder: BadgeProperties['badgeType'][] = ['critical', 'warning', 'stable', 'neutral'];
  const indexA = badgeOrder.indexOf(a);
  const indexB = badgeOrder.indexOf(b);

  if (indexA < indexB) {
    return -1;
  } else if (indexA > indexB) {
    return 1;
  }
  return 0;
};
