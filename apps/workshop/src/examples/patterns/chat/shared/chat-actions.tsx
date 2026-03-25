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

import { useClick, useFloating, useInteractions } from '@floating-ui/react';
import { VisaOptionHorizontalTiny } from '@visa/nova-icons-react';
import { useState } from 'react';
import { Button, DropdownButton, DropdownMenu, Listbox, UtilityFragment } from '@visa/nova-react';

/**
 * Props for the ChatActions component
 *
 * @property onClick - (optional) Click handler for button
 * @property id - (optional) ID for dropdown elements
 * @property tabIndex - (optional) tab index for keyboard navigation
 */
type Props = {
  onClick?: () => void;
  id?: string;
  tabIndex?: number;
};

/**
 * Dropdown menu button for message-level actions used in both user and AI chat bubbles.
 * Uses Floating UI for dropdown positioning and supports keyboard navigation.
 */
export const ChatActions = ({ id, onClick, tabIndex }: Props) => {
  const [open, setOpen] = useState(false);

  // Floating UI for dropdown positioning
  const { context, floatingStyles, refs } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-end',
  });

  const onFloatingClick = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([onFloatingClick]);

  return (
    <>
      {/* More options menu button */}
      <DropdownButton
        buttonSize='small'
        style={{
          '--v-button-default-block-size': 'var(--size-scalable-26)',
          '--v-button-default-border-radius': 'var(--size-rounded-small)',
        } as React.CSSProperties}
        onClick={onClick}
        aria-controls={id}
        aria-expanded={open}
        aria-label="see more options"
        iconButton
        colorScheme="tertiary"
        subtle
        id={`${id}-button`}
        ref={refs.setReference}
        {...getReferenceProps({
          onBlur: () => setOpen(false)
        })}
        tabIndex={tabIndex}
      >
        <VisaOptionHorizontalTiny />
      </DropdownButton>
      {/* Dropdown menu with action items - customize as needed */}
      {open && (
        <DropdownMenu
          id={id}
          aria-hidden={!open}
          ref={refs.setFloating}
          style={{ inlineSize: '180px', ...floatingStyles, zIndex: 9999 }}
          {...getFloatingProps()}
        >
          <UtilityFragment vHide={!open}>
            <Listbox>
              <li>
                <UtilityFragment
                  vFlex
                  vFlexRow
                  vAlignItems="start"
                  vGap={6}
                  vPaddingHorizontal={8}
                  vPaddingVertical={11}
                >
                  <Button className="v-listbox-item" colorScheme="tertiary" subtle>
                    Label 1
                  </Button>
                </UtilityFragment>
              </li>
              <li>
                <UtilityFragment
                  vFlex
                  vFlexRow
                  vAlignItems="start"
                  vGap={6}
                  vPaddingHorizontal={8}
                  vPaddingVertical={11}
                >
                  <Button className="v-listbox-item" colorScheme="tertiary" subtle>
                    Label 2
                  </Button>
                </UtilityFragment>
              </li>
              <li>
                <UtilityFragment
                  vFlex
                  vFlexRow
                  vAlignItems="start"
                  vGap={6}
                  vPaddingHorizontal={8}
                  vPaddingVertical={11}
                >
                  <Button className="v-listbox-item" colorScheme="tertiary" subtle>
                    Label 2
                  </Button>
                </UtilityFragment>
              </li>
            </Listbox>
          </UtilityFragment>
        </DropdownMenu>
      )}
    </>
  );
};
export default ChatActions;
