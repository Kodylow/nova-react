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
import { Button, InputMessage, Switch, SwitchLabel, Typography, Utility, UtilityFragment } from '@visa/nova-react';
import { type ComponentPropsWithRef, useId, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Nova Switch Component Props
export type NovaSwitchProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  alignStart?: boolean;
  description?: string;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  message?: string;
  required?: boolean;
};

// Main Nova Switch Component
export const NovaSwitch = ({
  alignStart = false,
  checked = false,
  description,
  disabled = false,
  id: idProp,
  invalid = false,
  label = '',
  message,
  onChange,
  required = false,
  ...remainingInputProps
}: NovaSwitchProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  // Calculate aria-describedby
  const inputDescribedBy =
    message || description
      ? [message ? `${id}-message` : '', description ? `${id}-description` : ''].filter(Boolean).join(' ')
      : undefined;

  const switchInput = (
    <Switch
      aria-describedby={inputDescribedBy}
      aria-required={required ? true : undefined}
      checked={checked}
      disabled={disabled}
      id={`${id}-input`}
      aria-invalid={invalid}
      onChange={onChange}
      required={required}
      type="checkbox"
      {...remainingInputProps}
    />
  );

  return (
    <>
      <Utility
        vAlignItems="center"
        vFlex
        style={{ flexBasis: 'min-content' }}
        vFlexWrap
        vGap={10}
        vJustifyContent="between"
        vMargin={8}
      >
        {alignStart && switchInput}
        <Utility vFlex style={{ flexBasis: 'min-content' }} vFlexCol vFlexGrow vGap={2} vMarginTop={2}>
          <SwitchLabel className="v-typography-label-large" htmlFor={`${id}-input`}>
            {label}
            {required ? ' (required)' : ''}
          </SwitchLabel>
          {description && (
            <Typography variant="body-3" id={`${id}-description`} tag="span">
              {description}
            </Typography>
          )}
        </Utility>
        {!alignStart && switchInput}
      </Utility>

      <UtilityFragment vMarginTop={4}>
        <InputMessage
          aria-atomic={invalid ? true : undefined}
          aria-live={invalid ? 'assertive' : undefined}
          id={`${id}-message`}
        >
          {invalid && message && <VisaErrorTiny />}
          {message && message}
        </InputMessage>
      </UtilityFragment>
    </>
  );
};

// export default NovaSwitch;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  alignStart: boolean;
  description: string;
  disabled: boolean;
  errorMessage: string;
  invalid: boolean;
  label: string;
  required: boolean;
}

// Demo Component
const NovaSwitchDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    alignStart: false,
    description: 'This is optional text that describes the label in more detail.',
    disabled: false,
    errorMessage: 'This is required text that describes the error in more detail.',
    invalid: false,
    label: 'Label',
    required: false,
  };

  const [customizations, setCustomizations] = useState<DemoCustomizations>(defaultCustomizations);
  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
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
      <NovaSwitch
        alignStart={customizations.alignStart}
        description={customizations.description || ''}
        disabled={customizations.disabled}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.invalid ? customizations.errorMessage : undefined}
        required={customizations.required}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                label="Description"
                onChange={e => handleInputChange('description', e.target.value)}
                value={formValues.description}
              />

              <NovaInput
                label="Label"
                onChange={e => handleInputChange('label', e.target.value)}
                value={formValues.label}
              />

              <NovaInput
                label="Error message"
                onChange={e => handleInputChange('errorMessage', e.target.value)}
                value={formValues.errorMessage}
              />

              <NovaCheckbox
                label="Align start"
                checked={formValues.alignStart}
                onChange={e => handleInputChange('alignStart', e.target.checked)}
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
export default NovaSwitchDemo;
/** !!! DELETE ME END !!! */
