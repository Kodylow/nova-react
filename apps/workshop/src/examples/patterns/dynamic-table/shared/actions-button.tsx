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
  VisaOptionHorizontalTiny,
  VisaOptionVerticalTiny,
  VisaPasswordHideTiny,
  VisaPinFillTiny,
  VisaPinOutlineTiny,
  VisaSortAscendingTiny,
  VisaSortDescendingTiny,
} from '@visa/nova-icons-react';
import { Button, Divider, Listbox, Utility } from '@visa/nova-react';
import { useId, useState } from 'react';
import DropdownMenuButton from './dropdown-menu-button';
import { SortType, type ColData } from './dynamic-table.constants';
import FilterCheckboxGroups from './filter-checkbox-groups';
import SortIcon from './sort-icon';
import TableDropdownButton from './table-dropdown-button';

/**
 * Props for ActionsButton.
 *
 * @property sortOnly - (optional) Whether to display only sort functionality without additional actions
 * @property label - Accessible label for the button
 * @property column - (optional) Column information including settings
 * @property open - (optional) Whether the dropdown menu is currently open
 * @property setOpen - (optional) Function to open or close the dropdown
 * @property sorted - (optional) Current sort direction for the column, if column is provided
 * @property onSort - (optional) Function called when sort direction changes
 * @property pinned - (optional) Whether the column is currently pinned, if column is provided
 * @property onPin - (optional) Function called when column pin state changes
 * @property includeHide - (optional) Whether to include the hide column option, if column is provided
 * @property onHide - (optional) Function called when column is hidden
 * @property applyColumnFilters - (optional) Function that applies the selected filters for the column
 * @property clearColumnFilters - (optional) Function that removes all filters from the column
 */
interface ActionsButtonProps {
  sortOnly?: boolean;
  label: string;
  column?: ColData;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  sorted?: SortType;
  onSort?: (sort: SortType) => void;
  pinned?: boolean | null;
  onPin?: () => void;
  includeHide?: boolean;
  onHide?: () => void;
  applyColumnFilters?: (column: ColData) => void;
  clearColumnFilters?: (column: ColData) => void;
}

/**
 * Versatile dropdown button component that provides actions for table columns or rows.
 * It can display sorting options, column pinning, visibility controls, and filtering
 * capabilities. The component adapts its display based on the provided props, showing
 * only relevant actions for the current context.
 */
const ActionsButton = ({
  sortOnly = false,
  label,
  column,
  open,
  setOpen,
  sorted,
  onSort,
  pinned = null,
  onPin,
  onHide,
  applyColumnFilters,
  clearColumnFilters,
}: ActionsButtonProps) => {
  const [localOpen, setLocalOpen] = useState(false);
  const id = useId();

  // Check if column has filter options
  const includeFilters = column?.headerActions && column.headerActions.options.length > 0;

  // Determine if we should render just a simple sort button (no dropdown)
  // This happens when sortOnly is explicitly set, or when the column is sortable
  // but has no other actions configured (no filters, pin, hide, or generic actions)
  const renderSortOnly =
    sortOnly ||
    (!(column?.headerActions || column?.genericHeaderActions || onHide || onPin || includeFilters) && column?.sortable);

  /**
   * Closes the dropdown menu.
   * Uses the parent component's close function if available, otherwise manages closing on its own.
   */
  const closeDropdown = () => {
    column ? setOpen && setOpen(false) : setLocalOpen(false);
  };

  return (
    <>
      {column && renderSortOnly ? (
        <Button
          iconButton
          buttonSize="small"
          colorScheme="tertiary"
          aria-label={`Sort by ${label} ${sorted === SortType.ASC ? 'descending' : 'ascending'}`}
          onClick={() => {
            onSort && onSort(sorted === SortType.ASC ? SortType.DESC : SortType.ASC);
          }}
        >
          <SortIcon sorted={sorted} />
        </Button>
      ) : !column?.compact ? (
        // <!-- Add padding to unsorted column so width doesn't change when sort icon appears -->
        <Utility
          vFlex
          vJustifyContent="between"
          vAlignItems="center"
          vFlexGrow
          vPaddingLeft={column && sorted === SortType.NONE ? 16 : 0}
        >
          {sorted === SortType.ASC || sorted === SortType.DESC ? <SortIcon sorted={sorted} /> : null}
          {(setOpen || !column) && (
            <TableDropdownButton
              id={id}
              open={column ? !!open : !!localOpen}
              setOpen={() => {
                closeDropdown();
                column ? setOpen && setOpen(!open) : setLocalOpen(!localOpen);
              }}
              icon={column ? <VisaOptionHorizontalTiny /> : <VisaOptionVerticalTiny />}
              buttonAriaLabel={label ? `more actions for ${label}` : 'more actions'}
            >
              {!column ? (
                <Listbox>
                  {
                    // generic actions for a row action button
                    [1, 2, 3, 4].map(item => (
                      <>
                        <DropdownMenuButton onClick={closeDropdown} key={`${item}-${id}`}>
                          Action {item}
                        </DropdownMenuButton>
                        {item === 2 ? <Divider dividerType="decorative" key={`divider-${item}-${id}`} /> : null}
                      </>
                    ))
                  }
                </Listbox>
              ) : (
                // specific actions for a column header
                <Utility vFlex vFlexCol vPadding={4} vFlexGrow>
                  {/* first set of actions  */}
                  <Listbox>
                    {column?.sortable ? (
                      <>
                        <DropdownMenuButton
                          disabled={sorted === SortType.ASC}
                          onClick={() => {
                            closeDropdown();
                            onSort && onSort(SortType.ASC);
                          }}
                        >
                          <VisaSortAscendingTiny /> Sort ascending
                        </DropdownMenuButton>
                        <DropdownMenuButton
                          disabled={sorted === SortType.DESC}
                          onClick={() => {
                            closeDropdown();
                            onSort && onSort(SortType.DESC);
                          }}
                        >
                          <VisaSortDescendingTiny /> Sort descending
                        </DropdownMenuButton>
                      </>
                    ) : (
                      <>
                        <DropdownMenuButton onClick={closeDropdown}>Action 1</DropdownMenuButton>
                        <DropdownMenuButton onClick={closeDropdown}>Action 2</DropdownMenuButton>
                      </>
                    )}
                  </Listbox>
                  <Divider dividerType="decorative" />
                  {/* second set of actions  */}
                  <Listbox>
                    {onPin && pinned !== null ? (
                      <DropdownMenuButton
                        onClick={() => {
                          closeDropdown();
                          onPin && onPin();
                        }}
                      >
                        {pinned ? (
                          <>
                            <VisaPinOutlineTiny /> Unpin column
                          </>
                        ) : (
                          <>
                            <VisaPinFillTiny /> Pin column
                          </>
                        )}
                      </DropdownMenuButton>
                    ) : (
                      <DropdownMenuButton onClick={closeDropdown}>Action 3</DropdownMenuButton>
                    )}
                    {/* Don't allow compact or identifier columns to be hidden */}
                    {!column.compact && !column.identifier ? (
                      onHide ? (
                        <DropdownMenuButton
                          onClick={() => {
                            closeDropdown();
                            onHide && onHide();
                          }}
                        >
                          <VisaPasswordHideTiny />
                          {`Hide column`}
                        </DropdownMenuButton>
                      ) : (
                        <DropdownMenuButton onClick={closeDropdown}>Action 4</DropdownMenuButton>
                      )
                    ) : undefined}
                  </Listbox>
                  {includeFilters && column && applyColumnFilters && clearColumnFilters ? (
                    <>
                      <Divider dividerType="decorative" />
                      <FilterCheckboxGroups
                        column={column}
                        legend={column.name}
                        closeDropdown={closeDropdown}
                        applyColumnFilters={applyColumnFilters}
                        clearColumnFilters={clearColumnFilters}
                      />
                    </>
                  ) : null}
                </Utility>
              )}
            </TableDropdownButton>
          )}
        </Utility>
      ) : null}
    </>
  );
};

export default ActionsButton;
