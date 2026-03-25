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

import { Button, Dialog, DialogContent, Typography, useFocusTrap, Utility } from '@visa/nova-react';
import { default as ChatInput } from './shared/chat-input';
import { VisaCloseLow, VisaMinimizeLow } from '@visa/nova-icons-react';
import ChatSuggestions from './shared/chat-suggestions';
import ResponseChatBubble from './shared/response-chat-bubble';
import UserChatBubble from './shared/user-chat-bubble';

// Base ID for aria attributes - customize to ensure uniqueness
const id = 'modal-chatbot';
const BASE_URL = import.meta.env.BASE_URL;

/**
 * Modal dialog chat interface.
 * Opens via button trigger and includes focus trap for keyboard accessibility and scrollable message history.
 */
const DefaultDialogChat = () => {
  // useFocusTrap ensures keyboard navigation stays within dialog when open
  const { onKeyNavigation, ref } = useFocusTrap();

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

  // Close dialog and return focus to trigger button
  const handleClose = () => {
    ref.current?.close();
  };
  return (
    <div>
      {/* Trigger button to open chat dialog */}

      <Button aria-label="open chat" iconButton onClick={() => ref.current?.showModal()}>
        <img className="v-icon" role="presentation" src={`${BASE_URL}/chat-ai.svg`} />
      </Button>

      {/* Modal dialog container with focus trap */}
      <Dialog
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          inlineSize: "500px",
          blockSize: "min(500px, 90vh)",
          margin: "0",
          padding: "0",
          gap: "10px",
          overflowX: "auto",
          flexDirection: "column"
        }}
        aria-describedby={`${id}-description`}
        aria-labelledby={`${id}-title`}
        id={id}
        ref={ref}
        onKeyDown={(e) => onKeyNavigation(e, ref.current?.open)}
      >
        {/* Dialog header with minimize and close actions */}
        <Utility
          vFlex
          vJustifyContent="between"
          vAlignItems="center"
          style={{
            blockSize: "62px",
            borderRadius: '10px',
            inlineSize: "100%",
            minInlineSize: "300px",
            paddingBlock: "8px",
            paddingInline: "16px",
            flexShrink: 0,
            background: `var(--palette-default-surface-1, #FFF)`,
            boxShadow: `0px 1px 3px 0px rgba(0, 0, 0, 0.05)`,
          }}
        >
          <Button aria-label="minimize dialog" colorScheme="tertiary" iconButton buttonSize="large" onClick={handleClose}>
            <VisaMinimizeLow />
          </Button>
          <Typography variant="headline-3" style={{ color: 'var(--palette-accent-app-name)' }}>Chat name</Typography>
          <Button
            aria-label="close dialog"
            colorScheme="tertiary"
            iconButton
            buttonSize="large"
            onClick={handleClose}
          >
            <VisaCloseLow />
          </Button>
        </Utility>
        {/* Scrollable chat history container */}

        <Utility
          vFlex
          vFlexCol
          style={{
            flex: "1",
            blockSize: "500px",
            minInlineSize: "300px",
            overflow: "auto",
            padding: "var(--size-scalable-16)"
          }
          }
        >
          <DialogContent>
            {responses.map((response, index) => {
              // Show timestamp only on first message or when role changes
              const prev = responses[index - 1];
              const hideTimestamp = index !== 0 && response.role === prev?.role;

              return (
                response.role === "User 1" ? (
                  <UserChatBubble key={`${id}-user-${index}`} id={`${id}-user-${index}`} response={response} hideAvatar={true} hideTimestamp={hideTimestamp} />
                ) : (
                  <div key={`${id}-response-${index}`} style={{ marginInlineEnd: 48 }}>
                    <ResponseChatBubble id={`${id}-response-${index}`} smallAvatar={true} response={response} hideTimestamp={hideTimestamp} />
                  </div>))
            })}
          </DialogContent>
        </Utility>
        {/* Input section at bottom - shows suggestions when no messages */}
        <Utility vFlex vFlexCol vGap={8} vPadding={16} style={{
          overflow: 'auto',
          flexShrink: 0,
          minInlineSize: "300px"
        }}>
          {responses.length === 0 && <ChatSuggestions />}
          <ChatInput id={`${id}-input`} showCharacterCount={false} style={{
            borderRadius: "10px",
          }} />
        </Utility>
      </Dialog>
    </div >
  );
};

export default DefaultDialogChat;
