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
  VisaAccountLow,
  VisaCheckmarkLow,
  VisaClearAltTiny,
  VisaErrorTiny,
  VisaPasswordHideTiny,
  VisaPasswordShowTiny,
} from '@visa/nova-icons-react';
import {
  Button,
  Checkbox,
  Input,
  InputContainer,
  InputMessage,
  type InputProperties,
  Label,
  Textarea,
  type TextAreaProperties,
  Typography,
  Utility,
} from '@visa/nova-react';
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ElementType,
  type FocusEvent,
  type ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NovaAccordion } from '../accordion/reusable';

type InheritedProps<ET extends ElementType> = ET extends 'input'
  ? InputProperties<'input'>
  : ET extends 'textarea'
    ? TextAreaProperties<'textarea'>
    : ComponentPropsWithRef<ET>;

// Nova Input Component Props
export type NovaInputProps<ET extends ElementType = 'input'> = InheritedProps<ET> & {
  blockSize?: string;
  clearable?: boolean;
  inline?: boolean;
  invalid?: boolean;
  label?: string;
  maskable?: boolean;
  message?: string;
  otp?: boolean;
  prefix?: string;
  prefixIcon?: ReactNode;
  readonly?: boolean;
  required?: boolean;
  resizable?: boolean;
  step?: number;
  suffix?: string;
  suffixIcon?: ReactNode;
  textarea?: boolean;
};

// Main Nova Input Component
export const NovaInput = <ET extends ElementType = 'input'>({
  blockSize = 'var(--v-input-container-block-size)',
  clearable = false,
  disabled = false,
  id: idProp,
  inline = false,
  invalid = false,
  label = '',
  maskable = false,
  message,
  otp = false,
  placeholder,
  prefix,
  prefixIcon,
  readonly = false,
  required = false,
  resizable = true,
  step,
  suffix,
  suffixIcon,
  textarea = false,
  type: typeProp,
  value: controlledValue,
  onChange,
  ...remainingInputProps
}: NovaInputProps<ET>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [internalValue, setInternalValue] = useState('');
  const [inFocus, setInFocus] = useState(false);
  const [masked, setMasked] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Determine the input type
  const inputType = useMemo(() => {
    if (typeProp) return typeProp;
    if (!maskable) return 'text';
    return masked ? 'password' : 'text';
  }, [typeProp, maskable, masked]);

  // Calculate aria-describedby
  const inputDescribedBy = useMemo(() => {
    const ids: string[] = [];
    if (message) ids.push(`${id}-message`);
    if (prefix) ids.push(`${id}-prefix`);
    if (suffix) ids.push(`${id}-suffix`);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [message, prefix, suffix, id]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(event as ChangeEvent<HTMLInputElement>);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (
      relatedTarget !== buttonRef.current &&
      relatedTarget !== inputRef.current &&
      relatedTarget !== textareaRef.current &&
      !event.currentTarget.contains(relatedTarget)
    ) {
      setInFocus(false);
    }
  };

  const handleClear = () => {
    handleInputChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    if (textarea) {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleToggleMask = () => {
    setMasked(prev => !prev);
  };

  const showClearButton = value && value.length > 0 && inFocus && clearable;

  return (
    <Utility
      vAlignItems={inline ? 'start' : undefined}
      vFlex
      vFlexCol={!inline}
      vFlexRow={inline}
      vFlexWrap={inline}
      vGap={4}
    >
      <Label htmlFor={`${id}-input`} style={inline ? { lineHeight: 'var(--v-input-container-block-size)' } : undefined}>
        {label} {required ? ' (required)' : ''}
      </Label>
      <Utility vFlex vFlexCol vFlexGrow vGap={4}>
        <InputContainer
          onBlur={handleBlur}
          onFocus={() => setInFocus(true)}
          style={otp ? { inlineSize: '160px' } : undefined}
        >
          {prefixIcon}
          {prefix && (
            <Typography className="v-typography-body-2-bold" id={`${id}-prefix`} tag="span">
              {prefix}
            </Typography>
          )}

          {textarea ? (
            <Textarea
              ref={textareaRef}
              aria-describedby={inputDescribedBy}
              aria-invalid={invalid}
              disabled={disabled}
              fixed={!resizable}
              id={`${id}-input`}
              onChange={handleInputChange}
              placeholder={placeholder}
              readOnly={readonly}
              required={required}
              style={{ blockSize }}
              value={value}
              {...remainingInputProps}
            />
          ) : (
            <Input
              ref={inputRef}
              aria-describedby={inputDescribedBy}
              aria-invalid={invalid}
              disabled={disabled}
              id={`${id}-input`}
              onChange={handleInputChange}
              otp={otp}
              placeholder={placeholder}
              readOnly={readonly}
              required={required}
              step={step}
              type={inputType}
              value={value}
              {...remainingInputProps}
            />
          )}

          {showClearButton && (
            <Button
              aria-label="clear"
              ref={buttonRef}
              buttonSize="small"
              colorScheme="tertiary"
              disabled={disabled}
              iconButton
              onClick={handleClear}
              subtle
            >
              <VisaClearAltTiny />
            </Button>
          )}

          {suffix && (
            <Typography className="v-typography-body-2-bold" id={`${id}-suffix`} tag="span">
              {suffix}
            </Typography>
          )}

          {maskable && (
            <Button
              aria-label={masked ? 'show password' : 'hide password'}
              buttonSize="small"
              colorScheme="tertiary"
              disabled={disabled}
              iconButton
              onClick={handleToggleMask}
            >
              {masked ? <VisaPasswordShowTiny /> : <VisaPasswordHideTiny />}
            </Button>
          )}

          {suffixIcon}
        </InputContainer>

        {message && (
          <InputMessage aria-atomic={invalid} aria-live={invalid ? 'assertive' : undefined} id={`${id}-message`}>
            {invalid && <VisaErrorTiny />}
            {message}
          </InputMessage>
        )}
      </Utility>
    </Utility>
  );
};

// export default NovaInput;

/* !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  clearable: boolean;
  disabled: boolean;
  errorMessage: string;
  inline: boolean;
  invalid: boolean;
  label: string;
  maskable: boolean;
  message: string;
  otp: boolean;
  placeholder: string;
  readonly: boolean;
  required: boolean;
  showLeadingIcon: boolean;
  showPrefix: boolean;
  showTrailingIcon: boolean;
  showSuffix: boolean;
}

// Demo Component
export const NovaInputDemo = () => {
  const defaultCustomizations: DemoCustomizations = {
    clearable: false,
    disabled: false,
    errorMessage: 'This is required text that describes the error in more detail.',
    inline: false,
    invalid: false,
    label: 'Label',
    maskable: false,
    message: 'This is optional text that describes the label in more detail.',
    otp: false,
    placeholder: '',
    readonly: false,
    required: false,
    showLeadingIcon: false,
    showPrefix: false,
    showTrailingIcon: false,
    showSuffix: false,
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
      <NovaInput
        clearable={customizations.clearable}
        disabled={customizations.disabled}
        inline={customizations.inline}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        maskable={customizations.maskable}
        message={customizations.invalid ? customizations.errorMessage : customizations.message}
        otp={customizations.otp}
        placeholder={customizations.placeholder || ''}
        prefix={customizations.showPrefix ? '$' : ''}
        prefixIcon={customizations.showLeadingIcon ? <VisaAccountLow /> : undefined}
        readonly={customizations.readonly}
        required={customizations.required}
        suffix={customizations.showSuffix ? ' %' : ''}
        suffixIcon={customizations.showTrailingIcon ? <VisaCheckmarkLow /> : undefined}
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
                label="Message"
                onChange={e => handleInputChange('message', e.target.value)}
                value={formValues.message}
              />

              <NovaInput
                label="Error message"
                onChange={e => handleInputChange('errorMessage', e.target.value)}
                value={formValues.errorMessage}
              />

              <Label>
                <Checkbox
                  checked={formValues.clearable}
                  onChange={e => handleInputChange('clearable', e.target.checked)}
                />
                Clearable
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
                <Checkbox
                  checked={formValues.maskable}
                  onChange={e => handleInputChange('maskable', e.target.checked)}
                />
                Maskable
              </Label>

              <Label>
                <Checkbox checked={formValues.otp} onChange={e => handleInputChange('otp', e.target.checked)} />
                OTP
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.readonly}
                  onChange={e => handleInputChange('readonly', e.target.checked)}
                />
                Readonly
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.required}
                  onChange={e => handleInputChange('required', e.target.checked)}
                />
                Required
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.showLeadingIcon}
                  onChange={e => handleInputChange('showLeadingIcon', e.target.checked)}
                />
                Show leading icon
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.showPrefix}
                  onChange={e => handleInputChange('showPrefix', e.target.checked)}
                />
                Show prefix
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.showSuffix}
                  onChange={e => handleInputChange('showSuffix', e.target.checked)}
                />
                Show suffix
              </Label>

              <Label>
                <Checkbox
                  checked={formValues.showTrailingIcon}
                  onChange={e => handleInputChange('showTrailingIcon', e.target.checked)}
                />
                Show trailing icon
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
export default NovaInputDemo;
/** !!! DELETE ME END !!! */
