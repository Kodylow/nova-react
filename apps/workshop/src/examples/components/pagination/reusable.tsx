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
import {
  VisaArrowEndTiny,
  VisaArrowStartTiny,
  VisaChevronDownTiny,
  VisaChevronLeftTiny,
  VisaChevronRightTiny,
  VisaOptionHorizontalTiny,
} from '@visa/nova-icons-react';
import {
  Button,
  calculatePagesFromTo,
  calculateTotalPages,
  InputContainer,
  InputControl,
  InputMessage,
  Label,
  Pagination,
  PaginationOverflow,
  Select,
  usePagination,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { type CSSProperties, type FormEvent, useEffect, useId, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Nova Pagination Component Props
export interface NovaPaginationProps {
  'aria-label'?: string;
  blockMaxLength?: number;
  compact?: boolean;
  disabled?: boolean;
  id?: string;
  inline?: boolean;
  itemsPerPage?: number;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  selectLabel?: string;
  showItemsPerPage?: boolean;
  showPageRange?: boolean;
  totalItems?: number;
}

// Main Nova Pagination Component
export const NovaPagination = ({
  'aria-label': ariaLabel = 'Pagination for table',
  blockMaxLength,
  compact = false,
  disabled = false,
  id: idProp,
  inline = true,
  itemsPerPage: itemsPerPageProp = 10,
  itemsPerPageOptions = [5, 10, 15, 20],
  onItemsPerPageChange: onItemsPerPageChangeProp,
  onPageChange: onPageChangeProp,
  page,
  selectLabel = 'Results per page',
  showItemsPerPage = true,
  showPageRange = true,
  totalItems = 1,
  ...remainingProps
}: NovaPaginationProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [itemsPerPageControlled, setItemsPerPageControlled] = useState(10);

  const itemsPerPage = itemsPerPageProp ?? itemsPerPageControlled;
  const setItemsPerPage = onItemsPerPageChangeProp ?? setItemsPerPageControlled;

  const totalPages = calculateTotalPages(totalItems, itemsPerPage);
  const {
    isFirstPage,
    isLastPage,
    onFirstPage,
    onLastPage,
    onNextPage,
    onPageChange,
    onPreviousPage,
    pages,
    selectedPage,
  } = usePagination({
    blockMaxLength,
    compact,
    setSelectedPage: onPageChangeProp,
    selectedPage: page,
    totalPages,
  });

  const { from, to } = calculatePagesFromTo(totalItems, itemsPerPage, selectedPage);

  const onItemsPerPageChange = (event: FormEvent<HTMLSelectElement>) => {
    onFirstPage();
    setItemsPerPage(+event.currentTarget.value);
  };

  useEffect(() => {
    onFirstPage();
  }, [itemsPerPage, totalItems]);

  return (
    <Utility
      vAlignItems="center"
      vFlex
      vFlexRow
      vFlexWrapReverse
      vGap={10}
      vJustifyContent="between"
      {...remainingProps}
    >
      {(showItemsPerPage || showPageRange) && (
        <Utility
          style={{ textWrap: 'nowrap' } as CSSProperties}
          tag="fieldset"
          vAlignItems={inline ? 'center' : undefined}
          vFlex
          vFlexRow={inline}
          vFlexCol={!inline}
          vGap={8}
          vFlexWrap
        >
          {showItemsPerPage && (
            <>
              <UtilityFragment vFlexShrink0>
                <Label htmlFor={`${id}-select`} variant="label-large">
                  {selectLabel}
                </Label>
              </UtilityFragment>
              <InputContainer style={{ flexBasis: inline ? 'max-content' : undefined }}>
                <Select
                  aria-describedby={showPageRange ? `${id}-select-message` : undefined}
                  disabled={disabled}
                  id={`${id}-select`}
                  name={`${id}-select`}
                  onChange={onItemsPerPageChange}
                  value={itemsPerPage}
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={`${id}-items-per-page-option-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <InputControl>
                  <VisaChevronDownTiny />
                </InputControl>
              </InputContainer>
            </>
          )}
          {showPageRange && (
            <InputMessage
              id={`${id}-select-message`}
              variant="body-2"
            >{`${from} - ${to} of ${totalItems}`}</InputMessage>
          )}
        </Utility>
      )}
      <UtilityFragment>
        <nav aria-label={ariaLabel} role="navigation">
          <UtilityFragment vAlignItems="center" vGap={4} vFlex vFlexWrap>
            <Pagination>
              {!compact && (
                <li>
                  <Button
                    aria-label="Go to first page"
                    buttonSize="small"
                    colorScheme="tertiary"
                    disabled={isFirstPage || disabled}
                    iconButton
                    onClick={onFirstPage}
                  >
                    <VisaArrowStartTiny rtl />
                  </Button>
                </li>
              )}
              <li>
                <Button
                  aria-label="Go to previous page"
                  buttonSize="small"
                  colorScheme="tertiary"
                  disabled={isFirstPage || disabled}
                  iconButton
                  onClick={onPreviousPage}
                >
                  <VisaChevronLeftTiny rtl />
                </Button>
              </li>
              {pages.map((pageNumber, index) =>
                pageNumber === -1 ? (
                  <UtilityFragment key={`table-pagination-ellipse-${index}`} vAlignItems="center" vFlex>
                    <PaginationOverflow>
                      <VisaOptionHorizontalTiny />
                    </PaginationOverflow>
                  </UtilityFragment>
                ) : (
                  <li key={`table-pagination-page-${pageNumber}`}>
                    <Button
                      aria-current={selectedPage === pageNumber}
                      aria-label={`Page ${pageNumber}`}
                      colorScheme="tertiary"
                      disabled={disabled}
                      onClick={() => onPageChange(pageNumber as number)}
                    >
                      {pageNumber}
                    </Button>
                  </li>
                )
              )}
              <li>
                <Button
                  aria-label="Go to next page"
                  buttonSize="small"
                  colorScheme="tertiary"
                  disabled={isLastPage || disabled}
                  iconButton
                  onClick={onNextPage}
                >
                  <VisaChevronRightTiny rtl />
                </Button>
              </li>
              {!compact && (
                <li>
                  <Button
                    aria-label="Go to last page"
                    buttonSize="small"
                    colorScheme="tertiary"
                    disabled={isLastPage || disabled}
                    iconButton
                    onClick={onLastPage}
                  >
                    <VisaArrowEndTiny rtl />
                  </Button>
                </li>
              )}
            </Pagination>
          </UtilityFragment>
        </nav>
      </UtilityFragment>
    </Utility>
  );
};

// export default NovaPagination;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  compact: boolean;
  disabled: boolean;
  inline: boolean;
  showItemsPerPage: boolean;
  showPageRange: boolean;
  totalItems: number;
}

// Demo Component
export const NovaPaginationDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    compact: false,
    disabled: false,
    inline: true,
    showItemsPerPage: true,
    showPageRange: true,
    totalItems: 100,
  };

  const [customizations, setCustomizations] = useState<DemoCustomizations>(defaultCustomizations);
  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean | number) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomizations(formValues);
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations(defaultCustomizations);
  };

  return (
    <div>
      <NovaPagination
        blockMaxLength={customizations.compact ? 5 : undefined}
        compact={customizations.compact}
        disabled={customizations.disabled}
        inline={customizations.inline}
        showItemsPerPage={customizations.showItemsPerPage}
        showPageRange={customizations.showPageRange}
        totalItems={customizations.totalItems}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Total items"
                onChange={e => handleInputChange('totalItems', Number(e.target.value) || 100)}
                type="number"
                value={formValues.totalItems.toString()}
              />

              <NovaCheckbox
                label="Compact"
                checked={formValues.compact}
                onChange={e => handleInputChange('compact', e.target.checked)}
              />

              <NovaCheckbox
                label="Disabled"
                checked={formValues.disabled}
                onChange={e => handleInputChange('disabled', e.target.checked)}
              />

              <NovaCheckbox
                label="Inline"
                checked={formValues.inline}
                onChange={e => handleInputChange('inline', e.target.checked)}
              />

              <NovaCheckbox
                label="Show items per page"
                checked={formValues.showItemsPerPage}
                onChange={e => handleInputChange('showItemsPerPage', e.target.checked)}
              />

              <NovaCheckbox
                label="Show page range"
                checked={formValues.showPageRange}
                onChange={e => handleInputChange('showPageRange', e.target.checked)}
              />
            </Utility>

            <Utility vFlex vGap={16} style={{ marginBottom: '16px' }}>
              <Button type="submit">Apply</Button>
              <Button colorScheme="secondary" type="button" onClick={handleReset}>
                Reset
              </Button>
            </Utility>
          </form>
        </NovaAccordion>
      </div>
    </div>
  );
};
export default NovaPaginationDemo;
/** !!! DELETE ME END !!! */
