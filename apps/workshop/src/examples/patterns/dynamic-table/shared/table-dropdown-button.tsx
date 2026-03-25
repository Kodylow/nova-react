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
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { DropdownButton, DropdownMenu, UtilityFragment } from '@visa/nova-react';

/**
 * Props for TableDropdownButton.
 *
 * @property id - Unique identifier for the dropdown button and menu elements
 * @property open - Whether the dropdown menu is currently open
 * @property setOpen - Function to open or close the dropdown
 * @property icon - Icon to display within the dropdown button
 * @property buttonAriaLabel - Accessible label for the button
 * @property children - (optional) Dropdown menu content to display when open
 */
interface TableDropdownButtonProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  icon: React.ReactNode;
  buttonAriaLabel: string;
  children?: React.ReactNode;
}

/**
 * Dropdown button that uses Floating UI for positioning and accessibility. It makes sure menus
 * open in the right place and manages keyboard focus for accessibility. Used throughout the
 * table examples for action menus, filters, and settings.
 */
const TableDropdownButton = ({ id, open, setOpen, icon, buttonAriaLabel, children }: TableDropdownButtonProps) => {
  // useFloating determines where the dropdown menu appears on screen
  // It calculates the menu's position and provides references to connect the button and menu
  const {
    context: context,
    floatingStyles: floatingStyles,
    refs: ref,
  } = useFloating({
    middleware: [offset(2), flip(), shift()], // Place menu 2px below button, flip to other side if no space, adjust position to stay visible
    open: open,
    placement: 'bottom-end', // Align dropdown to bottom-right of trigger button
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate, // Keep menu position up-to-date while open
  });
  // useClick allows opening and closing the menu when clicked
  const clickRef = useClick(context);
  // useDismiss allows closing the menu when clicking outside or pressing Escape
  const dismissMenu = useDismiss(context);
  // useInteractions combines the click and dismiss behaviors and provides properties to connect everything
  const { getReferenceProps, getFloatingProps } = useInteractions([clickRef, dismissMenu]);

  return (
    <>
      <UtilityFragment vMarginLeft={'auto'}>
        <DropdownButton
          aria-expanded={open}
          aria-controls={open ? `${id}-label-dropdown-menu` : undefined}
          aria-label={buttonAriaLabel}
          buttonSize="small"
          colorScheme="tertiary"
          ref={ref.setReference}
          iconButton
          {...getReferenceProps()}
        >
          {icon}
        </DropdownButton>
      </UtilityFragment>
      {open && (
        <FloatingFocusManager context={context} modal={false} restoreFocus={true} initialFocus={-1}>
          <DropdownMenu
            id={`${id}-label-dropdown-menu`}
            aria-hidden={!open}
            style={
              {
                inlineSize: '180px',
                '--v-surface-background': 'var(--palette-default-surface-1)', // prevent inheriting from action bar's surface 2 background
                position: 'absolute',
                ...floatingStyles,
                zIndex: 3,
              } as CSSProperties
            }
            ref={ref.setFloating}
            {...getFloatingProps()}
          >
            {children}
          </DropdownMenu>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default TableDropdownButton;
