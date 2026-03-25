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
import React, { type CSSProperties } from 'react';
import { UtilityFragment, Surface, Utility, Button } from '@visa/nova-react';

/**
 * Props for FilterActionBar.
 *
 * @property children - (optional) Additional action buttons to display on the right side of the action bar
 * @property className - (optional) Custom style name for appearance customization
 */
interface FilterActionBarProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Standard action bar layout for table filtering examples. It displays primary, secondary,
 * and tertiary action buttons on the left, with additional custom buttons (like filter and
 * settings) on the right. This creates a consistent appearance across all dynamic table
 * examples that include action bars.
 */
const FilterActionBar: React.FC<FilterActionBarProps> = ({ children }) => (
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
          <Button colorScheme="secondary">Secondary action</Button>
          <Button colorScheme="tertiary">Tertiary action</Button>
        </Utility>
        <Utility vFlex vGap="8">
          {children}
        </Utility>
      </Utility>
    </Surface>
  </UtilityFragment>
);

export default FilterActionBar;
