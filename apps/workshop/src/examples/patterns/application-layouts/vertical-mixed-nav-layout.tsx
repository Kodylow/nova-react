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
  VisaMediaFastForwardTiny,
  VisaMediaRewindTiny,
  VisaNotesTiny,
  VisaSecurityTiny,
  VisaSettingsTiny,
  VisaStatisticsTiny,
  VisaSupportTicketTiny,
} from '@visa/nova-icons-react';
import { Button, Divider, Nav, Tab, Tabs, Utility, UtilityFragment } from '@visa/nova-react';
import { useState } from 'react';

// Base ID for aria attributes and element IDs - customize for unique identification
const id = 'vertical-mixed-navigation';

// Secondary (L2) navigation tab items with icons - customize labels, icons, and hrefs
const tabsContent = [
  {
    tabLabel: 'L2 label 1',
    id: `${id}-tab-0`,
    icon: <VisaStatisticsTiny />,
    href: './application-layouts',
  },
  {
    tabLabel: 'L2 label 2',
    id: `${id}-tab-1`,
    icon: <VisaSettingsTiny />,
    href: './application-layouts',
  },
  {
    tabLabel: 'L2 label 3',
    id: `${id}-tab-2`,
    icon: <VisaSecurityTiny />,
    href: './application-layouts',
  },
  {
    tabLabel: 'L2 label 4',
    id: `${id}-tab-3`,
    icon: <VisaNotesTiny />,
    href: './application-layouts',
  },
  {
    tabLabel: 'L2 label 5',
    id: `${id}-tab-4`,
    icon: <VisaSupportTicketTiny />,
    href: './application-layouts',
  },
];

/**
 * Left sidebar navigation component used by MixedApplicationLayout.
 */
export const VerticalMixedNavLayout = () => {
  // Controls whether sidebar is expanded (with labels) or collapsed (icons only)
  const [navExpanded, setNavExpanded] = useState(true);

  return (
    <Nav id={id} orientation="vertical" className="layout-vertical-mixed" aria-label="primary">
      {/* L2 navigation tabs - hidden when collapsed */}
      {navExpanded && (
        <>
          <Utility className="mixed-vertical-tabs" vAlignSelf="stretch">
            <UtilityFragment vGap={8}>
              <Tabs orientation="vertical">
                {tabsContent.map(tabContent => (
                  <Tab key={tabContent.id}>
                    <Button
                      colorScheme="tertiary"
                      element={
                        <a href="./application-layouts">
                          {tabContent.icon}
                          {tabContent.tabLabel}
                        </a>
                      }
                    />
                  </Tab>
                ))}
              </Tabs>
            </UtilityFragment>
          </Utility>
        </>
      )}
      {/* Footer section: collapse toggle only (no account menu in mixed layout) */}
      <Utility vFlex vFlexCol vAlignSelf="stretch" vGap={4} vMarginTop="auto">
        <UtilityFragment vMarginBottom={4}>
          <Divider dividerType="decorative" />
        </UtilityFragment>
        {/* Collapse/expand toggle button */}
        <UtilityFragment vMarginLeft={navExpanded ? 'auto' : 5} vMarginRight={navExpanded ? 8 : 5}>
          <Button
            aria-label="Side bar"
            aria-expanded={!!navExpanded}
            buttonSize="small"
            colorScheme="tertiary"
            iconButton
            onClick={() => setNavExpanded(!navExpanded)}
            subtle
          >
            {navExpanded ? <VisaMediaRewindTiny rtl /> : <VisaMediaFastForwardTiny rtl />}
          </Button>
        </UtilityFragment>
      </Utility>
    </Nav>
  );
};
