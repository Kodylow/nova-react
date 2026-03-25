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
import { VisaErrorTiny, VisaInformationTiny, VisaSuccessTiny, VisaWarningTiny } from '@visa/nova-icons-react';
import type { BadgeProperties } from '@visa/nova-react';

/**
 * Row data to store string values for each column.
 * ie. { 'Status': 'Approved', 'Amount': '$1000', ... }
 */
export type RowData = Record<string, string>;

/**
 * Row data for multi-action tables, where values can be string or an array of action buttons.
 */
export type RowDataMultiActions = Record<string, string | ActionButtons[]>;

/**
 * Column data type definition.
 *
 * @property badge - (optional) Whether the column displays badge components
 * @property compact - (optional) Whether the column should use compact spacing
 * @property genericHeaderActions - (optional) Whether the column has generic header actions
 * @property headerActions - (optional) Settings for filter options
 * @property headerActions.options - Available filter options (FilterOption array or string array)
 * @property headerActions.selectedOptions - Currently selected filter values
 * @property hidden - (optional) Whether the column is currently hidden
 * @property identifier - (optional) Whether this column serves as the row identifier
 * @property name - Display name of the column
 * @property render - (optional) Custom function to render cell content
 * @property renderActionButtons - (optional) Custom function to render action buttons in cells
 * @property sortable - Whether the column supports sorting
 */
export type ColData = {
  badge?: boolean;
  compact?: boolean;
  genericHeaderActions?: boolean;
  headerActions?: {
    options: FilterOption[] | string[];
    selectedOptions: string[];
  };
  hidden?: boolean;
  identifier?: boolean;
  name: string;
  render?: (rowData: RowData, colID?: string) => React.ReactNode;
  renderActionButtons?: (rowData: RowDataMultiActions, colID?: string) => React.ReactNode;
  sortable: boolean;
};

/**
 * Sort key type definition.
 *
 * @property column - Name of the column to sort by
 * @property direction - Sort direction (ascending, descending, or none)
 */
export type SortKeyType = {
  column: string;
  direction: SortType;
};

/**
 * Filterable table state type definition.
 *
 * @property column - Name of the column currently sorted
 * @property direction - Current sort direction (ascending, descending, or none)
 * @property filters - Currently applied filters grouped by column name
 *
 * Same as SortKeyType but with filters
 */
export type FilterableTableState = {
  column: string;
  direction: SortType;
  filters: Record<string, string[]>;
};

/**
 * Sort type constants.
 */
export const SortType = {
  NONE: 'none',
  ASC: 'ascending',
  DESC: 'descending',
} as const;
export type SortType = (typeof SortType)[keyof typeof SortType];

/**
 * Action buttons available in the dynamic table.
 */
export const ActionButtons = {
  EDIT: 'edit',
  DELETE: 'delete',
} as const;
export type ActionButtons = (typeof ActionButtons)[keyof typeof ActionButtons];

/**
 * Badge configurations for different statuses.
 *
 * @property type - Badge type from Nova (critical, neutral, stable, subtle, warning)
 * @property icon - Icon element to display in the badge
 * @property text - Display text for the badge status
 */
export const badgeConfigs: Array<{
  type: BadgeProperties['badgeType'];
  icon: React.ReactNode;
  text: string;
}> = [
  {
    type: 'critical',
    icon: <VisaErrorTiny aria-label="error" />,
    text: 'Declined',
  },
  {
    type: 'neutral',
    icon: <VisaInformationTiny aria-label="information" />,
    text: 'In progress',
  },
  {
    type: 'stable',
    icon: <VisaSuccessTiny aria-label="success" />,
    text: 'Approved',
  },
  {
    type: 'warning',
    icon: <VisaWarningTiny aria-label="warning" />,
    text: 'On hold',
  },
];

/**
 * Represents a single filter option with label and checked status.
 *
 * @property label - Display text for the filter option
 * @property checked - (optional) Whether the filter option is currently selected
 */
export type FilterOption = { label: string; checked?: boolean };

/**
 * A group of filter options organized by filter name.
 */
export type FilterOptions = Record<string, FilterOption[]>;
