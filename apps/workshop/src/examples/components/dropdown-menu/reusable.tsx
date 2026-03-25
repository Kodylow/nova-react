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
import { offset, useClick, useDismiss, useFloating, useInteractions, type Placement } from '@floating-ui/react';
import {
  VisaChevronDownTiny,
  VisaChevronUpTiny,
  VisaDeleteTiny,
  VisaExportTiny,
  VisaFileDownloadTiny,
  VisaFileUploadTiny,
  VisaOptionHorizontalHigh,
} from '@visa/nova-icons-react';
import {
  Button,
  DropdownButton,
  DropdownMenu,
  Listbox,
  Tab,
  Tabs,
  useModel,
  Utility,
  UtilityFragment,
  type ButtonProperties,
  type UtilityFragmentProperties,
} from '@visa/nova-react';
import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';

// Props passed to the trigger element
export type DropdownTriggerProps = {
  ref: (node: HTMLElement | null) => void;
} & Record<string, unknown>;

export type NovaDropdownMenuOption = Omit<ButtonProperties, 'children'> & {
  label?: ReactNode;
  render?: (item: Omit<NovaDropdownMenuOption, 'render'>) => ReactNode;
  prefix?: ReactNode;
  selected?: boolean;
  suffix?: ReactNode;
  vJustifyContent?: UtilityFragmentProperties['vJustifyContent'];
};

// Nova DropdownMenu Component Props
export type NovaDropdownMenuProps = ButtonProperties & {
  element?: ReactElement | ((props: DropdownTriggerProps) => ReactNode);
  maxWidth?: CSSStyleDeclaration['maxInlineSize'];
  offset?: number;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  options?: NovaDropdownMenuOption[];
  optionRender?: NovaDropdownMenuOption['render'];
  placement?: Placement;
  showToggleIcon?: boolean;
};

// Main Nova DropdownMenu Component
export const NovaDropdownMenu = ({
  children,
  element,
  id: idProp,
  maxWidth = 'unset',
  offset: offsetValue = 0,
  onOpenChange,
  open: openProp,
  options = [],
  optionRender,
  placement = 'bottom-start',
  showToggleIcon = true,
  ...remainingProps
}: NovaDropdownMenuProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [open, setOpen] = useModel(openProp, onOpenChange, false);

  const { context, floatingStyles, refs } = useFloating({
    middleware: [offset(offsetValue)],
    open,
    onOpenChange: setOpen,
    placement,
  });

  const onClick = useClick(context);
  const onDismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([onClick, onDismiss]);

  // Props to pass to the trigger element
  const triggerProps: DropdownTriggerProps = {
    ref: refs.setReference,
    ...getReferenceProps(),
  };

  const hasSelectedOption = options.some(option => option.selected);

  const optionsRendered = options.map((option, index) => {
    const {
      label,
      onClick: onItemClick,
      prefix,
      render,
      selected,
      suffix,
      vJustifyContent,
      ...remainingButtonProps
    } = option;
    const onClick = (e: MouseEvent<HTMLButtonElement>) => {
      onItemClick?.(e);
      setOpen(false);
    };
    const buttonProps = {
      ...remainingButtonProps,
      'aria-selected': selected && hasSelectedOption ? 'true' : undefined,
      className: 'v-listbox-item',
      onClick: onClick,
      role: 'tab',
    };
    const renderedProps = { ...buttonProps, ...option } as NovaDropdownMenuOption;
    delete renderedProps.render; // Remove render from props passed to optionRender
    return (
      <UtilityFragment key={id + '-option-' + index} vPaddingBottom={2}>
        <Tab role="none">
          {optionRender ? (
            optionRender(renderedProps)
          ) : render ? (
            render(renderedProps)
          ) : (
            <UtilityFragment vJustifyContent={vJustifyContent}>
              <Button colorScheme="tertiary" subtle {...(buttonProps as ButtonProperties)}>
                {prefix}
                {label}
                {suffix}
              </Button>
            </UtilityFragment>
          )}
        </Tab>
      </UtilityFragment>
    );
  });

  return (
    <>
      {element && (
        <>
          {typeof element === 'function' && element(triggerProps)}
          {isValidElement(element) && cloneElement(element, triggerProps)}
        </>
      )}

      {!element && (
        <DropdownButton
          aria-controls={id}
          aria-expanded={open}
          id={`${id}-button`}
          {...remainingProps}
          {...triggerProps}
        >
          {children}
          {showToggleIcon && (open ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />)}
        </DropdownButton>
      )}
      {open && (
        <DropdownMenu
          id={id}
          aria-hidden={!open}
          ref={refs.setFloating}
          style={{ inlineSize: 'max-content', maxInlineSize: maxWidth, zIndex: 10, ...floatingStyles }}
          {...getFloatingProps()}
        >
          <UtilityFragment vPaddingVertical={4} vPaddingRight={4} vHide={!open}>
            {hasSelectedOption ? (
              <Tabs orientation="vertical" role="tablist">
                {optionsRendered}
              </Tabs>
            ) : (
              <Listbox>{optionsRendered}</Listbox>
            )}
          </UtilityFragment>
        </DropdownMenu>
      )}
    </>
  );
};

// export default NovaDropdownMenu;

/** !!! DELETE ME START !!! */

const demoOptions: NovaDropdownMenuOption[] = [
  { disabled: true, label: 'Label 1' },
  { label: 'Label 2', selected: true },
  { label: 'Label 3' },
  { label: 'Label 4' },
];

// These are separate from the main options because these can't be customized inside of a textarea input.
const demoOptionsIcons: ReactNode[] = [
  // eslint-disable-next-line react/jsx-key
  <VisaExportTiny />,
  // eslint-disable-next-line react/jsx-key
  <VisaFileDownloadTiny />,
  // eslint-disable-next-line react/jsx-key
  <VisaFileUploadTiny />,
  // eslint-disable-next-line react/jsx-key
  <VisaDeleteTiny />,
];

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

// Demo Component Types
interface DemoCustomizations {
  buttonSize: ButtonProperties['buttonSize'];
  colorScheme: ButtonProperties['colorScheme'];
  iconButton: boolean;
  options: string;
  label: string;
  maxWidth: string;
  offset: number;
  placement: Placement;
  showPrefixIcons: boolean;
  showSuffixIcons: boolean;
  showToggleIcon: boolean;
}

const defaultCustomizations: DemoCustomizations = {
  buttonSize: 'medium',
  colorScheme: 'primary',
  iconButton: false,
  label: 'Action',
  maxWidth: 'unset',
  offset: 0,
  options: JSON.stringify(demoOptions, null, 4),
  placement: 'bottom-start',
  showPrefixIcons: true,
  showSuffixIcons: false,
  showToggleIcon: true,
};

// Demo Component
export const NovaDropdownMenuDemo = () => {
  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'options'> & { options: NovaDropdownMenuOption[] }
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

  const handleApply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsedOptions = JSON.parse(formValues.options || '[]') as NovaDropdownMenuOption[];
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
  const handleClick = () => {
    console.log('DropdownMenu button clicked');
  };

  const optionsWithCustomizations = customizations.options.map((option, index) => {
    const prefix = customizations.showPrefixIcons ? demoOptionsIcons[index % demoOptionsIcons.length] : undefined;
    const suffix = customizations.showSuffixIcons ? demoOptionsIcons[index % demoOptionsIcons.length] : undefined;
    const vJustifyContent = customizations.showSuffixIcons ? 'between' : undefined;
    const style = customizations.showSuffixIcons ? { minWidth: '150px' } : undefined;
    return { ...option, prefix, suffix, vJustifyContent, style } as NovaDropdownMenuOption;
  });

  return (
    <div>
      <NovaDropdownMenu
        aria-label={customizations.iconButton ? customizations.label : undefined}
        buttonSize={customizations.buttonSize || undefined}
        colorScheme={customizations.colorScheme || undefined}
        iconButton={customizations.iconButton || undefined}
        onClick={handleClick}
        options={optionsWithCustomizations || []}
        offset={+customizations.offset}
        placement={customizations.placement || 'top'}
        maxWidth={customizations.maxWidth || 'unset'}
        showToggleIcon={customizations.showToggleIcon}
      >
        {customizations.iconButton ? <VisaOptionHorizontalHigh /> : customizations.label || ''}
      </NovaDropdownMenu>

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
                blockSize="100px"
                label="Menu options (JSON)"
                onChange={e => handleInputChange('options', e.target.value)}
                resizable
                textarea
                value={formValues.options}
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

              <NovaSelect
                label="Button color scheme"
                onChange={e =>
                  handleInputChange('colorScheme', e.target.value as NonNullable<DemoCustomizations['colorScheme']>)
                }
                options={buttonColors}
                value={formValues.colorScheme}
              />

              <NovaSelect
                label="Button size"
                onChange={e =>
                  handleInputChange('buttonSize', e.target.value as NonNullable<DemoCustomizations['buttonSize']>)
                }
                options={buttonSizes}
                value={formValues.buttonSize}
              />

              <NovaSelect
                label="Placement"
                onChange={e => handleInputChange('placement', e.target.value as DemoCustomizations['placement'])}
                options={placements}
                value={formValues.placement}
              />

              <NovaCheckbox
                checked={formValues.iconButton}
                label="Icon button"
                description="It is recommended to use the small button size and tertiary color scheme with this option."
                onChange={e => handleInputChange('iconButton', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.showPrefixIcons}
                label="Show prefix icons"
                onChange={e => handleInputChange('showPrefixIcons', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.showSuffixIcons}
                label="Show suffix icons"
                onChange={e => handleInputChange('showSuffixIcons', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.showToggleIcon}
                label="Show toggle icon"
                onChange={e => handleInputChange('showToggleIcon', e.target.checked)}
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
export default NovaDropdownMenuDemo;
/** !!! DELETE ME END !!! */
