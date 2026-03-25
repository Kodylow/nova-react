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
import { useState, type ReactNode } from 'react';
import ChatContext from './chat-context';

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
 * React Context provider for sharing chat conversation state across multiple components.
 * Wraps children with ChatContext to provide responses array and setter as a single source of truth for message history.
 *
 * @param children - React components to wrap with chat context
 */
const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<ResponseType[]>([]);

  return <ChatContext.Provider value={{ responses, setResponses }}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
