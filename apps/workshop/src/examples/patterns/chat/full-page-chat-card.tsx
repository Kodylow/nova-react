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
  VisaDeleteTiny,
  VisaEditTiny,
  VisaFileDownloadTiny,
  VisaIdeaTiny,
  VisaOptionHorizontalTiny,
  VisaPinOutlineTiny,
  VisaSearchTiny,
} from '@visa/nova-icons-react';
import {
  Button,
  ContentCard,
  ContentCardBody,
  DropdownButton,
  DropdownMenu,
  Listbox,
  Typography,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { default as ChatInput } from './shared/chat-input';
import { default as ChatSuggestions } from './shared/chat-suggestions';
import { useContext, useEffect, useState } from 'react';
import ChatContext from './shared/chat-context';
import UserChatBubble from './shared/user-chat-bubble';
import ResponseChatBubble from './shared/response-chat-bubble';
import { useFloating, useClick, useInteractions } from '@floating-ui/react';

// Base ID for aria attributes - customize to ensure uniqueness
const id = 'full-page-chat-card';

/**
 * Props for the FullPageChatCard component
 *
 * @property smallAvatar - (optional) Use smaller avatar variant for chat bubbles with small screens
 */
type FullPageChatCardProps = {
  smallAvatar?: boolean;
};

/**
 * Main chat content card with welcome screen, scrollable message history, and input field.
 * Uses ChatContext to share conversation state with navigation sidebar and includes mock auto-response logic for demonstration.
 */
const FullPageChatCard = ({ smallAvatar }: FullPageChatCardProps) => {
  // Floating UI for header actions dropdown
  const [open, setOpen] = useState(false);
  const { context, floatingStyles, refs } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-end',
  });

  const onFloatingClick = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([onFloatingClick]);

  // Access shared chat state from context
  const { responses, setResponses } = useContext(ChatContext);

  // Mock auto-response after user message
  // IMPORTANT: This response format assumes code blocks wrapped in three tildes + language (e.g., ~~~js).
  // Adjust to match your syntax highlighter and API response format.
  useEffect(() => {
    if (responses.length > 0) {
      responses[responses.length - 1].role === 'User 2'
        ? ''
        : setResponses([
            ...responses,
            {
              message: `Here is the code for the default horizontal navigation from VPDS Nova CSS:`,
              code: `
 <header class="v-nav v-nav-horizontal v-alternate v-icon-two-color v-justify-content-between">
 <button aria-label="open menu" class="v-button v-button-icon v-button-tertiary v-button-large v-desktop-container-hide" type="button">
 <VisaMenuLow />
 </button>
 </header> `,
              timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              role: 'User 2',
            },
          ]);
    }
  }, [responses]);

  return (
    <ContentCard id={id} style={{ minBlockSize: 'calc(100vh - 64px)', containerType: 'inline-size', minInlineSize: '300px' }} >
      <Utility
        vPaddingHorizontal={20}
        vFlex
        vJustifyContent="between"
        vAlignItems="center"
        style={{
          blockSize: '56px',
          borderBlockEnd: 'var(--v-content-card-border)',
          boxShadow: 'var(--v-content-card-elevation),var(--v-content-card-border-block-end-none)',
        }}
      >
        <span>Chat name</span>
        <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={10}>
          <Button aria-label="pin" colorScheme="tertiary" iconButton subtle>
            <VisaPinOutlineTiny />
          </Button>
          <DropdownButton
            buttonSize="small"
            aria-controls={`${id}-more-options`}
            aria-expanded={open}
            aria-label="see more options"
            iconButton
            colorScheme="tertiary"
            subtle
            id={`${id}-more-options-button`}
            ref={refs.setReference}
            {...getReferenceProps({
              onBlur: () => setOpen(false),
            })}
          >
            <VisaOptionHorizontalTiny />
          </DropdownButton>
          {open && (
            <DropdownMenu
              id={`${id}-more-options`}
              aria-hidden={!open}
              ref={refs.setFloating}
              style={{ inlineSize: '180px', zIndex: 1000, ...floatingStyles }}
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
      </Utility>
      {/* Card body with welcome screen or message history */}
      <Utility
        element={<ContentCardBody />}
        vFlex
        vFlexCol
        vJustifyContent="between"
        style={{
          blockSize: 'calc(100vh - 120px)',
          minBlockSize: 'fit-content',
          padding: 24,
        }}
      >
        {/* Show welcome message when no conversation yet */}
        {responses.length === 0 ? (
          <Utility vFlex vFlexCol>
            <Typography variant="headline-3">Welcome!</Typography>
            <Typography className="v-pt-4">
              I&apos;m your friendly AI chatbot, here to assist you. I&apos;m powered by artificial intelligence, which
              allows me to learn and adapt to better serve your needs. Our conversations are stored to improve our
              services, but you have the right to access, correct, or delete your personal information at any time.
            </Typography>
          </Utility>
        ) : (
          /* Scrollable message history */
          <Utility
            vFlex
            vFlexCol
            vGap={24}
            style={{
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {responses.map((response, index) => {
              // Show timestamp only on first message or when role changes
              const prev = responses[index - 1];
              const hideTimestamp = index !== 0 && response.role === prev?.role;

              return (
                response.role === "User 1" ? (
                  <UserChatBubble key={`${id}-user-${index}`} id={`${id}-user-${index}`} response={response} hideTimestamp={hideTimestamp} smallAvatar={smallAvatar} />
                ) : (
                  <ResponseChatBubble key={`${id}-response-${index}`} id={`${id}-response-${index}`} response={response} hideTimestamp={hideTimestamp} smallAvatar={smallAvatar} />
                )
              )
            })}
          </Utility>
        )}
        {/* Input section - shows suggestions when empty */}
        <Utility vFlex vFlexCol vGap={8}>
          {responses.length === 0 && <ChatSuggestions />}
          <ChatInput id={`${id}-input`} />
        </Utility>
      </Utility>
    </ContentCard>
  );
};

export default FullPageChatCard;
