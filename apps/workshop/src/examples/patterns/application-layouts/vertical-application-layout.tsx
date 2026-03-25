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

import { FooterLayout } from './shared/footer-layout';
import './styles-vertical.css';
import { VerticalNavigationLayout } from './vertical-nav-layout';

/**
 * Shell layout with collapsible sidebar on the left, content on the right. Common for dashboards and admin tools.
 */
export const VerticalApplicationLayout = () => {
  return (
    <>
      <div className="layout layout-example layout-vertical">
        {/* Left sidebar region - collapsible navigation */}
        <div className="layout-header v-flex v-flex-col v-gap-24">
          <VerticalNavigationLayout />
        </div>
        {/* Scrollable content region - target for skip link navigation */}
        <div id="content" className="layout-content" tabIndex={-1}>
          <main className="layout-main">{/* Add your h1 and page content here */}</main>
          <FooterLayout />
        </div>
      </div>
    </>
  );
};
