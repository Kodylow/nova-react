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
import { VisaChevronDownTiny, VisaErrorTiny } from '@visa/nova-icons-react';
import { Button, InputContainer, InputMessage, Label, Select, Utility } from '@visa/nova-react';
import { useId, useState, type ComponentPropsWithoutRef, type ComponentPropsWithRef } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Select Option Type
export interface NovaSelectOption {
  disabled?: boolean;
  hidden?: boolean;
  label: string;
  value: ComponentPropsWithoutRef<'option'>['value'];
}

// Nova Select Component Props
export interface NovaSelectProps extends ComponentPropsWithRef<'select'> {
  disabled?: boolean;
  id?: string;
  inline?: boolean;
  invalid?: boolean;
  label?: string;
  message?: string;
  options?: NovaSelectOption[];
  readonly?: boolean;
  required?: boolean;
}

// Main Nova Select Component
export const NovaSelect = ({
  disabled = false,
  id: idProp,
  inline = false,
  invalid = false,
  label = '',
  message,
  onChange,
  options = [],
  readonly = false,
  required = false,
  value,
  ...remainingSelectProps
}: NovaSelectProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Utility vAlignItems={inline ? 'start' : undefined} vFlex vFlexCol={!inline} vFlexWrap vGap={4}>
      <Label
        htmlFor={`${id}-select`}
        id={`${id}-label`}
        style={
          inline
            ? {
                lineHeight: 'var(--v-input-container-block-size)',
                textWrap: 'nowrap',
              }
            : undefined
        }
      >
        {label} {required ? ' (required)' : ''}
      </Label>
      <Utility vFlex vFlexCol vFlexGrow vGap={4}>
        <InputContainer>
          <Select
            aria-describedby={`${id}-message`}
            aria-invalid={invalid}
            disabled={disabled || readonly}
            id={`${id}-select`}
            onChange={onChange}
            required={required}
            value={value}
            {...remainingSelectProps}
          >
            <option hidden></option>
            {options.map((option, i) => (
              <option
                key={`${id}-option-${option.value}-${i}`}
                disabled={readonly || disabled || option.disabled}
                hidden={option.hidden}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </Select>
          <VisaChevronDownTiny />
        </InputContainer>
        <InputMessage
          aria-atomic={invalid ? true : undefined}
          aria-live={invalid ? 'assertive' : undefined}
          id={`${id}-message`}
        >
          {invalid && <VisaErrorTiny />}
          {message && message}
        </InputMessage>
      </Utility>
    </Utility>
  );
};
// export default NovaSelect;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  disabled: boolean;
  errorMessage: string;
  inline: boolean;
  invalid: boolean;
  label: string;
  message: string;
  options: string;
  readonly: boolean;
  required: boolean;
}

// Demo Options
const demoOptions: NovaSelectOption[] = Array.from({ length: 5 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: i + 1,
}));

// Demo Component
export const NovaSelectDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    disabled: false,
    errorMessage: 'This is required text that describes the error in more detail.',
    inline: false,
    invalid: false,
    label: 'Label',
    message: 'This is optional text that describes the label in more detail.',
    options: JSON.stringify(demoOptions, null, 4),
    readonly: false,
    required: false,
  };

  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'options'> & { options: NovaSelectOption[] }
  >({
    ...defaultCustomizations,
    options: demoOptions,
  });

  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsedOptions = JSON.parse(formValues.options || '[]') as NovaSelectOption[];
      setCustomizations({
        ...formValues,
        options: parsedOptions,
      });
    } catch (error) {
      console.error('Invalid JSON for options:', error);
    }
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations({
      ...defaultCustomizations,
      options: demoOptions,
    });
  };

  return (
    <div>
      <NovaSelect
        disabled={customizations.disabled}
        inline={customizations.inline}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.invalid ? customizations.errorMessage : customizations.message}
        options={customizations.options}
        readonly={customizations.readonly}
        required={customizations.required}
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

              <NovaInput
                clearable
                label="Error message"
                onChange={e => handleInputChange('errorMessage', e.target.value)}
                value={formValues.errorMessage}
              />

              <NovaInput<'textarea'>
                blockSize="100px"
                clearable
                label="Options"
                onChange={e => handleInputChange('options', e.target.value)}
                resizable
                textarea
                value={formValues.options}
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
export default NovaSelectDemo;
/** !!! DELETE ME END !!! */
