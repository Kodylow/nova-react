<!--
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
 -->
 
 ### 3.1.0 (2026-03-20)

This release introduces new component properties, hooks, and pattern improvements. Key additions include the `useModel` hook for form state management, enhanced pagination controls with compact mode and controlled state, and expanded table customization options.

#### Features

- **Button:** Allow button to accept primary type
- **Label:** All labels now extend typography
- **Table:** Added `tableSize` property
- **useModel:** Added new hook for form state management
- **usePagination:** Added compact mode
- **usePagination:** Optional props for provided/controlled state
- **useTabs:** Allows controlled selected index value
- **Utility:** `vFlexRow` now adds `vFlex` by default
- **Dynamic Table:** Complete default pattern example with base shared components

#### Bug Fixes

- **Application Layouts:** Footer background color now applies correctly
- **Components:** Removed `defaultProps` to suppress React 19 deprecation warning
- **Dropdown:** Dropdown items padding corrected
- **Screen Reader:** Correct component selector typo in API
- **Chat:** Pattern examples now use `hideTimestamp` prop for consistency
- **Chat:** Adds validation reset and responsive behavior
- **Chat:** Responsive padding on chat bubbles
- **Chat:** Uses dialog content for dark mode
- **File Upload:** Upload dialog flexible with boundaries
- **File Upload:** Prevent card shift from uploading text
- **File Upload:** Lowercases file extensions in display text
- **Dynamic Table:** Remove nested components for proper React rendering

### 3.0.0 (2025-09-26)

#### Features

- Added a collection of patterns:
  - Application layout
  - Chat
  - File Upload
  - Wizard

### 2.5.4 (2025-04-11)

#### Features

- Initial release of the nova-react library.
- Added a collection of components:
  - Accordion
  - Anchor link menu
  - Avatar
  - Badge
  - Banner
  - Breadcrumbs
  - Button
  - Checkbox
  - Chip
  - Color selector
  - Combobox
  - Content card
  - Date and time selectors
  - Dialog
  - Divider
  - Dropdown menu
  - Flag
  - Footer
  - Horizontal navigation
  - Icon
  - Input
  - Label
  - Link
  - Listbox
  - Logo
  - Multiselect
  - Navigation drawer
  - Pagination
  - Panel
  - Progress
  - Radio
  - Section message
  - Select
  - Switch
  - Table
  - Tabs
  - Toggle button
  - Tooltip
  - Vertical navigation
  - Wizard
- Added several hooks:
  - use-accordion
  - use-card-number-validation
  - use-debounce
  - use-focus-trap
  - use-listbox
  - use-pagination
  - use-tabs
  - use-wizard
- Added Utility and UtilityFragment components.