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
import { VisaClearAltTiny } from '@visa/nova-icons-react';
import { Utility, Chip, Button, Typography, UtilityFragment } from '@visa/nova-react';

/**
 * Props for ChipFilters.
 *
 * @property filters - Currently applied filters grouped by column name
 * @property clearSingleFilter - Function to remove one specific filter
 * @property clearAllFilters - Function to remove all filters
 */
export interface ChipFiltersProps {
  filters: Record<string, string[]>;
  clearSingleFilter: (filterName: string) => void;
  clearAllFilters: () => void;
}

/**
 * Displays applied filters as dismissible chips, allowing users to see which filters
 * are active and quickly remove them. It groups filters by column and provides both
 * individual filter removal and a "Clear all" action.
 */
const ChipFilters = ({ filters, clearSingleFilter, clearAllFilters }: ChipFiltersProps) => {
  const flattenedFilters = Object.values(filters).flat();

  /**
   * Prevents form submission.
   *
   * @param event - Form event
   */
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    flattenedFilters.length > 0 && (
      <form aria-labelledby="in-table-filters-applied-form-label" onSubmit={handleFormSubmit}>
        <Utility vFlex vFlexWrap vGap={8} vAlignItems="center">
          <Typography variant="label-active" id="in-table-filters-applied-form-label" tag="span">
            Filters applied:
          </Typography>
          {Object.keys(filters).map(columnName => {
            const filtersForColumn = filters[columnName];
            return (
              filtersForColumn.length > 0 && (
                <fieldset key={columnName}>
                  <legend className="v-sr">{`Filters applied for ${columnName}`}</legend>
                  <UtilityFragment vFlex vFlexWrap vGap={8}>
                    <ul>
                      {filtersForColumn.map((filterValue, index) => (
                        <li key={`${columnName}-filter-${index}`}>
                          <Chip>
                            {filterValue}
                            <Button
                              type="button"
                              iconButton
                              colorScheme="tertiary"
                              subtle
                              aria-label={`Clear ${filterValue} filter for ${columnName}`}
                              onClick={() => clearSingleFilter(filterValue)}
                            >
                              <VisaClearAltTiny />
                            </Button>
                          </Chip>
                        </li>
                      ))}
                    </ul>
                  </UtilityFragment>
                </fieldset>
              )
            );
          })}
          <Button type="button" onClick={clearAllFilters} colorScheme="tertiary">
            Clear all
          </Button>
        </Utility>
      </form>
    )
  );
};

export default ChipFilters;
