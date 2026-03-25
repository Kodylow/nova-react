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
import { VisaChevronDownTiny, VisaChevronRightTiny, VisaCloudLow, VisaSuccessTiny } from '@visa/nova-icons-react';
import {
  Accordion,
  AccordionHeading,
  AccordionPanel,
  AccordionToggleIcon,
  Badge,
  Button,
  Checkbox,
  Input,
  InputContainer,
  Label,
  Typography,
  Utility,
  UtilityFragment,
  type AccordionProperties,
} from '@visa/nova-react';
import { type CSSProperties, type ReactNode, useId, useState } from 'react';

// Nova Accordion Component Props
// Note: Omit 'prefix' because it's a native HTML attribute on <details> that expects a string,
// but we're overriding it to accept ReactNode for icon/badge support
export type NovaAccordionProps = Omit<AccordionProperties, 'prefix'> & {
  description?: string;
  disabled?: boolean;
  padding?: boolean;
  prefix?: ReactNode;
  showIcon?: boolean;
  subtle?: boolean;
  suffix?: ReactNode;
  title?: string;
  toggleIcon?: ReactNode;
};

// Main Nova Accordion Component
export const NovaAccordion = ({
  children,
  description,
  disabled = false,
  id: idProp,
  name,
  padding = true,
  prefix,
  showIcon = true,
  subtle = false,
  suffix,
  title,
  toggleIcon,
  ...remainingProps
}: NovaAccordionProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Accordion id={id} name={name ?? undefined} {...remainingProps}>
      <UtilityFragment vGap={2}>
        <AccordionHeading
          buttonSize={subtle ? undefined : 'large'}
          className="v-typography-body-2-medium"
          colorScheme={subtle ? 'tertiary' : 'secondary'}
          disabled={disabled}
          style={
            subtle
              ? ({
                  '--v-accordion-foreground-initial': 'var(--palette-default-active)',
                  '--v-button-default-background': 'transparent',
                } as CSSProperties)
              : undefined
          }
        >
          {toggleIcon}
          {showIcon && (
            <AccordionToggleIcon elementClosed={<VisaChevronRightTiny rtl />} elementOpen={<VisaChevronDownTiny />} />
          )}
          {prefix}
          {title && (
            <Utility vFlex vAlignItems="center" vGap="6">
              {title}
            </Utility>
          )}
          {suffix}
        </AccordionHeading>
      </UtilityFragment>
      <UtilityFragment vPaddingHorizontal={padding ? 32 : undefined}>
        <AccordionPanel
          style={
            subtle
              ? ({
                  '--v-accordion-panel-background-color': 'transparent',
                  '--v-accordion-panel-border-size': '0px',
                } as CSSProperties)
              : undefined
          }
        >
          {description && <Typography>{description}</Typography>}
          {children}
        </AccordionPanel>
      </UtilityFragment>
    </Accordion>
  );
};

// export default NovaAccordion;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  accordions: number;
  description: string;
  disabled: boolean;
  multiselect: boolean;
  padding: boolean;
  showBadge: boolean;
  showIcon: boolean;
  showToggleIcon: boolean;
  subtle: boolean;
  title: string;
}

// Demo Component
export const NovaAccordionDemo = () => {
  const name = 'reusable-accordion-demo';

  const defaultCustomizations: DemoCustomizations = {
    accordions: 1,
    description: 'This is required text that describes the accordion in more detail.',
    disabled: false,
    multiselect: false,
    padding: true,
    showBadge: false,
    showIcon: false,
    showToggleIcon: true,
    subtle: false,
    title: 'Success title',
  };

  const [customizations, setCustomizations] = useState<DemoCustomizations>(defaultCustomizations);
  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const accordions = Array.from({ length: Math.max(1, Math.floor(customizations.accordions)) }, (_, i) => i);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean | number) => {
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
      <Utility vFlex vFlexCol vGap={6}>
        {accordions.map(i => (
          <NovaAccordion
            key={`reusable-accordion-${i}`}
            description={customizations.description || ''}
            disabled={customizations.disabled}
            name={customizations.multiselect ? undefined : name}
            padding={customizations.padding}
            showIcon={customizations.showToggleIcon}
            subtle={customizations.subtle}
            title={`${customizations.title || ''} ${i + 1}`}
            prefix={customizations.showIcon ? <VisaCloudLow /> : undefined}
            suffix={
              customizations.showBadge ? (
                <Badge badgeType="stable" style={{ marginLeft: 'auto' }}>
                  <VisaSuccessTiny style={{ margin: 0 }} />
                  <span>Label</span>
                </Badge>
              ) : undefined
            }
          />
        ))}
      </Utility>

      <div style={{ marginTop: '24px' }} />

      <NovaAccordion title="Customize demo">
        <form onSubmit={handleApply}>
          <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
            <div>
              <Label htmlFor="accordions">Accordions</Label>
              <InputContainer>
                <Input
                  id="accordions"
                  type="number"
                  value={formValues.accordions}
                  onChange={e => handleInputChange('accordions', parseInt(e.target.value) || 1)}
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <InputContainer>
                <Input
                  id="description"
                  type="text"
                  value={formValues.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <InputContainer>
                <Input
                  id="title"
                  type="text"
                  value={formValues.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                />
              </InputContainer>
            </div>

            <Label>
              <Checkbox checked={formValues.disabled} onChange={e => handleInputChange('disabled', e.target.checked)} />
              Disabled
            </Label>

            <Label>
              <Checkbox
                checked={formValues.multiselect}
                onChange={e => handleInputChange('multiselect', e.target.checked)}
              />
              Multiselect
            </Label>

            <Label>
              <Checkbox checked={formValues.padding} onChange={e => handleInputChange('padding', e.target.checked)} />
              Padding
            </Label>

            <Label>
              <Checkbox
                checked={formValues.showBadge}
                onChange={e => handleInputChange('showBadge', e.target.checked)}
              />
              Show badge
            </Label>

            <Label>
              <Checkbox checked={formValues.showIcon} onChange={e => handleInputChange('showIcon', e.target.checked)} />
              Show icon
            </Label>

            <Label>
              <Checkbox
                checked={formValues.showToggleIcon}
                onChange={e => handleInputChange('showToggleIcon', e.target.checked)}
              />
              Show toggle icon
            </Label>

            <Label>
              <Checkbox checked={formValues.subtle} onChange={e => handleInputChange('subtle', e.target.checked)} />
              Subtle
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
  );
};

export default NovaAccordionDemo;
/** !!! DELETE ME END !!! */
