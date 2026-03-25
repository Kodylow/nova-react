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
import React, { type ReactNode } from 'react';
import { Button, UtilityFragment } from '@visa/nova-react';

/**
 * Props for DropdownMenuButton.
 *
 * @property children - Content to display within the button, typically text or icons
 * @property disabled - (optional) Whether the button is disabled and cannot be interacted with
 * @property onClick - (optional) Function called when the button is clicked
 */
interface DropdownMenuButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * Consistently styled button for use within dropdown menus throughout the table examples.
 * It ensures proper spacing, styling, and interaction states for menu items in column
 * headers, action bars, and other dropdown contexts.
 */
const DropdownMenuButton: React.FC<DropdownMenuButtonProps> = ({ children, disabled, onClick }) => {
  return (
    <li>
      <UtilityFragment vFlex vFlexRow vJustifyContent="start" vGap={6} vPaddingHorizontal={8} vPaddingVertical={11}>
        <Button
          className="v-listbox-item"
          colorScheme="tertiary"
          subtle
          onClick={onClick ? onClick : undefined}
          disabled={disabled ? disabled : undefined}
        >
          {children}
        </Button>
      </UtilityFragment>
    </li>
  );
};

export default DropdownMenuButton;
