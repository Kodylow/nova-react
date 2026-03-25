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
import { Button, InputMessage, Typography, Utility } from '@visa/nova-react';
import { useId, useMemo, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaInput } from '../input/reusable';
import { NovaCheckbox } from './reusable';

// Checkbox Group Type
export interface CheckboxGroup {
  checked?: boolean;
  children?: CheckboxGroup[];
  description?: string;
  disabled?: boolean;
  label: string;
}

// Nova Checkbox Group Component Props
export interface NovaCheckboxGroupProps {
  checkboxes?: CheckboxGroup[];
  description?: string;
  disabled?: boolean;
  id?: string;
  inline?: boolean;
  invalid?: boolean;
  label?: string;
  message?: string;
  onCheckboxesChange?: (checkboxes: CheckboxGroup[]) => void;
  panel?: boolean;
  required?: boolean;
  root?: boolean;
}

// Main Nova Checkbox Group Component
export const NovaCheckboxGroup = ({
  checkboxes: checkboxesProp = [],
  description,
  disabled = false,
  id: idProp,
  inline = false,
  invalid = false,
  label = '',
  message,
  onCheckboxesChange,
  panel = false,
  required = false,
  root = true,
}: NovaCheckboxGroupProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [checkboxes, setCheckboxes] = useState<CheckboxGroup[]>(checkboxesProp);

  // Update internal state when prop changes
  useMemo(() => {
    setCheckboxes(checkboxesProp);
  }, [checkboxesProp]);

  // Calculate aria-labelledby for fieldset
  const fieldsetLabelledBy = useMemo(() => {
    const ids: string[] = [`${id}-legend`];
    if (description) ids.push(`${id}-description`);
    return ids.join(' ');
  }, [description, id]);

  // Helper: Check if all children are checked
  const getChecked = (group: CheckboxGroup): boolean => {
    const { children } = group;
    if (!children?.length) return !!group.checked;
    return children.every(c => c.checked);
  };

  // Helper: Check if should be indeterminate
  const getIndeterminate = (group: CheckboxGroup, everyChecked: boolean): boolean => {
    const { children } = group;
    if (!children?.length) return false;
    return children.some(c => c.checked || recursivelyLookForCheckedChildren(c.children)) && !everyChecked;
  };

  // Helper: Recursively look for checked children
  const recursivelyLookForCheckedChildren = (children?: CheckboxGroup[]): boolean => {
    if (!children?.length) return false;
    for (const child of children) {
      if (child.checked) {
        return true;
      }
      if (child.children?.length) {
        if (recursivelyLookForCheckedChildren(child.children)) {
          return true;
        }
      }
    }
    return false;
  };

  // Helper: Update all children recursively
  const updateChildrenRecursively = (children: CheckboxGroup[], checked: boolean): CheckboxGroup[] => {
    return children.map(child => ({
      ...child,
      checked,
      children: child.children?.length ? updateChildrenRecursively(child.children, checked) : child.children,
    }));
  };

  // Event: Handle checkbox change
  const handleCheckChange = (checked: boolean, index: number) => {
    const newCheckboxes = [...checkboxes];
    const box = newCheckboxes[index];
    box.checked = checked;
    if (box.children?.length) {
      box.children = updateChildrenRecursively(box.children, checked);
    }
    setCheckboxes(newCheckboxes);
    onCheckboxesChange?.(newCheckboxes);
  };

  // Event: Handle nested group change
  const handleGroupChange = (newGroup: CheckboxGroup[], groupIndex: number) => {
    const newCheckboxes = [...checkboxes];
    const group = newCheckboxes[groupIndex];
    if (group) {
      group.children = [...newGroup];
      // Update parent's checked state based on children
      group.checked = newGroup.every(c => c.checked);
    }
    setCheckboxes(newCheckboxes);
    onCheckboxesChange?.(newCheckboxes);
  };

  // Render checkbox list content
  const checkboxContent = (
    <Utility tag={'ul'} vFlex vFlexCol={!inline} vMarginLeft={root ? undefined : 32}>
      {checkboxes.map((checkbox, i) => {
        const hasChildren = checkbox?.children?.length;
        const everythingChecked = getChecked(checkbox);
        const indeterminate = getIndeterminate(checkbox, everythingChecked);

        return (
          <li key={`${id}-checkbox-${i}`}>
            <Utility vFlex vFlexCol>
              <NovaCheckbox
                checked={(!indeterminate && checkbox.checked) || (hasChildren ? everythingChecked : false)}
                disabled={disabled || checkbox.disabled}
                indeterminate={hasChildren ? indeterminate : false}
                invalid={invalid}
                label={checkbox.label}
                onChange={e => handleCheckChange(e.target.checked, i)}
                panel={panel}
              />
              {hasChildren && (
                <NovaCheckboxGroup
                  checkboxes={checkbox.children!}
                  disabled={disabled || checkbox.disabled}
                  id={`${id}-checkbox-${i}-group`}
                  invalid={invalid}
                  onCheckboxesChange={newGroup => handleGroupChange(newGroup, i)}
                  panel={panel}
                  root={false}
                />
              )}
            </Utility>
          </li>
        );
      })}
    </Utility>
  );

  if (!root) return checkboxContent;

  return (
    <fieldset aria-labelledby={fieldsetLabelledBy}>
      <Typography id={`${id}-legend`} tag="legend" variant="label-large">
        {label}
        {required ? ' (required)' : ''}
      </Typography>

      {description && <InputMessage id={`${id}-description`}>{description}</InputMessage>}

      {checkboxContent}

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

// export default NovaCheckboxGroup;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  checkboxes: string;
  description: string;
  disabled: boolean;
  errorMessage: string;
  inline: boolean;
  invalid: boolean;
  label: string;
  panel: boolean;
  required: boolean;
}

// Demo Component
export const NovaCheckboxGroupDemo = () => {
  const checkboxes: CheckboxGroup[] = [
    {
      description: 'This is optional text that describes the label in more detail.',
      checked: false,
      label: 'L1 label 1',
    },
    {
      checked: false,
      label: 'L1 label 2',
      children: [
        {
          checked: false,
          label: 'L2 label 1',
        },
        {
          checked: false,
          label: 'L2 label 2',
          children: [
            {
              checked: false,
              label: 'L3 label 1',
            },
            {
              checked: false,
              label: 'L3 label 2',
              children: [
                {
                  checked: false,
                  label: 'L4 label 1',
                },
                {
                  checked: false,
                  label: 'L4 label 2',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const defaultCustomizations: DemoCustomizations = {
    checkboxes: JSON.stringify(checkboxes, null, 4),
    description: 'This is optional text that describes the label in more detail.',
    disabled: false,
    errorMessage: 'This is required text that describes the error in more detail.',
    inline: false,
    invalid: false,
    label: 'Group label',
    panel: false,
    required: false,
  };

  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'checkboxes'> & { checkboxes: CheckboxGroup[] }
  >({
    ...defaultCustomizations,
    checkboxes,
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
      const parsedCheckboxes = JSON.parse(formValues.checkboxes || '[]') as CheckboxGroup[];
      setCustomizations({
        ...formValues,
        checkboxes: parsedCheckboxes,
      });
    } catch (error) {
      console.error('Invalid JSON for checkboxes:', error);
    }
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations({
      ...defaultCustomizations,
      checkboxes,
    });
  };

  return (
    <div>
      <NovaCheckboxGroup
        checkboxes={customizations.checkboxes}
        description={customizations.description || ''}
        disabled={customizations.disabled}
        inline={customizations.inline}
        invalid={customizations.invalid}
        label={customizations.label || ''}
        message={customizations.invalid ? customizations.errorMessage : undefined}
        panel={customizations.panel}
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

              <NovaInput<'textarea'>
                blockSize="320px"
                id="checkboxes-input"
                label="Checkboxes"
                onChange={e => handleInputChange('checkboxes', e.target.value)}
                resizable
                textarea
                value={formValues.checkboxes}
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
export default NovaCheckboxGroupDemo;
/** !!! DELETE ME END !!! */
