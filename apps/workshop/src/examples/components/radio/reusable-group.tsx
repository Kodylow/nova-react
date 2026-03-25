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
import { Button, Checkbox, InputMessage, Label, Textarea, Typography, Utility } from '@visa/nova-react';
import { useId, useMemo, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaInput } from '../input/reusable';
// This is from the reusable radio component example. If copying this code please copy the component into your codebase.
import { NovaRadio } from './reusable';

// Radio Type
export interface Radio {
  description?: string;
  disabled?: boolean;
  label: string;
  panel?: boolean;
  value: string | number;
}

// Nova Radio Group Component Props
export interface NovaRadioGroupProps {
  alignEnd?: boolean;
  description?: string;
  disabled?: boolean;
  id?: string;
  inline?: boolean;
  invalid?: boolean;
  label?: string;
  message?: string;
  name?: string;
  onChange?: (value: string | number) => void;
  panel?: boolean;
  radios?: Radio[];
  required?: boolean;
  value?: string | number;
}

// Main Nova Radio Group Component
export const NovaRadioGroup = ({
  alignEnd = false,
  description,
  disabled = false,
  id: idProp,
  inline = true,
  invalid = false,
  label = '',
  message,
  name: nameProp,
  onChange,
  panel = false,
  radios = [],
  required = false,
  value,
}: NovaRadioGroupProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const name = nameProp ?? `${id}-radio`;

  // Calculate aria-labelledby for fieldset
  const fieldsetLabelledBy = useMemo(() => {
    const ids: string[] = [`${id}-legend`];
    if (description) ids.push(`${id}-description`);
    return ids.join(' ');
  }, [description, id]);

  return (
    <fieldset aria-labelledby={fieldsetLabelledBy}>
      <Typography id={`${id}-legend`} tag="legend" variant="label">
        {label}
        {required ? ' (required)' : ''}
      </Typography>

      {description && <InputMessage id={`${id}-description`}>{description}</InputMessage>}

      <div role="radiogroup" aria-required={required ? true : undefined}>
        <Utility vFlex vFlexCol={!inline} vGap={inline ? 24 : undefined}>
          {radios.map((radio, i) => (
            <NovaRadio
              key={`${id}-radio-${i}`}
              alignEnd={alignEnd}
              description={radio.description}
              disabled={disabled || radio.disabled}
              invalid={invalid}
              label={radio.label}
              name={name}
              onChange={e => onChange?.(e.target.value)}
              panel={panel || radio.panel}
              value={radio.value}
              checked={value === radio.value}
            />
          ))}
        </Utility>
      </div>

      <InputMessage
        aria-atomic={invalid ? true : undefined}
        aria-live={invalid ? 'assertive' : undefined}
        id={`${id}-message`}
      >
        {invalid && <VisaErrorTiny />}
        {message && message}
      </InputMessage>
    </fieldset>
  );
};

// export default NovaRadioGroup;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  alignEnd: boolean;
  description: string;
  disabled: boolean;
  errorMessage: string;
  inline: boolean;
  invalid: boolean;
  label: string;
  panel: boolean;
  radios: string;
  required: boolean;
}

// Demo Component
export const NovaRadioGroupDemo = () => {
  const radios: Radio[] = [
    {
      label: 'Label 1',
      value: 'value-1',
    },
    {
      label: 'Label 2',
      value: 'value-2',
    },
    {
      label: 'Label 3',
      value: 'value-3',
    },
  ];

  const defaultCustomizations: DemoCustomizations = {
    alignEnd: false,
    description: 'This is optional text that describes the label in more detail.',
    disabled: false,
    errorMessage: 'This is required text that describes the error in more detail.',
    inline: false,
    invalid: false,
    label: 'Group label',
    panel: false,
    radios: JSON.stringify(radios, null, 4),
    required: false,
  };

  const [customizations, setCustomizations] = useState<Omit<DemoCustomizations, 'radios'> & { radios: Radio[] }>({
    ...defaultCustomizations,
    radios,
  });

  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedRadios = JSON.parse(formValues.radios || '[]') as Radio[];
      setCustomizations({
        ...formValues,
        radios: parsedRadios,
      });
    } catch (error) {
      console.error('Invalid JSON for radios:', error);
    }
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations({
      ...defaultCustomizations,
      radios,
    });
  };

  return (
    <div>
      <NovaRadioGroup
        alignEnd={customizations.alignEnd}
        description={customizations.description || ''}
        disabled={customizations.disabled}
        inline={customizations.inline}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.invalid ? customizations.errorMessage : undefined}
        panel={customizations.panel}
        radios={customizations.radios}
        required={customizations.required}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                label="Label"
                onChange={e => handleInputChange('label', e.target.value)}
                value={formValues.label}
              />

              <NovaInput
                label="Description"
                onChange={e => handleInputChange('description', e.target.value)}
                value={formValues.description}
              />

              <NovaInput
                label="Error message"
                onChange={e => handleInputChange('errorMessage', e.target.value)}
                value={formValues.errorMessage}
              />

              <div>
                <Label htmlFor="radios-input">Radios</Label>
                <Textarea
                  fixed={false}
                  id="radios-input"
                  onChange={e => handleInputChange('radios', e.target.value)}
                  style={{ blockSize: '100px' }}
                  value={formValues.radios}
                />
              </div>

              <Label>
                <Checkbox
                  checked={formValues.alignEnd}
                  onChange={e => handleInputChange('alignEnd', e.target.checked)}
                />
                Align end
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.disabled}
                  onChange={e => handleInputChange('disabled', e.target.checked)}
                />
                Disabled
              </Label>

              <Label>
                <Checkbox checked={formValues.inline} onChange={e => handleInputChange('inline', e.target.checked)} />
                Inline
              </Label>

              <Label>
                <Checkbox checked={formValues.invalid} onChange={e => handleInputChange('invalid', e.target.checked)} />
                Invalid
              </Label>

              <Label>
                <Checkbox checked={formValues.panel} onChange={e => handleInputChange('panel', e.target.checked)} />
                Panel
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.required}
                  onChange={e => handleInputChange('required', e.target.checked)}
                />
                Required
              </Label>
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
export default NovaRadioGroupDemo;
/** !!! DELETE ME END !!! */
