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
import {
  VisaDeleteTiny,
  VisaEditTiny,
  VisaFileDownloadTiny,
  VisaIdeaTiny,
  VisaOptionHorizontalTiny,
  VisaSearchTiny,
} from '@visa/nova-icons-react';
import {
  Button,
  DropdownButton,
  DropdownMenu,
  Listbox,
  Panel,
  PanelBody,
  PanelContent,
  PanelToggle,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { useState } from 'react';
import { default as ChatInput } from './shared/chat-input';
import ResponseChatBubble from './shared/response-chat-bubble';
import UserChatBubble from './shared/user-chat-bubble';

// Base ID for aria attributes - customize to ensure uniqueness
const id = 'panel-chat';

/**
 * Responsive panel chat interface that opens from the right side with toggleable visibility.
 */
const DefaultPanelChat = () => {
  const BASE_URL = import.meta.env.BASE_URL;

  // Controls panel open/close state
  const [open, setOpen] = useState(false);

  // Floating UI for header actions dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { context, floatingStyles, refs } = useFloating({
    open: dropdownOpen,
    onOpenChange: setDropdownOpen,
    placement: 'bottom-end',
  });

  const onFloatingClick = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([onFloatingClick]);

  // Mock conversation data - replace with actual chat state management
  const responses = [
    {
      timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: 'This is a sent message.',
      role: 'User 1',
    },
    {
      timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message:
        'This is a sent message with more text. It fills the container to a maximum width, then wraps to another line.',
      role: 'User 1',
    },
    {
      timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: 'This is a received message.',
      role: 'User 2',
    },
    {
      timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message:
        'This is a received message with more text. It fills the container to a maximum width, then wraps to another line.',
      role: 'User 2',
    },
  ];

  return (
    <div className="chat-example" style={{ background: "var(--palette-default-surface-3)", overflow: "auto" }}>
      <Utility vFlex style={{ blockSize: "100vh" }}>
        {/* Toggle button positioned at top right */}
        <Utility vMarginLeft="auto">
          <PanelToggle
            aria-expanded={open}
            aria-label={open ? 'Close panel' : 'Open panel'}
            buttonSize="large"
            iconButton
            iconTwoColor
            onClick={() => setOpen(open ? false : true)}
          >
            <img role="presentation"
              src={`${BASE_URL}/chat-ai.svg`} />
          </PanelToggle >
        </Utility >

        {/* Panel slides in from right when open */}
        {
          open && (
            <Panel expandable style={{ inlineSize: "400px", minInlineSize: "300px" }}>
              <PanelContent style={{ display: "flex", flexDirection: "column", blockSize: "100%", overflow: "hidden" }}>
                {/* Panel header with chat name and actions menu */}
                <Utility
                  vFlex
                  vJustifyContent="between"
                  vAlignItems="center"
                  style={{
                    blockSize: '62px',
                    inlineSize: '100%',
                    paddingBlock: '8px',
                    paddingInline: '16px',
                    background: `var(--palette-default-surface-1, #FFF)`,
                    boxShadow: `0px 1px 3px 0px rgba(0, 0, 0, 0.05)`,
                    flexShrink: 0,
                  }}
                >
                  {/* Empty spacer to balance the dropdown button */}
                  <div style={{ inlineSize: 46 }} />
                  <span>Chat name</span>
                  <DropdownButton
                    buttonSize="large"
                    aria-controls={`${id}-more-options`}
                    aria-expanded={dropdownOpen}
                    aria-label="see more options"
                    iconButton
                    colorScheme="tertiary"
                    id={`${id}-more-options-button`}
                    ref={refs.setReference}
                    {...getReferenceProps({
                      onBlur: () => setDropdownOpen(false),
                    })}
                  >
                    <VisaOptionHorizontalTiny />
                  </DropdownButton>
                  {dropdownOpen && (
                    <DropdownMenu
                      id={`${id}-more-options`}
                      aria-hidden={!dropdownOpen}
                      ref={refs.setFloating}
                      style={{ inlineSize: '180px', zIndex: 9999, ...floatingStyles }}
                      {...getFloatingProps()}
                    >
                      <UtilityFragment vHide={!dropdownOpen}>
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
                                <VisaEditTiny /> Rename
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
                                <VisaSearchTiny /> Search in chat
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
                                <VisaFileDownloadTiny /> Download
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
                                <VisaIdeaTiny /> Make a suggestion
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
                              <Button className="v-listbox-item" colorScheme="tertiary" destructive>
                                <VisaDeleteTiny /> Delete chat
                              </Button>
                            </UtilityFragment>
                          </li>
                        </Listbox>
                      </UtilityFragment>
                    </DropdownMenu>
                  )}
                </Utility>

                {/* Scrollable chat history */}
                <PanelBody
                  style={{
                    paddingTop: '10px',
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: 300,
                  }}
                >
                  <Utility
                    vFlex
                    vFlexCol
                    style={{
                      flex: '1',
                      overflow: 'auto',
                    }}
                  >
                    {responses.map((response, index) => {
                      // Show timestamp only on first message or when role changes
                      const prev = responses[index - 1];
                      const hideTimestamp = index !== 0 && response.role === prev?.role;

                      return response.role === 'User 1' ? (
                        <UserChatBubble
                          key={`${id}-user-${index}`}
                          id={`${id}-user-${index}`}
                          response={response}
                          hideAvatar={true}
                          hideTimestamp={hideTimestamp}
                        />
                      ) : (
                        <div style={{ marginInlineEnd: 48 }}>
                          <ResponseChatBubble
                            key={`${id}-response-${index}`}
                            id={`${id}-response-${index}`}
                            response={response}
                            smallAvatar={true}
                            hideTimestamp={hideTimestamp}
                          />
                        </div>
                      );
                    })}
                  </Utility>
                </PanelBody>
                {/* Chat input at bottom of panel */}
                <Utility
                  vFlex
                  vFlexCol
                  vGap={8}
                  vPadding={16}
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <ChatInput id={`${id}-input`} showCharacterCount={false} />
                </Utility>
              </PanelContent>
            </Panel>
          )}
      </Utility>
    </div>
  );
};

export default DefaultPanelChat;
