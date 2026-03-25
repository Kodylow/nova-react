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
import ActionsButton from './actions-button';
import StatusBadge from './badge';
import { badgeConfigs, type ColData, type FilterOptions, type RowData } from './dynamic-table.constants';

/** === DEFAULT DATA === */

/**
 * Generates default column data for demo purposes.
 *
 * @param actions - Whether to include actions column
 * @returns Array of column definitions
 */
export const getDefaultColumnData = (actions = true): ColData[] => {
  const data = [
    { name: 'Column A', sortable: true, identifier: true },
    { name: 'Column B', sortable: true },
    ...(actions
      ? [
          {
            name: 'Column C',
            sortable: true,
            badge: true,
            render: (row: RowData) => <StatusBadge label={row['Column C']} />,
          },
          {
            name: 'Actions',
            sortable: false,
            compact: true,
            render: (row: RowData, colID?: string) => <ActionsButton label={row[colID || 'Column A']} />,
          },
        ]
      : [
          { name: 'Column C', sortable: true },
          {
            name: 'Column D',
            sortable: true,
            badge: true,
            render: (row: RowData) => <StatusBadge label={row['Column D']} />,
          },
        ]),
  ];
  return data;
};

/**
 * Generates basic row data for demo purposes.
 *
 * @param numRows - Number of rows to generate
 * @param columnData - Array of column definitions to determine data types
 * @returns Array of row data objects with basic content
 */
export const generateBasicData = (numRows: number, columnData: ColData[]): RowData[] => {
  const rows: RowData[] = [];
  for (let i = 0; i < numRows; i++) {
    const row: RowData = {};
    columnData.forEach(col => {
      if (col.badge) {
        row[col.name] = badgeConfigs[i % badgeConfigs.length].text ?? 'Approved';
      } else if (col.compact) {
        row[col.name] = '';
      } else {
        /** Generate string data like A1, B1, C1, etc. */
        row[col.name] = `${String.fromCharCode(65 + columnData.indexOf(col))}${i + 1}`;
      }
    });
    rows.push(row);
  }
  return rows;
};

/** === DEMO FILTER DATA === */

/**
 * Filter options for demo purposes.
 */
export const filterOptions: FilterOptions = {
  addedBy: [{ label: 'A. Miller' }, { label: 'S. Taylor' }, { label: 'R. Jones' }],
  region: [{ label: 'North America' }, { label: 'Asia Pacific' }, { label: 'Europe' }, { label: 'South America' }],
  fileTypes: [
    { label: 'BMP' },
    { label: 'CSV' },
    { label: 'DOCX' },
    { label: 'GIF' },
    { label: 'JPG' },
    { label: 'PDF' },
    { label: 'PNG' },
    { label: 'PPTX' },
    { label: 'SVG' },
    { label: 'TXT' },
    { label: 'ZIP' },
  ],
  fileSizes: [{ label: '< 300 KB' }, { label: '300-600 KB' }, { label: '> 600 KB' }],
  badgeTypes: badgeConfigs.map(config => ({ label: config.text, value: config.text })),
};

/**
 * Column data with filter options for demo purposes.
 */
export const columnDataFilterDefaults: ColData[] = [
  { name: 'File name', sortable: true, identifier: true },
  {
    name: 'Added by',
    sortable: true,
    headerActions: { options: filterOptions.addedBy, selectedOptions: [] },
  },
  {
    name: 'File size',
    sortable: true,
    headerActions: { options: filterOptions.fileSizes, selectedOptions: [] },
  },
  {
    name: 'File type',
    sortable: true,
    headerActions: { options: filterOptions.fileTypes, selectedOptions: [] },
  },
  {
    name: 'Status',
    sortable: true,

    headerActions: {
      options: badgeConfigs.map(config => ({ label: config.text, value: config.text })),
      selectedOptions: [],
    },
    render: (row: RowData) => <StatusBadge label={row['Status']} />,
  },
  {
    name: 'Region',
    sortable: true,
    headerActions: { options: filterOptions.region, selectedOptions: [] },
  },
  {
    name: 'Actions',
    compact: true,
    sortable: false,
    render: (row: RowData) => <ActionsButton label={row['File name']} />,
  },
];
