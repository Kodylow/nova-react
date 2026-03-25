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
import { createContext, type Dispatch, type SetStateAction } from 'react';

/**
 * Message structure for conversation history
 *
 * @property timeStamp - Timestamp when the message was sent
 * @property message - The text content of the message
 * @property code - (optional) Code block for displaying code snippets. Ensure code format matches your syntax highlighter requirements
 * @property role - Identifies sender (e.g., "User 1", "User 2", "AI Assistant")
 */
type ResponseType = {
  timeStamp: string;
  message: string;
  code?: string;
  role: string;
};

/**
 * Context type for managing chat conversation state
 *
 * @property responses - Array of all messages in conversation
 * @property setResponses - Setter to update conversation
 */
type ChatContextType = {
  responses: ResponseType[];
  setResponses: Dispatch<SetStateAction<ResponseType[]>>;
};

// Default empty context value
const defaultContextValue: ChatContextType = {
  responses: [],
  setResponses: () => {},
};

/**
 * React Context object that stores shared conversation state for the chat application.
 * Context is a React pattern for sharing data between components without passing it through intermediate components.
 * Components access this via React's useContext hook when rendered inside ChatProvider.
 */
const ChatContext = createContext<ChatContextType>(defaultContextValue);

export default ChatContext;
