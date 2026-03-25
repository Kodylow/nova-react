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

import { Footer, Link, Utility, VisaLogo } from '@visa/nova-react';

/**
 * Shared footer component used by all application layouts.
 */
export const FooterLayout = () => {
  return (
    <Footer className="v-gap-15">
      {/* Visa logo */}
      <Utility vFlex vMarginRight={1}>
        <VisaLogo aria-label="Visa" />
      </Utility>
      {/* Copyright text and footer links */}
      <Utility vFlex vFlexWrap vFlexGrow vJustifyContent="between" vGap={42}>
        {`Copyright © ${new Date().getFullYear()} Visa Inc. All Rights Reserved`}
        {/* Footer navigation links - customize as needed */}
        <Utility tag="ul" vFlex vFlexWrap vGap={16}>
          <li>
            <Link href="./application-layouts">Contact us</Link>
          </li>
          <li>
            <Link href="./application-layouts">Privacy</Link>
          </li>
          <li>
            <Link href="./application-layouts">Terms of use</Link>
          </li>
        </Utility>
      </Utility>
    </Footer>
  );
};
