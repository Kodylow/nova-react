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
  offset,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  type Placement,
} from '@floating-ui/react';
import { VisaInformationLow } from '@visa/nova-icons-react';
import { Button, Link, Tooltip, Utility, type ButtonProperties } from '@visa/nova-react';
import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';
import { NovaCheckbox } from '../checkbox/reusable';

// Props passed to the trigger element
export type TooltipTriggerProps = {
  ref: (node: HTMLElement | null) => void;
} & Record<string, unknown>;

// Nova Tooltip Component Props
export type NovaTooltipProps = Omit<ButtonProperties<'button'>, 'children'> & {
  /** Render function, ReactElement, or string. Render function receives ref and interaction props. */
  children?: ReactNode;
  element?: ReactElement | ((props: TooltipTriggerProps) => ReactNode);
  maxWidth?: CSSStyleDeclaration['maxWidth'];
  offset?: number;
  placement?: Placement;
  tooltip?: ReactNode;
};

// Main Nova Tooltip Component
export const NovaTooltip = ({
  children = <VisaInformationLow aria-label="More information" />,
  element,
  maxWidth = 'unset',
  offset: offsetValue = 2,
  placement = 'top',
  tooltip,
  ...remainingProps
}: NovaTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    middleware: [offset(offsetValue)],
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
  });

  const dismiss = useDismiss(context);
  const focus = useFocus(context);
  const hover = useHover(context, { handleClose: safePolygon(), move: false });
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, focus, hover, role]);

  // Props to pass to the trigger element
  const triggerProps: TooltipTriggerProps = {
    ref: refs.setReference,
    ...getReferenceProps(),
  };

  return (
    <Utility vFlex vJustifyContent="center" vMargin={24}>
      {element && (
        <>
          {typeof element === 'function' && element(triggerProps)}
          {isValidElement(element) && cloneElement(element, triggerProps)}
        </>
      )}

      {!element && (
        <Button
          buttonSize="small"
          iconButton
          colorScheme="tertiary"
          {...(remainingProps as ButtonProperties)}
          {...triggerProps}
        >
          {children}
        </Button>
      )}

      {isOpen && tooltip && (
        <Tooltip
          ref={refs.setFloating}
          style={{
            inlineSize: 'fit-content',
            left: x,
            maxInlineSize: maxWidth,
            position: strategy,
            top: y,
          }}
          {...getFloatingProps()}
        >
          {tooltip}
        </Tooltip>
      )}
    </Utility>
  );
};

// export default NovaTooltip;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  asLink: boolean;
  buttonSize: ButtonProperties['buttonSize'];
  colorScheme: ButtonProperties['colorScheme'];
  iconButton: boolean;
  label: string;
  maxWidth: string;
  offset: number;
  placement: Placement;
  tooltip: string;
}

const buttonColors: { label: string; value: ButtonProperties['colorScheme'] }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Tertiary', value: 'tertiary' },
];

const buttonSizes: { label: string; value: ButtonProperties['buttonSize'] }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const placements: { label: string; value: Placement }[] = [
  { label: 'Bottom', value: 'bottom' },
  { label: 'Bottom end', value: 'bottom-end' },
  { label: 'Bottom start', value: 'bottom-start' },
  { label: 'Left', value: 'left' },
  { label: 'Left end', value: 'left-end' },
  { label: 'Left start', value: 'left-start' },
  { label: 'Right', value: 'right' },
  { label: 'Right end', value: 'right-end' },
  { label: 'Right start', value: 'right-start' },
  { label: 'Top', value: 'top' },
  { label: 'Top start', value: 'top-start' },
  { label: 'Top end', value: 'top-end' },
];

const defaultCustomizations: DemoCustomizations = {
  asLink: false,
  buttonSize: 'medium',
  colorScheme: 'primary',
  iconButton: false,
  label: 'Primary action',
  maxWidth: 'unset',
  offset: 2,
  placement: 'top',
  tooltip: 'This is a tooltip',
};

// Demo Component
export const NovaTooltipDemo = () => {
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

  const handleClick = () => {
    console.log('Tooltip button clicked');
  };

  return (
    <div>
      <NovaTooltip
        buttonSize={customizations.asLink ? undefined : customizations.buttonSize || undefined}
        colorScheme={customizations.asLink ? undefined : customizations.colorScheme || undefined}
        element={customizations.asLink ? <Link>{customizations.label || 'Tooltip link'}</Link> : undefined}
        iconButton={customizations.asLink ? undefined : customizations.iconButton || undefined}
        onClick={handleClick}
        tooltip={customizations.tooltip || ''}
        offset={+customizations.offset}
        placement={customizations.placement || 'top'}
        maxWidth={customizations.maxWidth || 'unset'}
      >
        {customizations.iconButton ? (
          <VisaInformationLow aria-label={customizations.label} />
        ) : (
          customizations.label || ''
        )}
      </NovaTooltip>

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Label"
                onChange={e => handleInputChange('label', e.target.value)}
                placeholder="Primary action"
                value={formValues.label}
              />

              <NovaInput
                clearable
                label="Tooltip"
                onChange={e => handleInputChange('tooltip', e.target.value)}
                placeholder="This is a really really really long tooltip"
                value={formValues.tooltip}
              />

              <NovaInput
                clearable
                label="Max width"
                onChange={e => handleInputChange('maxWidth', e.target.value)}
                placeholder="100px"
                value={formValues.maxWidth}
              />

              <NovaInput
                clearable
                label="Offset"
                onChange={e => handleInputChange('offset', e.target.value)}
                placeholder="2"
                type="number"
                value={formValues.offset}
              />

              {!formValues.asLink && (
                <NovaSelect
                  label="Button color scheme"
                  onChange={e =>
                    handleInputChange('colorScheme', e.target.value as NonNullable<DemoCustomizations['colorScheme']>)
                  }
                  options={buttonColors}
                  value={formValues.colorScheme}
                />
              )}

              {!formValues.asLink && (
                <NovaSelect
                  label="Button size"
                  onChange={e =>
                    handleInputChange('buttonSize', e.target.value as NonNullable<DemoCustomizations['buttonSize']>)
                  }
                  options={buttonSizes}
                  value={formValues.buttonSize}
                />
              )}

              <NovaSelect
                label="Placement"
                onChange={e => handleInputChange('placement', e.target.value as DemoCustomizations['placement'])}
                options={placements}
                value={formValues.placement}
              />

              {!formValues.asLink && (
                <NovaCheckbox
                  checked={formValues.iconButton}
                  label="Icon button"
                  description="It is recommended to use the small button size and tertiary color scheme with this option."
                  onChange={e => handleInputChange('iconButton', e.target.checked)}
                />
              )}

              <NovaCheckbox
                checked={formValues.asLink}
                label="Show as link"
                onChange={e => handleInputChange('asLink', e.target.checked)}
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
export default NovaTooltipDemo;
/** !!! DELETE ME END !!! */
