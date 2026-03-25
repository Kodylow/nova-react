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
import type { CSSProperties } from 'react';
import { VisaClearAltTiny, VisaFilterAltTiny, VisaSettingsTiny } from '@visa/nova-icons-react';
import { Button, Chip, Surface, Utility, UtilityFragment } from '@visa/nova-react';

/**
 * Props for SelectionBasedActionBarDynamicTable.
 *
 * @property amountSelected - (optional) Number of rows currently selected
 * @property clearSelection - (optional) Function to clear all row selections
 */
interface SelectionBasedProps {
  amountSelected?: number;
  clearSelection?: () => void;
}

/**
 * Action bar that responds to row selections in a table.
 */
const SelectionBasedActionBarDynamicTable = ({ amountSelected = 0, clearSelection }: SelectionBasedProps) => {
  return (
    <UtilityFragment
      vPaddingHorizontal={16}
      vPaddingVertical={8}
      style={
        {
          '--v-surface-background': 'var(--palette-default-surface-2)',
          '--v-surface-border-radius': 'var(--size-rounded-none)',
        } as CSSProperties
      }
    >
      <Surface>
        <Utility vFlex vFlexWrap vJustifyContent="between" vAlignItems="center" vGap={10}>
          <Utility vFlex vGap="8">
            <Button>Primary action</Button>
            <Button colorScheme="secondary" disabled={amountSelected === 0}>
              Secondary action
            </Button>
            <Button colorScheme="tertiary" disabled={amountSelected === 0}>
              Tertiary action
            </Button>
          </Utility>
          <Utility vFlex vGap="8">
            {amountSelected > 0 && (
              <Chip chipSize="compact">
                <span>{amountSelected} selected</span>
                <Button
                  onClick={clearSelection}
                  aria-label="clear selected rows"
                  colorScheme="tertiary"
                  iconButton
                  subtle
                >
                  <VisaClearAltTiny />
                </Button>
              </Chip>
            )}
            <Button
              iconButton
              buttonSize="small"
              colorScheme="tertiary"
              aria-label="filter table - selection-based action bar"
            >
              <VisaFilterAltTiny />
            </Button>
            <Button
              iconButton
              buttonSize="small"
              colorScheme="tertiary"
              aria-label="table settings - selection-based action bar"
            >
              <VisaSettingsTiny />
            </Button>
          </Utility>
        </Utility>
      </Surface>
    </UtilityFragment>
  );
};

export default SelectionBasedActionBarDynamicTable;
