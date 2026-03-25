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
import { useState, type CSSProperties } from 'react';
import {
  VisaChevronDownTiny,
  VisaChevronUpTiny,
  VisaFilterAltTiny,
  VisaMapLow,
  VisaViewGridLow,
} from '@visa/nova-icons-react';
import {
  Button,
  DropdownButton,
  DropdownMenu,
  Listbox,
  Surface,
  Toggle,
  ToggleContainer,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  FloatingFocusManager,
} from '@floating-ui/react';
import DropdownMenuButton from './shared/dropdown-menu-button';

const options = [
  { label: 'Label 3', id: 'toggle-action-bar-label-3', icon: <VisaViewGridLow />, defaultSelected: true },
  { label: 'Label 1', id: 'toggle-action-bar-label-1', icon: <VisaMapLow /> },
];

/**
 * Action bar with toggle buttons, dropdown action menu, and filter button.
 */
const ToggleActionBarDynamicTable = () => {
  // State to track which toggle button is currently pressed
  // Initialized as an array of booleans based on defaultSelected property
  const [togglePressedState, setTogglePressedState] = useState(options.map(o => !!o.defaultSelected));

  /**
   * Handles single-select toggle press, ensuring only one toggle is active.
   *
   * @param pressedIndex - Index of pressed toggle button
   */
  const handleSingleSelectTogglePress = (pressedIndex: number) => {
    setTogglePressedState(options.map((_, buttonIndex) => pressedIndex === buttonIndex));
  };

  // State to track whether the dropdown menu is open or closed
  const [open, setOpen] = useState(false);

  // useFloating hook manages positioning of the dropdown menu relative to the trigger button
  // Returns context for other hooks, computed styles for positioning, and refs for elements
  const {
    context: context,
    floatingStyles: floatingStyles,
    refs: ref,
  } = useFloating({
    middleware: [offset(2), flip(), shift()], // Position 2px below, flip if no space, shift to stay in viewport
    open: open,
    placement: 'bottom-end', // Align dropdown to bottom-right of trigger button
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate, // Continuously update position while menu is open
  });
  // useClick hook enables opening/closing dropdown on click
  const clickRef = useClick(context);
  // useDismiss hook enables closing dropdown when clicking outside or pressing Escape
  const dismissMenu = useDismiss(context);
  // useInteractions hook combines multiple interaction behaviors and returns prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([clickRef, dismissMenu]);
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
          <UtilityFragment>
            <DropdownButton
              aria-expanded={open}
              aria-controls={open ? 'toggle-action-bar-label-dropdown-menu' : undefined}
              ref={ref.setReference}
              {...getReferenceProps()}
            >
              Action {open ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />}
            </DropdownButton>
          </UtilityFragment>
          {open && (
            <FloatingFocusManager context={context} modal={false} restoreFocus={true} initialFocus={-1}>
              <DropdownMenu
                id={'toggle-action-bar-label-dropdown-menu'}
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
                <Listbox>
                  <DropdownMenuButton onClick={() => setOpen(false)}>Action 1</DropdownMenuButton>
                  <DropdownMenuButton onClick={() => setOpen(false)}>Action 2</DropdownMenuButton>
                  <DropdownMenuButton onClick={() => setOpen(false)}>Action 3</DropdownMenuButton>
                </Listbox>
              </DropdownMenu>
            </FloatingFocusManager>
          )}
          <Utility vFlex vGap="8" vAlignItems="center">
            <ToggleContainer>
              {options.map((option, optionIndex) => (
                <UtilityFragment key={option.id} vGap={6}>
                  <Toggle
                    tag="button"
                    aria-label={option.label}
                    aria-pressed={togglePressedState[optionIndex]}
                    onClick={() => handleSingleSelectTogglePress(optionIndex)}
                  >
                    {option.icon}
                  </Toggle>
                </UtilityFragment>
              ))}
            </ToggleContainer>
            <Button iconButton buttonSize="small" colorScheme="tertiary" aria-label="filter table - toggle action bar">
              <VisaFilterAltTiny />
            </Button>
          </Utility>
        </Utility>
      </Surface>
    </UtilityFragment>
  );
};

export default ToggleActionBarDynamicTable;
