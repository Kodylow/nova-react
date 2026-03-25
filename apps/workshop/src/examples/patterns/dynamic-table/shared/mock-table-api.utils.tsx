/**
 *              © 2026 Visa
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
import type { ColData, RowData, SortKeyType } from './dynamic-table.constants';
import { revisedSortTableData } from './dynamic-table.utils';
import dynamicTableData from './dynamic-table-data.json';

/**
 * Response structure that simulates a real paginated API endpoint.
 *
 * @property data - Array of row data for the current page
 * @property total - Total number of items across all pages
 * @property page - Current page number (1-based)
 * @property pageSize - Number of items per page
 */
export interface PaginatedResponse {
  data: RowData[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Simulates a paginated API endpoint with server-side sorting.
 *
 * @param page - The page number to fetch (1-based)
 * @param pageSize - Number of items per page
 * @param sortKey - Object containing column name and sort direction
 * @param columnData - Column definitions for proper sorting
 * @param delayMs - Optional delay in milliseconds to simulate network latency (default: 800ms)
 * @returns Promise of paginated response with data, total count, and metadata
 */
export const getTablePage = async (
  page: number,
  pageSize: number,
  sortKey: SortKeyType,
  columnData: ColData[],
  delayMs: number = 800
): Promise<PaginatedResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delayMs));

  const fullData = dynamicTableData as RowData[];

  // Simulate server-side sorting
  // In a real API, this would be handled by the database (ORDER BY clause)
  const sortedData = revisedSortTableData(sortKey, columnData, fullData);

  // Simulate server-side pagination
  // In a real API, this would be handled by LIMIT/OFFSET or similar
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Return API-like response structure
  return {
    data: sortedData.slice(start, end),
    total: fullData.length,
    page,
    pageSize,
  };
};

/**
 * Simulates fetching accordion panel data for a specific row.
 *
 * @param rowId - The identifier of the row to fetch details for
 * @param delayMs - Optional delay in milliseconds to simulate network latency (default: 800ms)
 * @returns Promise of accordion data for the specified row
 */
export const getAccordionData = async (rowId: string, delayMs: number = 800): Promise<RowData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delayMs));

  const fullData = dynamicTableData as RowData[];

  // Find the specific row by its File name (identifier)
  const rowData = fullData.find(row => row['File name'] === rowId);

  if (!rowData) {
    throw new Error(`Row with ID ${rowId} not found`);
  }

  // In a real application, the server would return additional details
  // For this demo, we return the full row data which includes all fields
  return rowData;
};
