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
  InputContainer,
  InputMessage,
  Label,
  Radio,
  RadioPanel,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import type { RadioProperties } from '@visa/nova-react';
import { useId, useMemo, useRef, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';

// Nova Radio Component Props
export type NovaRadioProps = RadioProperties & {
  alignEnd?: boolean;
  checked?: boolean;
  description?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  label?: string;
  message?: string;
  name: string;
  panel?: boolean;
  required?: boolean;
  value: string | number;
};

// Main Nova Radio Component
export const NovaRadio = ({
  alignEnd = false,
  checked = false,
  description,
  disabled = false,
  id: idProp,
  invalid = false,
  label = '',
  message,
  name,
  onChange,
  panel = false,
  required = false,
  value,
  ...remainingInputProps
}: NovaRadioProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const radioInputRef = useRef<HTMLInputElement>(null);

  // Calculate aria-describedby
  const inputDescribedBy = useMemo(() => {
    const ids: string[] = [];
    if (message) ids.push(`${id}-message`);
    if (description) ids.push(`${id}-description`);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [message, description, id]);

  // Handle click on panel
  const handlePanelClick = () => {
    if (!disabled && radioInputRef.current) {
      radioInputRef.current.click();
    }
  };

  const radioContent = (
    <UtilityFragment vAlignItems={panel && description ? 'start' : undefined} vFlex vFlexRowReverse={alignEnd}>
      <InputContainer>
        <Radio
          ref={radioInputRef}
          aria-describedby={inputDescribedBy}
          aria-required={required ? true : undefined}
          checked={checked}
          disabled={disabled}
          id={`${id}-input`}
          aria-invalid={invalid}
          name={name}
          onChange={onChange}
          required={required}
          type="radio"
          value={value}
          {...remainingInputProps}
        />
        <Utility vFlex vFlexCol vFlexGrow={alignEnd} vGap={2} vMarginVertical={8}>
          <Label htmlFor={`${id}-input`}>{label}</Label>
          {description && <InputMessage id={`${id}-description`}>{description}</InputMessage>}
        </Utility>
      </InputContainer>
    </UtilityFragment>
  );

  return (
    <>
      {panel ? <RadioPanel onClick={handlePanelClick}>{radioContent}</RadioPanel> : radioContent}

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

// export default NovaRadio;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  alignEnd: boolean;
  description: string;
  disabled: boolean;
  errorMessage: string;
  invalid: boolean;
  label: string;
  panel: boolean;
  required: boolean;
}

// Demo Component
export const NovaRadioDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    alignEnd: false,
    description: 'This is optional text that describes the label in more detail.',
    disabled: false,
    errorMessage: 'This is required text that describes the error in more detail.',
    invalid: false,
    label: 'Label',
    panel: false,
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
      <NovaRadio
        alignEnd={customizations.alignEnd}
        description={customizations.description || ''}
        disabled={customizations.disabled}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.invalid ? customizations.errorMessage : undefined}
        name="radio-demo"
        panel={customizations.panel}
        required={customizations.required}
        value="radio-value"
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
                label="Align end"
                checked={formValues.alignEnd}
                onChange={e => handleInputChange('alignEnd', e.target.checked)}
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
                label="Panel"
                checked={formValues.panel}
                onChange={e => handleInputChange('panel', e.target.checked)}
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
export default NovaRadioDemo;
/** !!! DELETE ME END !!! */
