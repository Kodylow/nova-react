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
import React, { useState } from 'react';
import {
  Utility,
  Checkbox,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
  UtilityFragment,
  ScreenReader,
  Button,
} from '@visa/nova-react';
import type { ColData, FilterOption } from './dynamic-table.constants';
import { kebabCase } from 'change-case';

/**
 * Props for FilterCheckboxGroups.
 *
 * @property column - Column information including available filter options
 * @property legend - (optional) Legend text for the fieldset, typically the column name
 * @property closeDropdown - (optional) Function to close the dropdown menu after an action
 * @property applyColumnFilters - (optional) Function that applies the selected filters
 * @property clearColumnFilters - (optional) Function that removes all filters
 */
type FilterCheckboxGroupsProps = {
  column: ColData;
  legend?: string;
  closeDropdown?: () => void;
  applyColumnFilters?: (column: ColData) => void;
  clearColumnFilters?: (column: ColData) => void;
};

/**
 * Multi-select checkbox interface for filtering table columns. It automatically switches
 * between a simple list (for <5 options) and a scrollable listbox (for 5+ options) to
 * optimize for different data sets. Includes Apply and Clear all actions for batch filter
 * management.
 */
const FilterCheckboxGroups: React.FC<FilterCheckboxGroupsProps> = ({
  column,
  legend,
  closeDropdown,
  applyColumnFilters,
  clearColumnFilters,
}) => {
  const [options, setOptions] = useState<FilterOption[]>(() => {
    const opts = column.headerActions?.options as FilterOption[] | string[] | undefined;
    if (!opts) return [];
    return opts.map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option };
      }
      return option;
    });
  });
  const id = `filter-checkbox-group-${column.name.replace(/\s+/g, '-').toLowerCase()}`;

  /**
   * Updates checkbox state and selected options when a filter option is toggled.
   *
   * @param option - The filter option being changed
   * @param index - Index of the option in the options array
   */
  const handleCheckboxChange = (option: FilterOption, index: number) => {
    const updatedOptions = [...options];
    const checked = updatedOptions[index].checked || false;
    updatedOptions[index].checked = !checked;

    // Update the options state
    setOptions(updatedOptions);

    // Update the selected options array
    let selectedOptions = column?.headerActions?.selectedOptions || [];
    if (selectedOptions.includes(option.label)) {
      selectedOptions = selectedOptions.filter(item => item !== option.label);
    } else {
      selectedOptions.push(option.label);
    }
    // Update the selected options in the column's headerActions
    if (column.headerActions) {
      column.headerActions.selectedOptions = selectedOptions;
    }
  };

  return (
    <>
      {options.length < 5 ? (
        <fieldset aria-labelledby={legend ? `${id}-legend` : undefined}>
          {legend ? (
            <UtilityFragment vMarginLeft={8} vPaddingTop={10}>
              <Label id={`${id}-legend`} tag="legend">
                Filter by {column.name}
              </Label>
            </UtilityFragment>
          ) : (
            <ScreenReader tag="legend">Filter by {column.name}</ScreenReader>
          )}
          <Utility tag="ul" vFlex vFlexCol key={id} vMarginLeft={6}>
            {options.map((option, index) => {
              const value = kebabCase(option.label);
              return (
                <Utility key={value} tag="li" vAlignItems="center" vFlex vGap={2}>
                  <Checkbox
                    checked={option.checked || false}
                    id={`${id}-option-${value}`}
                    onChange={() => handleCheckboxChange(option, index)}
                    value={value}
                  />
                  <Label htmlFor={`${id}-option-${value}`}>{option.label}</Label>
                </Utility>
              );
            })}
          </Utility>
          {closeDropdown && applyColumnFilters && clearColumnFilters && (
            <Utility vFlex vJustifyContent="between" vPadding={6} vMarginTop={4}>
              <Button
                onClick={() => {
                  closeDropdown();
                  applyColumnFilters(column);
                }}
              >
                Apply
              </Button>
              <Button
                colorScheme="tertiary"
                onClick={() => {
                  closeDropdown();
                  clearColumnFilters(column);
                }}
              >
                Clear all
              </Button>
            </Utility>
          )}
        </fieldset>
      ) : (
        <fieldset>
          {legend ? (
            <UtilityFragment vMarginLeft={8} vPaddingTop={10}>
              <Label id={`${id}-legend`} tag="legend">
                Filter by {column.name}
              </Label>
            </UtilityFragment>
          ) : (
            <ScreenReader tag="legend">Filter by {column.name}</ScreenReader>
          )}
          <UtilityFragment vMarginHorizontal={6}>
            <ListboxContainer>
              <Listbox id={id} scroll tag="div">
                {options.map((option, index) => (
                  <ListboxItem<'label'> htmlFor={`${id}-option-${index}`} key={`${id}-option-${index}`} tag="label">
                    <Checkbox
                      className="v-flex-shrink-0"
                      id={`${id}-option-${index}`}
                      name={`${id}-option-${index}`}
                      onChange={() => handleCheckboxChange(option, index)}
                    />
                    <Label tag="span">{option.label}</Label>
                  </ListboxItem>
                ))}
              </Listbox>
            </ListboxContainer>
          </UtilityFragment>
          {closeDropdown && applyColumnFilters && clearColumnFilters && (
            <Utility vFlex vJustifyContent="between" vPadding={6} vMarginTop={4}>
              <Button
                onClick={() => {
                  closeDropdown();
                  applyColumnFilters(column);
                }}
              >
                Apply
              </Button>
              <Button
                colorScheme="tertiary"
                onClick={() => {
                  closeDropdown();
                  clearColumnFilters(column);
                }}
              >
                Clear all
              </Button>
            </Utility>
          )}
        </fieldset>
      )}
    </>
  );
};

export default FilterCheckboxGroups;
