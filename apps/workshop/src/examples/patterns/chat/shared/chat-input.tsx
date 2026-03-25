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
import { VisaAttachmentTiny, VisaErrorTiny, VisaMicrophoneTiny, VisaSendTiny } from '@visa/nova-icons-react';
import { Button, InputContainer, InputMessage, Label, Textarea, Utility } from '@visa/nova-react';
import { useContext, useState, useEffect, type ChangeEvent } from 'react';
import ChatContext from './chat-context';
import Styles from './chat-code-block-css.module.scss';

// Maximum characters allowed per message
const maxCharacters = 100000;

/**
 * Props for the ChatInput component
 *
 * @property id - (optional) ID for the input element
 * @property style - (optional) Custom CSS styles for the input container
 * @property showCharacterCount - (optional) Toggle character count display
 */
type Props = {
  id?: string;
  style?: React.CSSProperties;
  showCharacterCount?: boolean;
};

/**
 * Multi-line textarea input with character counter, validation, and quick action buttons for chat messages.
 * Auto-expands as user types, validates on submission, and integrates with ChatContext to add messages to the conversation.
 */
const ChatInput = ({ style, id = 'chat-input', showCharacterCount = true }: Props) => {
  /**
   * Generates the helper message displayed below the input field.
   * @param characterCount - Current number of characters typed
   * @param characterCountInvalid - Whether user exceeded character limit
   * @param invalid - Whether user tried to submit empty message
   * @return Error message, character count, or over-limit warning
   */
  const getMessage = ({
    characterCount,
    characterCountInvalid,
    invalid,
  }: {
    characterCount: number;
    characterCountInvalid: boolean;
    invalid: boolean;
  }) => {
    if (invalid) return "Input field can't be empty. Please enter a message to continue.";
    if (showCharacterCount) {
      if (characterCountInvalid)
        return `${(characterCount - maxCharacters).toLocaleString()} character${
          characterCount - maxCharacters !== 1 ? 's' : ''
        } over limit`;
      return `${(maxCharacters - characterCount).toLocaleString()} character${
        maxCharacters - characterCount !== 1 ? 's' : ''
      } remaining`;
    }
  };

  // Access shared chat context - setResponses adds messages, responses holds all messages
  const { setResponses, responses } = useContext(ChatContext);

  // Track error state (true when user submits empty message)
  const [invalid, setInvalid] = useState(false);

  // Track current text in textarea
  const [text, setText] = useState('');

  // Clear error state when conversation is reset (all messages cleared)
  useEffect(() => {
    setInvalid(false);
  }, [responses]);

  const characterCount = text.length;
  const characterCountInvalid = characterCount > maxCharacters;
  const messageIsError = characterCountInvalid || invalid;
  const message = getMessage({ characterCount, characterCountInvalid, invalid });

  /**
   * Clears the input field and error state.
   * @param e - Form reset event
   */
  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvalid(false);
    setText('');
  };

  /**
   * Validates input and adds message to conversation if valid.
   * @param e - Form submit event
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvalid(characterCount === 0);
    if (characterCount === 0) return;

    // Add new message to conversation with timestamp and role
    setResponses(prevResponses => [
      ...prevResponses,
      {
        timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: text,
        role: 'User 1', // Update this to match your user identification
      },
    ]);
    setText('');
  };

  /**
   * Updates text state as user types and clears error state.
   * @param e - Input change event
   */
  const onTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInvalid(false);
    setText(e.target.value);
  };

  return (
    <form onReset={onReset} onSubmit={onSubmit}>
      <Utility vFlex vFlexCol vGap={4}>
        {/* Empty label maintains consistent spacing in design system */}
        <Label />
        <InputContainer
          className="v-flex-row"
          style={{
            ...style,
            position: 'relative',
          }}
        >
          <Textarea
            aria-describedby={`${id}-message`}
            aria-invalid={characterCountInvalid || invalid}
            aria-required="true"
            aria-label="Chat input"
            id={id}
            fixed
            name={'test'}
            onChange={onTextChange}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setInvalid(characterCount === 0);
                if (characterCount === 0) return;
                setResponses(prevResponses => [
                  ...prevResponses,
                  {
                    timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    message: text,
                    role: 'User 1', // Update this to match your user identification
                  },
                ]);
                setText('');
              }
            }}
            value={text}
            placeholder="Start typing..."
            style={{
              marginTop: '0px',
              marginBlockEnd: '40px',
            }}
            className={Styles.chatTextareaResize}
          />
          <div
            style={{
              position: 'absolute',
              right: '8px',
              bottom: '6px',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            {/* Actions for voice recording and file attachment. Add actions relevant to your use case. */}
            <Button aria-label="record" type="button" colorScheme="tertiary" iconButton subtle>
              <VisaMicrophoneTiny />
            </Button>
            <Button aria-label="files" type="button" colorScheme="tertiary" iconButton subtle>
              <VisaAttachmentTiny />
            </Button>
            <Button
              aria-label="send"
              type="submit"
              iconButton
              subtle
              colorScheme="tertiary"
              style={{ blockSize: '32px', inlineSize: '32px', padding: '7px' }}
            >
              <VisaSendTiny />
            </Button>
          </div>
        </InputContainer>
        <InputMessage
          aria-atomic={messageIsError}
          aria-live={messageIsError ? 'assertive' : 'polite'}
          id={`${id}-message`}
          role={messageIsError ? 'alert' : undefined}
        >
          {messageIsError && <VisaErrorTiny />}
          {message}
        </InputMessage>
      </Utility>
    </form>
  );
};

export default ChatInput;
