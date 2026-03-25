/**
 *              © 2026 Visa
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

import { BrowserRouter } from 'react-router-dom';
import metaData from './meta.json';

import ActionBarAndPaginationDynamicTable from './action-bar-and-pagination';
import ColumnHeaderActionsComponent from './column-header-actions';
import DataFetchOnAccordionToggleDynamicTable from './data-fetch-on-accordion-toggle';
import DataFetchOnPaginationDynamicTable from './data-fetch-on-pagination';
import DefaultDynamicTable from './default';
import FilterDialogDynamicTable from './filter-dialog';
import FiltersDynamicTable from './filters';
import InTableFiltersDynamicTable from './in-table-filters';
import IndeterminateCircularProgressDynamicTable from './indeterminate-circular-progress';
import IndeterminateLinearProgressDynamicTable from './indeterminate-linear-progress';
import MultiRowExpandableDynamicTable from './multi-row-expandable';
import MultiSelectDynamicTable from './multi-select';
import MultipleActionButtonsDynamicTable from './multiple-action-buttons';
import NotificationsDynamicTable from './notifications';
import PaginationDynamicTable from './pagination';
import PinnedColumnAndHorizontalScrollDynamicTable from './pinned-column-and-horizontal-scroll';
import SearchActionBarDynamicTable from './search-action-bar';
import SelectionBasedActionBarDynamicTable from './selection-based-action-bar';
import SingleRowExpandableDynamicTable from './single-row-expandable';
import SubtleActionBarDynamicTable from './subtle-action-bar';
import ToggleActionBarDynamicTable from './toggle-action-bar';
import VerticalAndHorizontalScrollDynamicTable from './vertical-and-horizontal-scroll';
import VerticalScrollAndStickyRowDynamicTable from './vertical-scroll-and-sticky-row';

const examples = [
  { Component: ActionBarAndPaginationDynamicTable, title: metaData['action-bar-and-pagination'].title },
  { Component: ColumnHeaderActionsComponent, title: metaData['column-header-actions'].title },
  { Component: DataFetchOnAccordionToggleDynamicTable, title: metaData['data-fetch-on-accordion-toggle'].title },
  { Component: DataFetchOnPaginationDynamicTable, title: metaData['data-fetch-on-pagination'].title },
  { Component: DefaultDynamicTable, title: metaData['default'].title },
  { Component: FilterDialogDynamicTable, title: metaData['filter-dialog'].title },
  { Component: FiltersDynamicTable, title: metaData['filters'].title },
  { Component: InTableFiltersDynamicTable, title: metaData['in-table-filters'].title },
  { Component: IndeterminateCircularProgressDynamicTable, title: metaData['indeterminate-circular-progress'].title },
  { Component: IndeterminateLinearProgressDynamicTable, title: metaData['indeterminate-linear-progress'].title },
  { Component: MultiRowExpandableDynamicTable, title: metaData['multi-row-expandable'].title },
  { Component: MultiSelectDynamicTable, title: metaData['multi-select'].title },
  { Component: MultipleActionButtonsDynamicTable, title: metaData['multiple-action-buttons'].title },
  { Component: NotificationsDynamicTable, title: metaData['notifications'].title },
  { Component: PaginationDynamicTable, title: metaData['pagination'].title },
  {
    Component: PinnedColumnAndHorizontalScrollDynamicTable,
    title: metaData['pinned-column-and-horizontal-scroll'].title,
  },
  { Component: SearchActionBarDynamicTable, title: metaData['search-action-bar'].title },
  { Component: SelectionBasedActionBarDynamicTable, title: metaData['selection-based-action-bar'].title },
  { Component: SingleRowExpandableDynamicTable, title: metaData['single-row-expandable'].title },
  { Component: SubtleActionBarDynamicTable, title: metaData['subtle-action-bar'].title },
  { Component: ToggleActionBarDynamicTable, title: metaData['toggle-action-bar'].title },
  { Component: VerticalAndHorizontalScrollDynamicTable, title: metaData['vertical-and-horizontal-scroll'].title },
  { Component: VerticalScrollAndStickyRowDynamicTable, title: metaData['vertical-scroll-and-sticky-row'].title },
];

describe('Dynamic table examples', () => {
  examples.forEach(({ Component, title }) => {
    it(`${title} should render correctly`, async () => {
      const { container } = render(
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      );
      const results = await axe(container, {
        rules: {
          'scope-attr-valid': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
      expect(container).toMatchSnapshot();
    });
  });
});
