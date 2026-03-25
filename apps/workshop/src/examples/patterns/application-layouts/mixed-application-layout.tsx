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

import { AlternateHorizontalNavLayout } from './alternate-horizontal-nav-layout';
import { FooterLayout } from './shared/footer-layout';
import './styles-mixed.css';
import { VerticalMixedNavLayout } from './vertical-mixed-nav-layout';

/**
 * Shell layout with top navigation bar plus left sidebar. Use for complex apps with two levels of navigation.
 */
export const MixedApplicationLayout = () => {
  return (
    <>
      <div className="layout layout-example layout-mixed">
        {/* Top horizontal navigation - primary level */}
        <div className="layout-header">
          <AlternateHorizontalNavLayout />
        </div>
        {/* Left sidebar navigation - secondary level, collapsible */}
        <VerticalMixedNavLayout />
        {/* Scrollable content region - target for skip link navigation */}
        <div id="content" className="layout-content" tabIndex={-1}>
          <main className="layout-main">{/* Add your h1 and page content here */}</main>
          <FooterLayout />
        </div>
      </div>
    </>
  );
};
