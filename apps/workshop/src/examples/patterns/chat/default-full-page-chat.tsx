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
import { default as FullPageNavigation } from "./full-page-navigation";
import { default as FullPageChatCard } from "./full-page-chat-card";
import "./full-page-css.scss";
import ChatProvider from "./shared/chat-provider";
import { useEffect, useState } from "react";

// Base ID for aria attributes - customize to ensure uniqueness
const id = 'full-page-chat';

/**
 * Full-page chat application with collapsible sidebar navigation and main chat area.
 * Wraps components in ChatProvider for shared state management between chat history navigation and active conversation.
 */
const DefaultFullPageChat = () => {
  // Tracks viewport size to enable responsive layout adjustments
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Monitor viewport width and update isSmallScreen state
  // Triggers responsive behavior for navigation collapse and avatar sizing
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 500);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <ChatProvider>
      <div id={id} className="layout-example app-container">
        <div className="layout-container">
          {/* Collapsible sidebar with chat history and search */}
          <FullPageNavigation isSmallScreen={isSmallScreen} />
          {/* Main content area with active chat */}
          <main id={`${id}-content`} className="main-content">
            <FullPageChatCard smallAvatar={isSmallScreen} />
          </main>
        </div>
      </div>
    </ChatProvider>
  );
};

export default DefaultFullPageChat;
