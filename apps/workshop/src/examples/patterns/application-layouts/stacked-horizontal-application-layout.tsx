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
import './styles-stacked.css';
import { StackedHorizontalNavLayout } from './stacked-horizontal-nav-layout';

/**
 * Shell layout with two navigation bars stacked at the top. Use when you have both global navigation and page-level tabs.
 */
export const StackedHorizontalApplicationLayout = () => {
  return (
    <>
      <div className="layout layout-example layout-stacked">
        {/* Fixed stacked header region - contains two navigation bars */}
        <div className="layout-header">
          <StackedHorizontalNavLayout />
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
