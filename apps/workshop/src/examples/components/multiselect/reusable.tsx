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
import { VisaChevronDownTiny, VisaChevronUpTiny, VisaClearAltTiny, VisaErrorTiny } from '@visa/nova-icons-react';
import {
  Button,
  Checkbox,
  Chip,
  Combobox,
  Divider,
  DropdownContainer,
  Input,
  InputContainer,
  InputMessage,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
  Typography,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import {
  type UseComboboxState,
  type UseComboboxStateChangeOptions,
  useCombobox,
  useMultipleSelection,
} from 'downshift';
import { useId, useMemo, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Types
export interface MultiselectOption<T = string> {
  disabled?: boolean;
  label: string;
  value: T;
}

// Nova Multiselect Component Props
export interface NovaMultiselectProps<T = string> {
  autoFilter?: boolean;
  autoSelect?: boolean;
  description?: string;
  disabled?: boolean;
  hideDropdownButton?: boolean;
  hideSelectionButtons?: boolean;
  id?: string;
  inline?: boolean;
  invalid?: boolean;
  label?: string;
  message?: string;
  onChange?: (selectedValues: T[]) => void;
  options?: MultiselectOption<T>[];
  readonly?: boolean;
  required?: boolean;
  value?: T[];
}

// Combobox state reducer
const comboboxStateReducer = <ItemType,>(
  state: UseComboboxState<ItemType>,
  { type, changes }: UseComboboxStateChangeOptions<ItemType>
) => {
  switch (type) {
    case useCombobox.stateChangeTypes.InputClick:
      return {
        ...state,
      };
    case useCombobox.stateChangeTypes.InputChange:
      return {
        ...changes,
        highlightedIndex: state.highlightedIndex,
      };
    case useCombobox.stateChangeTypes.ItemMouseMove:
    case useCombobox.stateChangeTypes.MenuMouseLeave:
      return {
        ...changes,
        highlightedIndex: state.highlightedIndex,
      };
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
      return {
        ...changes,
        ...(changes.selectedItem && { isOpen: true, highlightedIndex: state.highlightedIndex }),
      };
    case useCombobox.stateChangeTypes.InputBlur:
      return {
        ...changes,
        isOpen: true,
        ...(changes.selectedItem && { highlightedIndex: state.highlightedIndex }),
      };
    default:
      return changes;
  }
};

// Item to string converter
const itemToString = <T,>(item: MultiselectOption<T> | null) => (item ? item.label : '');

// Main Nova Multiselect Component
export const NovaMultiselect = <T = string,>({
  autoFilter = true,
  autoSelect = false,
  description,
  disabled = false,
  hideDropdownButton = false,
  hideSelectionButtons = false,
  id: idProp,
  inline = false,
  invalid = false,
  label = '',
  message,
  onChange,
  options = [],
  readonly = false,
  required = false,
  value = [],
  ...remainingProps
}: NovaMultiselectProps<T>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<MultiselectOption<T>[]>(() =>
    options.filter(opt => value.includes(opt.value))
  );

  // Filter options based on input value
  const filteredItems = useMemo(() => {
    if (!autoFilter || !inputValue) return options;
    return options.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [autoFilter, inputValue, options]);

  // Calculate aria-describedby
  const inputDescribedBy =
    message || description
      ? [message ? `${id}-message` : '', description ? `${id}-description` : ''].filter(Boolean).join(' ')
      : undefined;

  const { getDropdownProps, removeSelectedItem } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      if (
        type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace ||
        type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete ||
        type === useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace ||
        type === useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem
      ) {
        const updatedItems = newSelectedItems || [];
        setSelectedItems(updatedItems);
        onChange?.(updatedItems.map(item => item.value));
      }
    },
  });

  const {
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    isOpen,
    setHighlightedIndex,
  } = useCombobox({
    id: `${id}-combobox`,
    items: filteredItems,
    itemToString,
    inputValue,
    defaultHighlightedIndex: 0,
    stateReducer: comboboxStateReducer,
    onStateChange({ inputValue: newInputValue, type, selectedItem }) {
      if (type === useCombobox.stateChangeTypes.InputChange) {
        setInputValue(newInputValue || '');

        // Auto-select if enabled and there's only one filtered result
        if (autoSelect && newInputValue) {
          const filtered = options.filter(item => item.label.toLowerCase().includes(newInputValue.toLowerCase()));
          if (filtered.length === 1 && !selectedItems.includes(filtered[0])) {
            const newSelectedItems = [...selectedItems, filtered[0]];
            setSelectedItems(newSelectedItems);
            onChange?.(newSelectedItems.map(item => item.value));
            setInputValue('');
          }
        }
      }
      if (type === useCombobox.stateChangeTypes.ItemClick && selectedItem) {
        setHighlightedIndex(filteredItems.indexOf(selectedItem));
      }
    },
  });

  const handleItemSelect = (item: MultiselectOption<T>) => {
    if (item.disabled) return;

    if (selectedItems.includes(item)) {
      removeSelectedItem(item);
    } else {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      onChange?.(newSelectedItems.map(i => i.value));
      setInputValue('');
    }
  };

  const handleSelectAll = () => {
    const enabledOptions = options.filter(opt => !opt.disabled);
    setSelectedItems(enabledOptions);
    onChange?.(enabledOptions.map(item => item.value));
  };

  const handleClearAll = () => {
    setSelectedItems([]);
    onChange?.([]);
  };

  const resultsFound = filteredItems.length > 0;

  return (
    <Combobox>
      <UtilityFragment vFlex vFlexCol vGap={4}>
        <DropdownContainer>
          <Utility vFlex={inline} vFlexCol={!inline} vGap={inline ? 8 : 4}>
            <Label {...getLabelProps()} htmlFor={`${id}-input`}>
              {label}
              {required ? ' (required)' : ''}
            </Label>
            {description && (
              <Typography variant="body-3" id={`${id}-description`} tag="span">
                {description}
              </Typography>
            )}
          </Utility>
          <UtilityFragment vPaddingVertical={3} vPaddingLeft={3} vPaddingRight={6}>
            <InputContainer>
              <Utility vFlex vFlexGrow vFlexShrink vFlexWrap vGap={2}>
                {selectedItems.map((item, index) => (
                  <UtilityFragment vFlexShrink0 key={`selected-item-${index}`}>
                    <Chip chipSize="compact">
                      {readonly ? (
                        item.label
                      ) : (
                        <>
                          <Label>{item.label}</Label>
                          <Button
                            aria-label={`Remove ${item.label}`}
                            colorScheme="tertiary"
                            iconButton
                            onClick={() => removeSelectedItem(item)}
                            subtle
                            disabled={disabled}
                          >
                            <VisaClearAltTiny />
                          </Button>
                        </>
                      )}
                    </Chip>
                  </UtilityFragment>
                ))}
                <UtilityFragment vFlexShrink style={{ flexBasis: '50px' }}>
                  <Input
                    {...getInputProps(
                      getDropdownProps({
                        onKeyDown: e => {
                          if (e.key === 'Enter') {
                            if (highlightedIndex !== -1 && resultsFound && isOpen) {
                              const selectedItem = filteredItems[highlightedIndex];
                              handleItemSelect(selectedItem);
                            }
                          }
                        },
                      })
                    )}
                    aria-describedby={inputDescribedBy}
                    aria-invalid={invalid}
                    aria-required={required ? true : undefined}
                    disabled={disabled}
                    id={`${id}-input`}
                    name={`${id}-multiselect`}
                    readOnly={readonly}
                    {...remainingProps}
                  />
                </UtilityFragment>
              </Utility>
              {!hideDropdownButton && (
                <Button
                  aria-haspopup="listbox"
                  aria-label={`${id}-toggle-button`}
                  buttonSize="small"
                  colorScheme="tertiary"
                  iconButton
                  disabled={disabled || readonly}
                  {...getToggleButtonProps()}
                >
                  {isOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />}
                </Button>
              )}
            </InputContainer>
          </UtilityFragment>
        </DropdownContainer>
      </UtilityFragment>

      <UtilityFragment vMarginTop={4}>
        <InputMessage aria-atomic={invalid ? true : undefined} aria-live={invalid ? 'assertive' : undefined}>
          {invalid && message && <VisaErrorTiny />}
          {message && message}
        </InputMessage>
      </UtilityFragment>

      <ListboxContainer>
        {!hideSelectionButtons && (
          <>
            <Utility vFlex vJustifyContent="between" vAlignItems="center" vPaddingHorizontal={8}>
              <Button colorScheme="tertiary" onClick={handleSelectAll} disabled={disabled || readonly}>
                Select All
              </Button>
              <Button colorScheme="tertiary" destructive onClick={handleClearAll} disabled={disabled || readonly}>
                Clear All
              </Button>
            </Utility>
            <Divider dividerType="decorative" />
          </>
        )}
        <UtilityFragment
          vAlignItems={resultsFound ? undefined : 'center'}
          vFlex={resultsFound || undefined}
          vJustifyContent={resultsFound ? undefined : 'center'}
          style={resultsFound ? undefined : { minBlockSize: 180 }}
        >
          <Listbox {...getMenuProps()}>
            {filteredItems.map((item, index) => (
              <ListboxItem<'li'>
                key={`${id}-item-${index}`}
                className={highlightedIndex === index ? 'v-listbox-item-highlighted' : ''}
                {...getItemProps({
                  item,
                  index,
                  'aria-disabled': item.disabled || undefined,
                  'aria-selected': selectedItems.includes(item),
                  onClick: () => handleItemSelect(item),
                })}
              >
                <Checkbox tag="span" checked={selectedItems.includes(item)} disabled={item.disabled} />
                {item.label}
              </ListboxItem>
            ))}
            {!resultsFound && (
              <li aria-atomic="true" aria-live="assertive">
                <Typography variant="label-large">No results found</Typography>
              </li>
            )}
          </Listbox>
        </UtilityFragment>
      </ListboxContainer>
    </Combobox>
  );
};
// export default NovaMultiselect;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  autoFilter: boolean;
  autoSelect: boolean;
  description: string;
  disabled: boolean;
  hideDropdownButton: boolean;
  hideSelectionButtons: boolean;
  inline: boolean;
  invalid: boolean;
  label: string;
  message: string;
  options: string;
  readonly: boolean;
  required: boolean;
}

const demoOptions: MultiselectOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c', disabled: true },
  { label: 'Option D', value: 'd' },
  { label: 'Option E', value: 'e' },
];

// Demo Component
export const NovaMultiselectDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    autoFilter: true,
    autoSelect: false,
    description: 'This is optional text that describes the label in more detail.',
    disabled: false,
    hideDropdownButton: false,
    hideSelectionButtons: false,
    inline: false,
    invalid: false,
    label: 'Label',
    message: 'This is required text that describes the error in more detail.',
    options: JSON.stringify(demoOptions, null, 2),
    readonly: false,
    required: false,
  };

  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'options'> & { options: MultiselectOption[] }
  >({
    ...defaultCustomizations,
    options: demoOptions,
  });

  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedOptions = JSON.parse(formValues.options || '[]') as MultiselectOption[];
      setCustomizations({
        ...formValues,
        options: parsedOptions,
      });
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations({
      ...defaultCustomizations,
      options: demoOptions,
    });
    setSelectedValues([]);
  };

  return (
    <div>
      <NovaMultiselect
        autoFilter={customizations.autoFilter}
        autoSelect={customizations.autoSelect}
        description={customizations.description || ''}
        disabled={customizations.disabled}
        hideDropdownButton={customizations.hideDropdownButton}
        hideSelectionButtons={customizations.hideSelectionButtons}
        inline={customizations.inline}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.invalid ? customizations.message : undefined}
        onChange={setSelectedValues}
        options={customizations.options}
        readonly={customizations.readonly}
        required={customizations.required}
        value={selectedValues}
      />

      <div style={{ marginTop: '24px' }}>
        <Typography variant="body-2" tag="p">
          Selected values: {selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}
        </Typography>
      </div>

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Label"
                onChange={e => handleInputChange('label', e.target.value)}
                value={formValues.label}
              />

              <NovaInput
                clearable
                label="Description"
                onChange={e => handleInputChange('description', e.target.value)}
                value={formValues.description}
              />

              <NovaInput
                clearable
                label="Error message"
                onChange={e => handleInputChange('message', e.target.value)}
                value={formValues.message}
              />

              <NovaInput<'textarea'>
                fixed={false}
                label="Options (JSON)"
                onChange={e => handleInputChange('options', e.target.value)}
                style={{ blockSize: '150px' }}
                textarea
                value={formValues.options}
              />

              <NovaCheckbox
                label="Auto filter"
                checked={formValues.autoFilter}
                onChange={e => handleInputChange('autoFilter', e.target.checked)}
              />

              <NovaCheckbox
                label="Auto select"
                checked={formValues.autoSelect}
                onChange={e => handleInputChange('autoSelect', e.target.checked)}
              />

              <NovaCheckbox
                label="Disabled"
                checked={formValues.disabled}
                onChange={e => handleInputChange('disabled', e.target.checked)}
              />

              <NovaCheckbox
                label="Hide dropdown button"
                checked={formValues.hideDropdownButton}
                onChange={e => handleInputChange('hideDropdownButton', e.target.checked)}
              />

              <NovaCheckbox
                label="Hide selection buttons"
                checked={formValues.hideSelectionButtons}
                onChange={e => handleInputChange('hideSelectionButtons', e.target.checked)}
              />

              <NovaCheckbox
                label="Inline"
                checked={formValues.inline}
                onChange={e => handleInputChange('inline', e.target.checked)}
              />

              <NovaCheckbox
                label="Invalid"
                checked={formValues.invalid}
                onChange={e => handleInputChange('invalid', e.target.checked)}
              />

              <NovaCheckbox
                label="Readonly"
                checked={formValues.readonly}
                onChange={e => handleInputChange('readonly', e.target.checked)}
              />

              <NovaCheckbox
                label="Required"
                checked={formValues.required}
                onChange={e => handleInputChange('required', e.target.checked)}
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
export default NovaMultiselectDemo;
/** !!! DELETE ME END !!! */
