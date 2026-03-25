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
import { MessageIcon, VisaCloseTiny } from '@visa/nova-icons-react';
import {
  Button,
  Flag,
  FlagCloseButton,
  FlagContent,
  type FlagProperties,
  Link,
  type MessageType,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { type ReactNode, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';

// Nova Flag Component Props
export type NovaFlagProps = FlagProperties & {
  buttonLabel?: string;
  description?: string;
  dismissible?: boolean;
  href?: string;
  icon?: ReactNode;
  linkLabel?: string;
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose?: () => void;
  showIcon?: boolean;
  title?: string;
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

// Main Nova Flag Component
export const NovaFlag = ({
  buttonLabel,
  children,
  description,
  dismissible = false,
  href,
  icon,
  linkLabel,
  messageType,
  onButtonClick,
  onClose,
  showIcon = false,
  title,
  titleTag: Title = 'h4',
  ...remainingProps
}: NovaFlagProps) => {
  return (
    <Flag messageType={messageType} {...remainingProps}>
      {showIcon && <MessageIcon messageType={messageType as Parameters<typeof MessageIcon>[0]['messageType']} />}
      {icon}

      <UtilityFragment vPaddingBottom={2} vPaddingLeft={2}>
        <FlagContent>
          {title && <Title className="v-typography-body-2-bold">{title}</Title>}
          {description && <p>{description}</p>}
          {buttonLabel && (
            <UtilityFragment vMarginRight={linkLabel ? 8 : 0} vMarginTop={8}>
              <Button colorScheme="secondary" onClick={onButtonClick}>
                {buttonLabel}
              </Button>
            </UtilityFragment>
          )}
          {linkLabel && <Link href={href}>{linkLabel}</Link>}
          {children}
        </FlagContent>
      </UtilityFragment>

      {dismissible && (
        <FlagCloseButton aria-label="close" onClick={onClose}>
          <VisaCloseTiny />
        </FlagCloseButton>
      )}
    </Flag>
  );
};

// export default NovaFlag;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  buttonLabel: string;
  description: string;
  dismissible: boolean;
  href: string;
  linkLabel: string;
  messageType: MessageType;
  showIcon: boolean;
  title: string;
  titleTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// Demo Component
export const NovaFlagDemo = () => {
  const messageTypes: { label: string; value: MessageType }[] = [
    { label: 'Success', value: 'success' },
    { label: 'Information', value: 'information' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Subtle', value: 'subtle' },
  ];

  const titleTags: { label: string; value: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }[] = [
    { label: '1', value: 'h1' },
    { label: '2', value: 'h2' },
    { label: '3', value: 'h3' },
    { label: '4', value: 'h4' },
    { label: '5', value: 'h5' },
    { label: '6', value: 'h6' },
  ];

  const defaultCustomizations: DemoCustomizations = {
    buttonLabel: '',
    description: 'This is required text that describes the flag in more detail.',
    dismissible: true,
    href: 'www.visa.com',
    linkLabel: '',
    messageType: 'success',
    showIcon: true,
    title: 'Success title',
    titleTag: 'h4',
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

  const handleClose = () => {
    console.log('Section message closed');
  };

  const handleClick = () => {
    console.log('Section message button clicked');
  };

  return (
    <div>
      <NovaFlag
        buttonLabel={customizations.buttonLabel || ''}
        description={customizations.description || ''}
        dismissible={customizations.dismissible}
        href={customizations.href || ''}
        linkLabel={customizations.linkLabel || ''}
        messageType={customizations.messageType}
        onButtonClick={handleClick}
        onClose={handleClose}
        showIcon={customizations.showIcon}
        title={customizations.title || ''}
        titleTag={customizations.titleTag}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Button label"
                onChange={e => handleInputChange('buttonLabel', e.target.value)}
                value={formValues.buttonLabel}
              />

              <NovaInput
                clearable
                label="Description"
                onChange={e => handleInputChange('description', e.target.value)}
                value={formValues.description}
              />

              <NovaInput
                clearable
                label="Href"
                onChange={e => handleInputChange('href', e.target.value)}
                value={formValues.href}
              />

              <NovaInput
                clearable
                label="Link label"
                onChange={e => handleInputChange('linkLabel', e.target.value)}
                value={formValues.linkLabel}
              />

              <NovaInput
                clearable
                label="Title"
                onChange={e => handleInputChange('title', e.target.value)}
                value={formValues.title}
              />

              <NovaSelect
                label="Message type"
                onChange={e => handleInputChange('messageType', e.target.value as MessageType)}
                options={messageTypes}
                value={formValues.messageType}
              />

              <NovaSelect
                label="Title level"
                onChange={e => handleInputChange('titleTag', e.target.value as DemoCustomizations['titleTag'])}
                options={titleTags}
                value={formValues.titleTag}
              />

              <NovaCheckbox
                checked={formValues.dismissible}
                label="Dismissible"
                onChange={e => handleInputChange('dismissible', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.showIcon}
                label="Show icon"
                onChange={e => handleInputChange('showIcon', e.target.checked)}
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
export default NovaFlagDemo;
/** !!! DELETE ME END !!! */
