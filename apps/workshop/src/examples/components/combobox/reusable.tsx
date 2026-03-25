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
  VisaChevronDownTiny,
  VisaChevronUpTiny,
  VisaClearAltTiny,
  VisaErrorTiny,
  VisaSearchLow,
} from '@visa/nova-icons-react';
import {
  Button,
  Combobox,
  DropdownContainer,
  Input,
  InputContainer,
  InputMessage,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
  Radio,
  Typography,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { type UseComboboxState, type UseComboboxStateChangeOptions, useCombobox } from 'downshift';
import { type FocusEvent, type ReactNode, useId, useMemo, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Types
export interface ComboboxOption<T = string> {
  disabled?: boolean;
  label: string;
  value: T;
}

// Nova Combobox Component Props
export interface NovaComboboxProps<T = string> {
  autoSelect?: boolean;
  clearable?: boolean;
  description?: string;
  disabled?: boolean;
  filterable?: boolean;
  hideToggleButton?: boolean;
  id?: string;
  invalid?: boolean;
  label?: string;
  leadingIcon?: ReactNode;
  message?: string;
  onChange?: (value: T | null) => void;
  options?: ComboboxOption<T>[];
  readonly?: boolean;
  required?: boolean;
  value?: T | null;
}

// Item to string converter
const itemToString = <T,>(item: ComboboxOption<T> | null) => (item ? item.label : '');

// State reducer to prevent mouse hover selection
const stateReducer = <ItemType,>(
  state: UseComboboxState<ItemType>,
  { type, changes }: UseComboboxStateChangeOptions<ItemType>
) =>
  type === useCombobox.stateChangeTypes.ItemMouseMove || type === useCombobox.stateChangeTypes.MenuMouseLeave
    ? {
        ...changes,
        highlightedIndex: state.highlightedIndex,
      }
    : changes;

// Main Nova Combobox Component
export const NovaCombobox = <T = string,>({
  autoSelect = false,
  clearable = false,
  description,
  disabled = false,
  filterable = false,
  hideToggleButton = false,
  id: idProp,
  invalid = false,
  label = '',
  leadingIcon,
  message,
  onChange,
  options = [],
  readonly = false,
  required = false,
  value: valueProp,
  ...remainingProps
}: NovaComboboxProps<T>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [focused, setFocused] = useState(false);
  const [items, setItems] = useState(options);

  // Find initial item from value prop
  const initialItem = useMemo(
    () => (valueProp !== null && valueProp !== undefined ? options.find(opt => opt.value === valueProp) || null : null),
    [valueProp, options]
  );

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen,
    selectItem,
    selectedItem,
    setHighlightedIndex,
  } = useCombobox({
    id: `${id}-combobox`,
    items,
    itemToString,
    ...(initialItem && { initialSelectedItem: initialItem }),
    stateReducer,
    isItemDisabled: item => item.disabled || false,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      if (filterable && newInputValue !== undefined) {
        const filtered = options.filter(item => item.label.toLowerCase().includes(newInputValue.toLowerCase()));
        setItems(filtered);
        if (autoSelect && newInputValue) {
          setHighlightedIndex(0);
        }
      }
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      onChange?.(newSelectedItem?.value ?? null);
    },
  });

  const { id: listboxId, ...listboxProps } = getMenuProps();

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };

  const onClear = () => {
    selectItem(null);
    onChange?.(null);
  };

  const showClearButton = clearable && inputValue.length > 0 && focused && !readonly && !disabled;
  const resultsFound = items.length > 0;
  const showInlineMessage = description && !isOpen && !invalid;
  const showErrorMessage = invalid && message && !isOpen;

  // Calculate aria-describedby
  const inputDescribedBy = useMemo(() => {
    const ids: string[] = [];
    if (description) ids.push(`${id}-description`);
    if (message) ids.push(`${id}-message`);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [id, description, message]);

  return (
    <Combobox>
      <UtilityFragment vFlex vFlexCol vGap={4}>
        <DropdownContainer>
          <Label {...getLabelProps()}>
            {label}
            {required ? ' (required)' : ''}
          </Label>
          <UtilityFragment vFlexRow>
            <InputContainer
              onBlur={handleBlur}
              onFocus={() => {
                setFocused(true);
              }}
            >
              {leadingIcon}
              <Input
                aria-describedby={inputDescribedBy}
                aria-haspopup="listbox"
                aria-invalid={invalid}
                disabled={disabled}
                name={`${id}-input`}
                type="text"
                {...getInputProps({
                  'aria-expanded': isOpen,
                  'aria-owns': listboxId,
                  ...(filterable && { 'aria-autocomplete': 'list' as const }),
                  ...(readonly && { readOnly: true }),
                })}
                {...remainingProps}
              />
              {showClearButton && (
                <Button
                  aria-label="clear"
                  buttonSize="small"
                  colorScheme="tertiary"
                  iconButton
                  onClick={onClear}
                  subtle
                >
                  <VisaClearAltTiny />
                </Button>
              )}
              {!hideToggleButton && (
                <Button
                  aria-label="expand"
                  buttonSize="small"
                  colorScheme="tertiary"
                  iconButton
                  disabled={readonly || disabled}
                  {...getToggleButtonProps()}
                >
                  {isOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />}
                </Button>
              )}
            </InputContainer>
          </UtilityFragment>
          {showInlineMessage && <InputMessage id={`${id}-description`}>{description}</InputMessage>}
          {showErrorMessage && (
            <InputMessage aria-atomic="true" aria-live="assertive" id={`${id}-message`} role="alert">
              <VisaErrorTiny />
              {message}
            </InputMessage>
          )}
        </DropdownContainer>
      </UtilityFragment>
      <ListboxContainer>
        <Listbox id={listboxId} {...listboxProps}>
          {resultsFound ? (
            items.map((item, index) => (
              <ListboxItem
                key={`${id}-item-${index}`}
                className={highlightedIndex === index ? 'v-listbox-item-highlighted' : ''}
                {...getItemProps({
                  index,
                  item,
                  'aria-selected': selectedItem?.value === item.value,
                  'aria-disabled': item.disabled,
                })}
              >
                <UtilityFragment vFlexShrink0>
                  <Radio tag="span" />
                </UtilityFragment>
                {item.label}
              </ListboxItem>
            ))
          ) : (
            <UtilityFragment vFlex vJustifyContent="center" vPaddingVertical={8}>
              <li>
                <Typography variant="label-large">No results found.</Typography>
              </li>
            </UtilityFragment>
          )}
        </Listbox>
      </ListboxContainer>
    </Combobox>
  );
};

// export default NovaCombobox;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  autoSelect: boolean;
  clearable: boolean;
  description: string;
  disabled: boolean;
  filterable: boolean;
  hideToggleButton: boolean;
  invalid: boolean;
  label: string;
  leadingIcon: boolean;
  message: string;
  options: string;
  readonly: boolean;
  required: boolean;
}

const demoOptions: ComboboxOption[] = [
  { label: 'Option A', value: 'option-a' },
  { label: 'Option B', value: 'option-b' },
  { label: 'Option C', value: 'option-c', disabled: true },
  { label: 'Option D', value: 'option-d' },
  { label: 'Option E', value: 'option-e' },
];

// Demo Component
export const NovaComboboxDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    autoSelect: false,
    clearable: false,
    description: 'This is optional text that describes the label in more detail.',
    disabled: false,
    filterable: false,
    hideToggleButton: false,
    invalid: false,
    label: 'Label',
    leadingIcon: false,
    message: 'This is required text that describes the error in more detail.',
    options: JSON.stringify(demoOptions, null, 2),
    readonly: false,
    required: false,
  };

  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'options'> & { options: ComboboxOption[] }
  >({
    ...defaultCustomizations,
    options: demoOptions,
  });

  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedOptions = JSON.parse(formValues.options || '[]') as ComboboxOption[];
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
    setSelectedValue(null);
  };

  return (
    <div>
      <NovaCombobox
        autoSelect={customizations.autoSelect}
        clearable={customizations.clearable}
        description={customizations.description || ''}
        disabled={customizations.disabled}
        filterable={customizations.filterable}
        hideToggleButton={customizations.hideToggleButton}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        leadingIcon={customizations.leadingIcon ? <VisaSearchLow /> : undefined}
        message={customizations.invalid ? customizations.message : undefined}
        onChange={setSelectedValue}
        options={customizations.options}
        readonly={customizations.readonly}
        required={customizations.required}
        value={selectedValue}
      />

      <div style={{ marginTop: '24px' }}>
        <Typography variant="body-2" tag="p">
          Selected value: {selectedValue || 'None'}
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
                checked={formValues.autoSelect}
                label="Auto select (with filterable)"
                onChange={e => handleInputChange('autoSelect', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.clearable}
                label="Clearable"
                onChange={e => handleInputChange('clearable', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.disabled}
                label="Disabled"
                onChange={e => handleInputChange('disabled', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.filterable}
                label="Filterable"
                onChange={e => handleInputChange('filterable', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.hideToggleButton}
                label="Hide toggle button"
                onChange={e => handleInputChange('hideToggleButton', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.invalid}
                label="Invalid"
                onChange={e => handleInputChange('invalid', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.leadingIcon}
                label="Leading icon"
                onChange={e => handleInputChange('leadingIcon', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.readonly}
                label="Readonly"
                onChange={e => handleInputChange('readonly', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.required}
                label="Required"
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
export default NovaComboboxDemo;
/** !!! DELETE ME END !!! */
