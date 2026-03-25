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

import { VisaFlagTiny } from '@visa/nova-icons-react';
import Avatar from '@visa/nova-react/avatar';
import { Button, Typography, Utility } from '@visa/nova-react';
import ChatActions from './chat-actions';
import ChatCodeBlock from './chat-code-block';

/**
 * Props for the ResponseChatBubble component
 *
 * @property id - (optional) Base ID for element identification
 * @property hideAvatar - (optional) Completely hide avatar
 * @property smallAvatar - (optional) Use smaller avatar variant
 * @property response - Message object containing timestamp, message text, optional code, and sender role
 * @property hideTimestamp - (optional) Hide role and timestamp above bubble
 */
type Props = {
  id?: string;
  hideAvatar?: boolean;
  smallAvatar?: boolean;
  response: {
    timeStamp: string;
    message: string;
    code?: string;
    role: string;
  };
  hideTimestamp?: boolean;
};
const BASE_URL = import.meta.env.BASE_URL;

/**
 * Message bubble for AI or assistant responses with left-aligned layout, AI avatar icon, and optional code block display.
 * Includes timestamp header, flag button, and actions dropdown for user feedback and interaction.
 * Supports options to resize or hide/show the avatar, and hide/show timestamp.
 */
const ResponseChatBubble = (({ response, smallAvatar, hideAvatar, hideTimestamp, id = 'response-chat-bubble' }: Props) => {
  return (
    <Utility style={{ maxInlineSize: 'calc(100cqi - 208px)' }}>
      <Utility vFlex vAlignItems="start" vAlignSelf="stretch" vGap={8} vPaddingBottom={hideTimestamp ? 20 : 4}>

        {/* AI avatar - only visible when timestamp shown */}
        {!hideAvatar && <div style={{ paddingBlockStart: "18px", paddingInlineStart: hideTimestamp ? "var(--size-responsive-32)": "0" }}>
          {!hideTimestamp &&
            <Avatar small={smallAvatar} aria-label="Virtual assistant">
              <img src={`${BASE_URL}/chat-ai-avatar.svg`} alt="chat icon" />
            </Avatar>
          }
        </div>}
        {/* Message content container */}

        <Utility
          vFlex
          vFlexCol
          vAlignItems="start"
          vGap={4}
          style={{ paddingInlineStart: hideAvatar ? "40px" : "0" }}
        >
          {/* Role and timestamp header */}
          {!hideTimestamp && <Utility vFlex vGap={8}>
            <Typography variant="label-small"> {response.role}</Typography>
            <Typography variant="label-small"> {response.timeStamp}</Typography>
          </Utility>}
          <Utility style={{ maxInlineSize: 'calc(100cqi - 208px)' }}>
            <Utility vFlex vFlexCol vGap={6} vPaddingVertical={12} vPaddingHorizontal={14}
              id={id}
              tabIndex={0}
              aria-label={`${response.message} ${response.code} message from ${response.role} at ${response.timeStamp}. Press tab to navigate to more options.`}
              style={{
                borderRadius: "10px",
                backgroundColor: "var(--palette-default-surface-highlight)",
                minInlineSize: "fit-content"

              }}
            >
              <Typography variant="body-2" style={{
                wordWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word"
              }}>
                {response.message}
              </Typography>
              {/* Optional code block for displaying code snippets */}
              {response.code && <ChatCodeBlock language="html" code={response.code} />}
              {/* Action buttons at bottom-right */}
              <Utility vFlex vJustifyContent="end" vGap={4}>
                {/* Add onClick handler to enable flag action */}
                <Button aria-label="action" id={`${id}-flag-button`} buttonSize="small" colorScheme="tertiary" iconButton subtle>
                  <VisaFlagTiny />
                </Button>
                <ChatActions id={`${id}-actions`} />
              </Utility>
            </Utility>
          </Utility>
        </Utility>
      </Utility>
    </Utility >
  );
});

export default ResponseChatBubble;
