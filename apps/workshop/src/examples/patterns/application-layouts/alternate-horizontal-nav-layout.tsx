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
  autoUpdate,
  FloatingFocusManager,
  offset,
  useClick,
  useFloating,
  useInteractions,
  useDismiss,
} from '@floating-ui/react';
import {
  VisaAccountLow,
  VisaChevronDownTiny,
  VisaChevronUpTiny,
  VisaCloseLow,
  VisaCloseTiny,
  VisaMenuLow,
  VisaNotificationsLow,
  VisaSearchLow,
} from '@visa/nova-icons-react';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  DropdownButton,
  DropdownMenu,
  Input,
  InputContainer,
  Link,
  Listbox,
  ListboxItem,
  Nav,
  NavAppName,
  Surface,
  Tab,
  TabSuffix,
  Tabs,
  Typography,
  Utility,
  UtilityFragment,
  VisaLogo,
} from '@visa/nova-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

// Base ID for aria attributes and element IDs - customize for unique identification
const id = 'alternate-horizontal-nav';

// Account dropdown menu items - replace with real user profile actions
const accountSubItems = [
  {
    tabLabel: 'Account item 1',
    id: `${id}-account-sub-item-0`,
    href: './application-layouts',
  },
  {
    tabLabel: 'Account item 2',
    id: `${id}-account-sub-item-1`,
    href: './application-layouts',
  },
];

// Submenu items for navigation tab with dropdown - replace with actual sub-navigation
const label4SubItems = [
  {
    tabLabel: 'L1 label 4 item 1',
    id: `${id}-label-3-sub-item-0`,
    href: './application-layouts',
  },
  {
    tabLabel: 'L1 label 4 item 2',
    id: `${id}-label-3-sub-item-1`,
    href: './application-layouts',
  },
];

/**
 * Top navigation bar with dark theme, used by MixedApplicationLayout.
 * Similar to HorizontalNavLayout but with alternate styling.
 */
export const AlternateHorizontalNavLayout = () => {
  // Refs for managing keyboard focus on search input and button
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  // State for desktop dropdown menus
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [label4Open, setLabel4Open] = useState(false);

  // State for mobile menu and its nested dropdowns
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccountMenuOpen, setMobileAccountMenuOpen] = useState(false);
  const [mobileLabel4MenuOpen, setMobileLabel4MenuOpen] = useState(false);

  // Search UI state
  const [expandSearch, setExpandSearch] = useState(false);
  const searchInitiallyActivated = useRef(false);

  // Moves focus to search input when expanded, back to button when collapsed
  useEffect(() => {
    if (expandSearch && searchInitiallyActivated.current) {
      searchInputRef.current?.focus();
    }
    if (!expandSearch && searchInitiallyActivated.current) {
      searchButtonRef.current?.focus();
    }
  }, [expandSearch]);

  // Setup for account dropdown: handles positioning and interactions
  const {
    context: accountFloatingContext,
    floatingStyles: accountFloatingStyles,
    refs: accountFloatingRefs,
  } = useFloating({
    middleware: [offset(2)],
    open: accountMenuOpen,
    onOpenChange: setAccountMenuOpen,
    placement: 'bottom-end',
    whileElementsMounted: autoUpdate,
  });
  const clickAccountRef = useClick(accountFloatingContext);
  const dismissAccountMenu = useDismiss(accountFloatingContext);
  const { getReferenceProps: getAccountReferenceProps, getFloatingProps: getAccountFloatingProps } = useInteractions([
    clickAccountRef,
    dismissAccountMenu,
  ]);

  // Setup for navigation dropdown (label4): handles positioning and interactions
  const {
    context: label4FloatingContext,
    floatingStyles: label4FloatingStyles,
    refs: label4FloatingRefs,
  } = useFloating({
    middleware: [offset(2)],
    open: label4Open,
    onOpenChange: setLabel4Open,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
  });
  const clickLabel4Ref = useClick(label4FloatingContext);
  const dismissLabel4Menu = useDismiss(label4FloatingContext);
  const { getReferenceProps: getLabel4ReferenceProps, getFloatingProps: getLabel4FloatingProps } = useInteractions([
    clickLabel4Ref,
    dismissLabel4Menu,
  ]);

  // Toggles mobile navigation drawer open and closed
  const onToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <Link skipLink href="#content" alternate>
        Skip to content
      </Link>
      <UtilityFragment vJustifyContent="between">
        {/* Main navigation container with alternate styling */}
        <Nav id={id} orientation="horizontal" tag="header" alternate>
          {/* Default nav: logo, tabs, actions */}
          {!expandSearch ? (
            <>
              {/* Mobile menu toggle button */}
              <UtilityFragment vContainerHide="desktop">
                <DropdownButton
                  aria-controls={`${id}-mobile-menu`}
                  aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                  aria-label="open menu"
                  buttonSize="large"
                  colorScheme="tertiary"
                  iconButton
                  id={`${id}-mobile-menu-button`}
                  onClick={onToggleMobileMenu}
                >
                  {mobileMenuOpen ? (
                    <VisaCloseTiny />
                  ) : (
                    <>
                      <VisaMenuLow />
                    </>
                  )}
                </DropdownButton>
              </UtilityFragment>
              {/* Logo and app name */}
              <UtilityFragment vFlex vGap={16}>
                <Link
                  aria-label="Visa Application Name Home"
                  href="./application-layouts"
                  id={`${id}-home-link`}
                  noUnderline
                  style={{ backgroundColor: 'transparent' }}
                >
                  <VisaLogo />
                  <UtilityFragment vContainerHide="mobile">
                    <NavAppName>
                      <Utility
                        vContainerHide="xs"
                        element={<Typography variant="headline-3">Application name</Typography>}
                      />
                    </NavAppName>
                  </UtilityFragment>
                </Link>
              </UtilityFragment>
              {/* Desktop navigation tabs - hidden on mobile */}
              <UtilityFragment vFlex vJustifyContent="end" vFlexGrow vMarginLeft="auto" vContainerHide="mobile">
                <nav aria-label="global">
                  <UtilityFragment vGap={4}>
                    <Tabs>
                      <Tab>
                        <Button
                          buttonSize="large"
                          colorScheme="tertiary"
                          element={<a href="./application-layouts">L1 label 1</a>}
                        />
                      </Tab>
                      <Tab>
                        <Button
                          buttonSize="large"
                          colorScheme="tertiary"
                          element={<a href="./application-layouts">L1 label 2</a>}
                        />
                      </Tab>
                      <Tab>
                        <Button
                          buttonSize="large"
                          colorScheme="tertiary"
                          element={<a href="./application-layouts">L1 label 3</a>}
                        />
                      </Tab>
                      {/* Tab with dropdown submenu */}
                      <Tab>
                        <DropdownButton
                          aria-expanded={label4Open}
                          aria-controls={label4Open ? `${id}-label-dropdown-menu` : undefined}
                          id={`${id}-label-dropdown-button`}
                          buttonSize="large"
                          colorScheme="tertiary"
                          ref={label4FloatingRefs.setReference}
                          {...getLabel4ReferenceProps()}
                        >
                          L1 label 4<TabSuffix element={label4Open ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
                        </DropdownButton>

                        {label4Open && (
                          <FloatingFocusManager
                            context={label4FloatingContext}
                            modal={false}
                            initialFocus={-1}
                            restoreFocus={true}
                          >
                            <DropdownMenu
                              id={`${id}-label-dropdown-menu`}
                              aria-hidden={!label4Open}
                              style={
                                {
                                  inlineSize: '180px',
                                  position: 'absolute',
                                  ...label4FloatingStyles,
                                  zIndex: 1,
                                } as CSSProperties
                              }
                              ref={label4FloatingRefs.setFloating}
                              {...getLabel4FloatingProps()}
                            >
                              <Listbox>
                                {label4SubItems.map(label4SubItem => (
                                  <li key={label4SubItem.id}>
                                    <ListboxItem<'a'> href={label4SubItem.href} tag="a">
                                      {label4SubItem.tabLabel}
                                    </ListboxItem>
                                  </li>
                                ))}
                              </Listbox>
                            </DropdownMenu>
                          </FloatingFocusManager>
                        )}
                      </Tab>
                      <Tab>
                        <Button
                          buttonSize="large"
                          colorScheme="tertiary"
                          element={<a href="./application-layouts">L1 label 5</a>}
                        />
                      </Tab>
                    </Tabs>
                  </UtilityFragment>
                </nav>
              </UtilityFragment>
              {/* Action buttons: search, notifications, account */}
              <Utility vFlex vGap={8} vMarginLeft={8}>
                <Button
                  aria-label="search site"
                  ref={searchButtonRef}
                  buttonSize="large"
                  colorScheme="tertiary"
                  iconButton
                  onClick={() => {
                    setExpandSearch(true);
                    searchInitiallyActivated.current = true;
                  }}
                >
                  <VisaSearchLow />
                </Button>
                {/* Notifications button with badge */}
                <UtilityFragment vContainerHide="mobile">
                  <Button
                    aria-label="notifications"
                    aria-describedby={`${id}-notifications-badge`}
                    buttonSize="large"
                    colorScheme="tertiary"
                    iconButton
                  >
                    <VisaNotificationsLow />
                    <Badge id={`${id}-notifications-badge`} badgeVariant="number" tag="sup">
                      3
                    </Badge>
                  </Button>
                </UtilityFragment>
                {/* Account dropdown menu */}
                <UtilityFragment vContainerHide="mobile">
                  <Tab tag="div">
                    <DropdownButton
                      aria-expanded={accountMenuOpen}
                      aria-controls={accountMenuOpen ? `${id}-account-menu` : undefined}
                      aria-label="Alex Miller"
                      buttonSize="large"
                      colorScheme="tertiary"
                      element={<Avatar tag="button" />}
                      ref={accountFloatingRefs.setReference}
                      {...getAccountReferenceProps()}
                    >
                      <VisaAccountLow />
                      <TabSuffix element={accountMenuOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
                    </DropdownButton>
                    {accountMenuOpen && (
                      <FloatingFocusManager
                        context={accountFloatingContext}
                        modal={false}
                        initialFocus={-1}
                        restoreFocus={true}
                      >
                        <DropdownMenu
                          id={`${id}-account-menu`}
                          aria-hidden={!accountMenuOpen}
                          style={
                            {
                              inlineSize: '180px',
                              position: 'absolute',
                              ...accountFloatingStyles,
                              zIndex: 1,
                            } as CSSProperties
                          }
                          ref={accountFloatingRefs.setFloating}
                          {...getAccountFloatingProps()}
                        >
                          <Listbox>
                            {accountSubItems.map(accountSubItem => (
                              <UtilityFragment key={accountSubItem.id}>
                                <li>
                                  <ListboxItem<'a'> href={accountSubItem.href} tag="a">
                                    {accountSubItem.tabLabel}
                                  </ListboxItem>
                                </li>
                              </UtilityFragment>
                            ))}
                          </Listbox>
                        </DropdownMenu>
                      </FloatingFocusManager>
                    )}
                  </Tab>
                </UtilityFragment>
              </Utility>
            </>
          ) : (
            /* Expanded search replaces entire nav bar */
            <UtilityFragment vFlex>
              <Surface
                style={
                  {
                    '--v-surface-background': 'var(--palette-default-surface-3)',
                    '--v-surface-border-radius': 'var(--size-rounded-medium)',
                    '--v-surface-padding-inline': 'var(--size-scalable-8)',
                  } as CSSProperties
                }
              >
                <InputContainer>
                  <VisaSearchLow />
                  <Input
                    id={`${id}-search-field`}
                    name={`${id}-search-field`}
                    ref={searchInputRef}
                    required
                    type="search"
                    aria-label="Search"
                    placeholder="Search"
                  />
                </InputContainer>
                <Button
                  aria-label="close search"
                  buttonSize="large"
                  colorScheme="tertiary"
                  iconButton
                  onClick={() => setExpandSearch(false)}
                >
                  <VisaCloseLow />
                </Button>
              </Surface>
            </UtilityFragment>
          )}
        </Nav>
      </UtilityFragment>
      {/* Mobile navigation drawer with alternate styling */}
      <UtilityFragment vContainerHide="desktop" vHide={!mobileMenuOpen}>
        <Nav
          alternate
          aria-label="global menu"
          aria-hidden={!mobileMenuOpen}
          id={`${id}-mobile-menu`}
          orientation="vertical"
        >
          {/* Mobile nav items */}
          <Tabs orientation="vertical">
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={<a href="./application-layouts">L1 label 1</a>}
              />
            </Tab>
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={<a href="./application-layouts">L1 label 2</a>}
              />
            </Tab>
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={<a href="./application-layouts">L1 label 3</a>}
              />
            </Tab>
            {/* Tab with expandable submenu in mobile */}
            <Tab>
              <Button
                aria-expanded={mobileLabel4MenuOpen}
                aria-controls={mobileLabel4MenuOpen ? `${id}-account-sub-menu` : 'undefined'}
                id={`${id}-mobile-menu-label-dropdown-button`}
                buttonSize="large"
                colorScheme="tertiary"
                onClick={() => setMobileLabel4MenuOpen(!mobileLabel4MenuOpen)}
              >
                L1 label 4
                <TabSuffix element={mobileLabel4MenuOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
              </Button>

              {mobileLabel4MenuOpen && (
                <Tabs orientation="vertical" id={`${id}-account-sub-menu`}>
                  {label4SubItems.map(label4SubItem => (
                    <Tab key={label4SubItem.id} id={label4SubItem.id}>
                      <Button
                        colorScheme="tertiary"
                        element={<a href={label4SubItem.href}>{label4SubItem.tabLabel}</a>}
                      />
                    </Tab>
                  ))}
                </Tabs>
              )}
            </Tab>
            {/* Notifications item (badge inline on mobile) */}
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                style={{ wordBreak: 'break-word', blockSize: 'max-content' } as CSSProperties}
              >
                Notifications
                <Badge
                  badgeVariant="number"
                  style={
                    {
                      position: 'relative',
                    } as CSSProperties
                  }
                  tag="sup"
                >
                  3
                </Badge>
              </Button>
            </Tab>
          </Tabs>
          <UtilityFragment vMarginTop={5}>
            <Divider dividerType="decorative" />
          </UtilityFragment>
          {/* Account section at bottom of mobile menu */}
          <UtilityFragment vMarginTop={6} className="v-tabs-vertical">
            <Tab tag="div">
              <Button
                aria-expanded={mobileAccountMenuOpen}
                aria-controls={`${id}-account-sub-menu`}
                aria-label="Alex Miller"
                buttonSize="large"
                colorScheme="tertiary"
                onClick={() => setMobileAccountMenuOpen(!mobileAccountMenuOpen)}
              >
                <VisaAccountLow />
                Alex Miller
                <TabSuffix element={mobileAccountMenuOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
              </Button>
              {mobileAccountMenuOpen && (
                <Tabs orientation="vertical" id={`${id}-account-sub-menu`}>
                  {accountSubItems.map(accountSubItem => (
                    <Tab key={accountSubItem.id} id={accountSubItem.id}>
                      <Button
                        colorScheme="tertiary"
                        element={<a href={accountSubItem.href}>{accountSubItem.tabLabel}</a>}
                      />
                    </Tab>
                  ))}
                </Tabs>
              )}
            </Tab>
          </UtilityFragment>
        </Nav>
      </UtilityFragment>
    </div>
  );
};
