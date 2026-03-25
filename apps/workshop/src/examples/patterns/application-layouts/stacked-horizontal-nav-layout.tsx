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
  useDismiss,
  useFloating,
  useInteractions,
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
  Tabs,
  TabSuffix,
  Typography,
  Utility,
  UtilityFragment,
  VisaLogo,
  Divider,
} from '@visa/nova-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

// Base ID for aria attributes and element IDs - customize for unique identification
const id = 'stacked-horizontal-nav';

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

/**
 * Two-tier navigation component used by StackedHorizontalApplicationLayout.
 */
export const StackedHorizontalNavLayout = () => {
  // Refs for managing keyboard focus on search input and button
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  // State for desktop account dropdown
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // State for mobile menu and nested account dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccountMenuOpen, setMobileAccountMenuOpen] = useState(false);

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

  // Toggles mobile navigation drawer open and closed
  const onToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <Link skipLink href="#content">
        Skip to content
      </Link>
      <UtilityFragment vJustifyContent="between">
        {/* Upper navigation bar: logo, utilities */}
        <Nav id={id} orientation="horizontal" tag="header">
          {/* Default nav: logo, actions */}
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
            /* Expanded search replaces entire upper nav bar */
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

      {/* Mobile navigation drawer */}
      <UtilityFragment vContainerHide="desktop" vHide={!mobileMenuOpen}>
        <Nav aria-label="global menu" aria-hidden={!mobileMenuOpen} id={`${id}-mobile-menu`} orientation="vertical">
          {/* Mobile nav items - dynamically generated, replace with your navigation */}
          <Tabs orientation="vertical">
            {Array.from({ length: 3 }).map((_, contextIndex) => {
              return (
                <Tab key={`mobile-l1-item-${contextIndex}`}>
                  <Button
                    buttonSize="large"
                    colorScheme="tertiary"
                    element={<a href="./application-layouts">L1 label {contextIndex + 1}</a>}
                  />
                </Tab>
              );
            })}
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

      {/* Lower desktop navigation bar: primary tabs - hidden on mobile */}
      <Nav
        aria-label="secondary"
        className="v-ml-auto v-mobile-container-hide"
        style={
          {
            '--v-surface-background': 'var(--palette-default-surface-2)',
            '--v-tabs-active-line-padding': 'var(--size-responsive-10)',
          } as CSSProperties
        }
      >
        {/* Primary navigation tabs - dynamically generated, replace with your navigation */}
        <Tabs className="v-gap-8">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <Tab key={`second-tier-item-${index}`}>
                <Button
                  buttonSize="large"
                  colorScheme="tertiary"
                  element={<a href="./application-layouts">L1 label {index + 1}</a>}
                />
              </Tab>
            );
          })}
        </Tabs>
      </Nav>
    </div>
  );
};
