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
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { vi } from 'vitest';

import { BrowserRouter } from 'react-router-dom';
import metaData from './meta.json';

import DefaultDialogChat from './default-dialog-chat';
import DefaultFullPageChat from './default-full-page-chat';
import DefaultPanelChat from './default-panel-chat';
import FullPageChatCard from './full-page-chat-card';
import FullPageNavigation from './full-page-navigation';

// Mock Date to return consistent timestamps for chat tests
const MOCK_DATE = new Date('2025-01-15T10:30:00.000Z');
vi.setSystemTime(MOCK_DATE);

// Mock toLocaleTimeString to return consistent time regardless of timezone
Date.prototype.toLocaleTimeString = function () {
  // Return the UTC time formatted consistently for tests
  return '04:30 AM';
};

const examples = [
  { Component: DefaultDialogChat, title: metaData['default-dialog-chat'].title },
  { Component: DefaultFullPageChat, title: metaData['default-full-page-chat'].title },
  { Component: DefaultPanelChat, title: metaData['default-panel-chat'].title },
  { Component: FullPageChatCard, title: metaData['full-page-chat-card'].title },
  { Component: FullPageNavigation, title: metaData['full-page-navigation'].title },
];

describe('Chat examples', () => {
  examples.forEach(({ Component, title }) => {
    it(`${title} should render correctly`, async () => {
      const { container } = render(
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(container).toMatchSnapshot();
    });
  });
});
