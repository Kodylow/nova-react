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
import { VisaChevronRightTiny, VisaChevronDownTiny } from '@visa/nova-icons-react';
import {
  Accordion,
  AccordionHeading,
  AccordionToggleIcon,
  UtilityFragment,
  AccordionPanel,
  Badge,
} from '@visa/nova-react';

/**
 * Props for AccordionFilterItem.
 *
 * @property columnName - Name of the column being filtered
 * @property children - (optional) Filter options to display inside the accordion
 * @property filterLength - Number of active filters to display in the badge
 */
interface AccordionFilterItemProps {
  columnName: string;
  children?: React.ReactNode;
  filterLength: number;
}

/**
 * Wraps filter options in an expandable accordion. It displays the column name with a badge
 * showing how many filters are active, and expands when clicked to reveal the filter options.
 */
const AccordionFilterItem = ({ columnName, children, filterLength }: AccordionFilterItemProps) => {
  const id = `filter-accordion-${columnName.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <>
      <Accordion key={'accordion-item-' + id}>
        <UtilityFragment vAlignItems="center">
          <AccordionHeading buttonSize="large" colorScheme="secondary" id={`${id}-panel-title`}>
            <AccordionToggleIcon elementClosed={<VisaChevronRightTiny rtl />} elementOpen={<VisaChevronDownTiny />} />
            {columnName}
            {filterLength > 0 && (
              <UtilityFragment vMarginLeft={'auto'}>
                <Badge badgeType="critical" badgeVariant="number">
                  {filterLength}
                </Badge>
              </UtilityFragment>
            )}
          </AccordionHeading>
        </UtilityFragment>
        <UtilityFragment vPadding={2}>
          <AccordionPanel>{children}</AccordionPanel>
        </UtilityFragment>
      </Accordion>
    </>
  );
};

export default AccordionFilterItem;
