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

import { Typography, Utility } from '@visa/nova-react';
import Avatar from '@visa/nova-react/avatar';
import ChatActions from './chat-actions';

/**
 * Props for the UserChatBubble component
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

/**
 * Message bubble for user-sent messages with right-aligned layout and avatar showing user's initials.
 * Includes optional timestamp header and actions menu, mirroring ResponseChatBubble layout but flipped for the user side.
 * Supports options to resize or hide/show the avatar, and hide/show timestamp.
 */
const UserChatBubble = ({ response, smallAvatar, hideAvatar, hideTimestamp, id = 'user-chat-bubble' }: Props) => {
  return (
    <>
      <Utility
        vFlex
        vAlignItems="start"
        vFlexRowReverse
        vAlignSelf="stretch"
        vGap={8}
        vPaddingBottom={hideTimestamp ? 20 : 4}
      >
        {!hideAvatar && (
          <div style={{ paddingBlockStart: '18px' }}>
            <Avatar small={smallAvatar} aria-label="Virtual assistant">
              {response.role.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        )}
        <Utility
          vFlex
          vFlexCol
          vAlignItems="end"
          vGap={4}
          style={{
            flex: '1 0 0',
          }}
        >
          {!hideTimestamp && (
            <Utility vFlex vGap={8}>
              <Typography variant="label-small"> {response.role}</Typography>
              <Typography variant="label-small"> {response.timeStamp}</Typography>
            </Utility>
          )}
          {/* marginLeft prevents bubble from becoming too wide */}
          <Utility vFlex vJustifyContent="center" style={{ marginLeft: 88 }}>
            <Utility
              vFlex
              vFlexCol
              vGap={4}
              id={id}
              tabIndex={0}
              aria-label={`${response.message} ${response.code} message from ${response.role} at ${response.timeStamp}. Press tab to navigate to more options.`}
              style={{
                paddingBlock: '12px',
                paddingInline: '14px',
                borderRadius: '10px',
                backgroundColor: 'var(--palette-default-surface-3)',
              }}
            >
              <Typography variant="body-2">{response.message}</Typography>
              <Utility vFlex vJustifyContent="end" vGap={4}>
                <ChatActions id={`${id}-actions`} />
              </Utility>
            </Utility>
          </Utility>
        </Utility>
      </Utility>
    </>
  );
};

export default UserChatBubble;
