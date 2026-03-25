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
import { VisaFilterAltTiny } from '@visa/nova-icons-react';
import { Button, Surface, Utility, UtilityFragment } from '@visa/nova-react';

/**
 * Minimal, unobtrusive action bar with no background.
 */
const SubtleActionBarDynamicTable = () => {
  return (
    <UtilityFragment
      vPaddingHorizontal={16}
      vPaddingVertical={8}
      style={
        {
          // Use transparent background and no border for subtle action bar
          '--v-surface-background': 'var(--palette-default-transparent)',
          '--v-surface-border-size': '0px',
        } as CSSProperties
      }
    >
      <Surface>
        <Utility vFlex vFlexWrap vGap="10" vJustifyContent="end" vAlignItems="center">
          <Button>Primary action</Button>
          <Button iconButton buttonSize="small" colorScheme="tertiary" aria-label="filter table - subtle action bar">
            <VisaFilterAltTiny />
          </Button>
        </Utility>
      </Surface>
    </UtilityFragment>
  );
};

export default SubtleActionBarDynamicTable;
