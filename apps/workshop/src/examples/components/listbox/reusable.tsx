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
import { VisaErrorTiny } from '@visa/nova-icons-react';
import {
  Button,
  Checkbox,
  InputMessage,
  Label,
  Listbox,
  ListboxContainer,
  ListboxItem,
  Radio,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Types
export interface ListboxOption {
  disabled?: boolean;
  label: string;
  value: number | string;
}

export type ListboxValue = number | string | (number | string)[];

// Nova Listbox Component Props
export interface NovaListboxProps {
  autoSelect?: boolean;
  containHeight?: boolean;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  label?: string;
  message?: string;
  multiselect?: boolean;
  onChange?: (value: ListboxValue) => void;
  options?: ListboxOption[];
  value?: ListboxValue;
}

// Main Nova Listbox Component
export const NovaListbox = ({
  autoSelect = false,
  containHeight = true,
  disabled = false,
  id: idProp,
  invalid = false,
  label = '',
  message,
  multiselect = false,
  onChange,
  options = [],
  value: valueProp,
  ...remainingProps
}: NovaListboxProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  // Initialize state based on multiselect mode
  const [value, setValue] = useState<ListboxValue>(() => {
    if (valueProp !== undefined) {
      return valueProp;
    }
    return multiselect ? [] : '';
  });

  // Sync internal value with prop value
  useEffect(() => {
    if (valueProp !== undefined) {
      setValue(valueProp);
    }
  }, [valueProp]);

  // Adjust value type if multiselect mode changes
  useEffect(() => {
    const isArray = Array.isArray(value);
    if (multiselect && !isArray) {
      const newValue = value ? [value] : [];
      setValue(newValue);
      onChange?.(newValue);
    } else if (!multiselect && isArray) {
      const newValue = value[0] ?? '';
      setValue(newValue);
      onChange?.(newValue);
    }
  }, [multiselect, value, onChange]);

  // Auto-select first enabled option if autoSelect is true
  useEffect(() => {
    if (autoSelect && options.length > 0 && !value) {
      const firstEnabledOption = options.find(opt => !opt.disabled);
      if (firstEnabledOption) {
        const newValue = multiselect ? [firstEnabledOption.value] : firstEnabledOption.value;
        setValue(newValue);
        onChange?.(newValue);
      }
    }
  }, [autoSelect, options, multiselect, value, onChange]);

  // Calculate aria-describedby
  const listboxDescribedBy = useMemo(() => {
    const labelId = `${id}-label`;
    const messageId = message ? `${id}-message` : null;
    return [labelId, messageId].filter(Boolean).join(' ');
  }, [id, message]);

  const handleSingleSelect = (optionValue: number | string) => {
    if (disabled) return;
    setValue(optionValue);
    onChange?.(optionValue);
  };

  const handleMultiSelect = (optionValue: number | string, checked: boolean) => {
    if (disabled) return;
    const currentValues = Array.isArray(value) ? value : [];
    const newValue = checked ? [...currentValues, optionValue] : currentValues.filter(v => v !== optionValue);
    setValue(newValue);
    onChange?.(newValue);
  };

  const isSelected = (optionValue: number | string): boolean => {
    if (multiselect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <fieldset aria-invalid={invalid}>
      <Label id={`${id}-label`} tag="legend" htmlFor={`${id}-listbox-container`}>
        {label}
      </Label>
      <ListboxContainer id={`${id}-listbox-container`} error={invalid}>
        <Listbox
          aria-invalid={invalid}
          aria-labelledby={listboxDescribedBy}
          id={`${id}-listbox`}
          scroll={containHeight}
          tag="div"
          {...remainingProps}
        >
          {options.map((option, index) => (
            <ListboxItem<'label'>
              key={`${id}-option-${option.value}`}
              htmlFor={`${id}-option-${index}`}
              tag="label"
              aria-disabled={option.disabled}
            >
              {multiselect ? (
                <Checkbox
                  checked={isSelected(option.value)}
                  className="v-flex-shrink-0"
                  disabled={disabled || option.disabled}
                  id={`${id}-option-${index}`}
                  name={`${id}-option-${index}`}
                  onChange={e => handleMultiSelect(option.value, e.target.checked)}
                />
              ) : (
                <Radio
                  checked={isSelected(option.value)}
                  className="v-flex-shrink-0"
                  disabled={disabled || option.disabled}
                  id={`${id}-option-${index}`}
                  name={`${id}-options`}
                  onChange={() => handleSingleSelect(option.value)}
                />
              )}
              <Label tag="span">{option.label}</Label>
            </ListboxItem>
          ))}
        </Listbox>
      </ListboxContainer>
      <UtilityFragment vMarginTop={4}>
        <InputMessage
          id={`${id}-message`}
          role={invalid ? 'alert' : undefined}
          aria-live={invalid ? 'polite' : undefined}
          aria-atomic={invalid ? true : undefined}
        >
          {invalid && message && <VisaErrorTiny />}
          {message && message}
        </InputMessage>
      </UtilityFragment>
    </fieldset>
  );
};

// export default NovaListbox;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  autoSelect: boolean;
  containHeight: boolean;
  disabled: boolean;
  invalid: boolean;
  label: string;
  message: string;
  multiselect: boolean;
  options: string;
}

const demoOptions: ListboxOption[] = Array.from({ length: 5 }, (_, i) => ({
  label: `Item ${String.fromCharCode('A'.charCodeAt(0) + i)}`,
  value: `option-${i + 1}`,
}));

// Demo Component
export const NovaListboxDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    autoSelect: false,
    containHeight: true,
    disabled: false,
    invalid: false,
    label: 'Label (required)',
    message: 'This is optional text that describes the label in more detail.',
    multiselect: false,
    options: JSON.stringify(demoOptions, null, 4),
  };

  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'options'> & { options: ListboxOption[] }
  >({
    ...defaultCustomizations,
    options: demoOptions,
  });

  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);
  const [selectedValue, setSelectedValue] = useState<ListboxValue>('');

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedOptions = JSON.parse(formValues.options || '[]') as ListboxOption[];
      setCustomizations({
        ...formValues,
        options: parsedOptions,
      });
      // Reset selected value when applying changes
      setSelectedValue(formValues.multiselect ? [] : '');
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
    setSelectedValue('');
  };

  return (
    <div>
      <NovaListbox
        autoSelect={customizations.autoSelect}
        containHeight={customizations.containHeight}
        disabled={customizations.disabled}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.message || ''}
        multiselect={customizations.multiselect}
        onChange={setSelectedValue}
        options={customizations.options}
        value={selectedValue}
      />

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
                label="Message"
                onChange={e => handleInputChange('message', e.target.value)}
                value={formValues.message}
              />

              <NovaInput<'textarea'>
                fixed={false}
                label="Options"
                onChange={e => handleInputChange('options', e.target.value)}
                style={{ blockSize: '100px' }}
                textarea
                value={formValues.options}
              />

              <NovaCheckbox
                label="Auto select"
                checked={formValues.autoSelect}
                onChange={e => handleInputChange('autoSelect', e.target.checked)}
              />

              <NovaCheckbox
                label="Contain height"
                checked={formValues.containHeight}
                onChange={e => handleInputChange('containHeight', e.target.checked)}
              />

              <NovaCheckbox
                label="Disabled"
                checked={formValues.disabled}
                onChange={e => handleInputChange('disabled', e.target.checked)}
              />

              <NovaCheckbox
                label="Invalid"
                checked={formValues.invalid}
                onChange={e => handleInputChange('invalid', e.target.checked)}
              />

              <NovaCheckbox
                label="Multiselect"
                checked={formValues.multiselect}
                onChange={e => handleInputChange('multiselect', e.target.checked)}
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
export default NovaListboxDemo;
/** !!! DELETE ME END !!! */
