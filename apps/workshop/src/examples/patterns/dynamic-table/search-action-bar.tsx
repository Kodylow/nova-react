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
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react';
import { VisaClearAltTiny, VisaFilterAltTiny, VisaRefreshTiny, VisaSearchLow } from '@visa/nova-icons-react';
import { Button, Input, InputContainer, Surface, Typography, Utility, UtilityFragment } from '@visa/nova-react';

/**
 * Action bar with integrated search functionality.
 */
const SearchActionBarDynamicTable = () => {
  const [showClearButton, setShowClearButton] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Hides clear button when focus leaves the input container.
   *
   * @param event - Focus event from input container
   */
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowClearButton(false);
    }
  };

  /**
   * Clears input value and refocuses the input field.
   */
  const handleClear = () => {
    setInputValue('');
    // Put focus back into the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Shows or hides clear button based on input value.
   */
  useEffect(() => {
    if (inputValue !== '') setShowClearButton(true);
    else setShowClearButton(false);
  }, [inputValue]);

  return (
    <UtilityFragment
      vPaddingHorizontal={16}
      vPaddingVertical={8}
      style={
        {
          '--v-surface-background': 'var(--palette-default-surface-2)',
          '--v-surface-border-radius': 'var(--size-rounded-none)',
        } as CSSProperties
      }
    >
      <Surface>
        <Utility vFlex vJustifyContent="between" vFlexWrap vAlignItems="center" vGap={10}>
          <Utility vFlex vGap="8" vAlignItems="center">
            <Typography variant="headline-4">Headline</Typography>
            <Button buttonSize="small" iconButton colorScheme="tertiary" aria-label="refresh">
              <VisaRefreshTiny />
            </Button>
          </Utility>
          <Utility vFlex vGap="8" vAlignItems="center">
            <Utility vFlex vFlexCol vGap={4}>
              <InputContainer
                onBlur={e => handleBlur(e)}
                onFocus={() => {
                  if (inputValue !== '') setShowClearButton(true);
                }}
              >
                <VisaSearchLow />
                {/* padding logic prevents input from growing visually when clear button appears */}
                <UtilityFragment vPaddingRight={!showClearButton ? 38 : 0}>
                  <Input
                    ref={inputRef}
                    aria-required="true"
                    aria-label="Search"
                    onChange={e => setInputValue(e.currentTarget.value)}
                    type="text"
                    value={inputValue}
                    placeholder="Search"
                    name="search-action-bar"
                  />
                </UtilityFragment>
                {showClearButton && (
                  <Button
                    aria-label="Clear"
                    buttonSize="small"
                    colorScheme="tertiary"
                    iconButton
                    onClick={handleClear}
                    subtle
                  >
                    <VisaClearAltTiny />
                  </Button>
                )}
              </InputContainer>
            </Utility>
            <Button iconButton buttonSize="small" colorScheme="tertiary" aria-label="filter table - search action bar">
              <VisaFilterAltTiny />
            </Button>
          </Utility>
        </Utility>
      </Surface>
    </UtilityFragment>
  );
};

export default SearchActionBarDynamicTable;
