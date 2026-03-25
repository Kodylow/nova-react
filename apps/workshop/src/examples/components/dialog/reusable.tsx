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
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  type DialogProperties,
  type MessageType,
  Typography,
  Utility,
} from '@visa/nova-react';
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';

// Nova Dialog Component Props
export type NovaDialogProps = DialogProperties & {
  actions?: ReactNode;
  description?: string;
  dismissible?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPrimaryButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSecondaryButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  open?: boolean;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  showIcon?: boolean;
  title?: string;
  titleContent?: ReactNode;
};

// Main Nova Dialog Component
export const NovaDialog = ({
  actions,
  children,
  description,
  dismissible = false,
  id: idProp,
  messageType,
  onOpenChange,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  open = false,
  primaryButtonLabel,
  secondaryButtonLabel,
  showIcon = false,
  title,
  titleContent,
  ...remainingProps
}: NovaDialogProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle open/close state changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const dialogOpen = dialog.open;
    if ((open && dialogOpen) || (!open && !dialogOpen)) return; // no change needed
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  // Handle close
  const handleClose = () => {
    onOpenChange?.(false);
  };

  // Handle escape key
  const handleEscapeKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Escape' || dismissible) return;
    event.preventDefault();
    handleClose();
  };

  return (
    <Dialog
      aria-describedby={description ? `${id}-description` : undefined}
      aria-labelledby={`${id}-title`}
      id={id}
      ref={dialogRef}
      onKeyDown={handleEscapeKey}
      messageType={messageType}
      {...remainingProps}
    >
      <DialogContent>
        <DialogHeader id={`${id}-title`}>
          {showIcon && <MessageIcon messageType={messageType as Parameters<typeof MessageIcon>[0]['messageType']} />}
          {title}
          {titleContent}
        </DialogHeader>
        {description && <Typography id={`${id}-description`}>{description}</Typography>}
        {children}
        <Utility vAlignItems="center" vFlex vFlexWrap vGap={8} vPaddingTop={16}>
          {primaryButtonLabel && (
            <Button autoFocus onClick={onPrimaryButtonClick}>
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButtonLabel && (
            <Button colorScheme="secondary" onClick={onSecondaryButtonClick}>
              {secondaryButtonLabel}
            </Button>
          )}
          {actions}
        </Utility>
      </DialogContent>

      {dismissible && (
        <DialogCloseButton onClick={handleClose}>
          <VisaCloseTiny />
        </DialogCloseButton>
      )}
    </Dialog>
  );
};

// export default NovaDialog;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  description: string;
  dismissible: boolean;
  messageType: MessageType;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  showIcon: boolean;
  title: string;
}

// Demo Component
export const NovaDialogDemo = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const messageTypes: { label: string; value: MessageType }[] = [
    { label: 'Information', value: 'information' },
    { label: 'Success', value: 'success' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Subtle', value: 'subtle' },
  ];

  const defaultCustomizations: DemoCustomizations = {
    description: 'This is required text that describes the dialog title in more detail.',
    dismissible: true,
    messageType: 'information',
    primaryButtonLabel: 'Primary action',
    secondaryButtonLabel: 'Secondary action',
    showIcon: true,
    title: 'Nova title',
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

  const handlePrimaryClick = () => {
    console.log('Dialog primary button clicked');
  };

  const handleSecondaryClick = () => {
    console.log('Dialog secondary button clicked');
  };

  return (
    <div>
      <Button onClick={() => setDialogOpen(true)}>Open reusable dialog</Button>

      <NovaDialog
        description={customizations.description || ''}
        dismissible={customizations.dismissible}
        messageType={customizations.messageType}
        onOpenChange={setDialogOpen}
        onPrimaryButtonClick={handlePrimaryClick}
        onSecondaryButtonClick={handleSecondaryClick}
        open={dialogOpen}
        primaryButtonLabel={customizations.primaryButtonLabel || ''}
        secondaryButtonLabel={customizations.secondaryButtonLabel || ''}
        showIcon={customizations.showIcon}
        title={customizations.title || ''}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Description"
                onChange={e => handleInputChange('description', e.target.value)}
                value={formValues.description}
              />

              <NovaInput
                clearable
                label="Primary button label"
                onChange={e => handleInputChange('primaryButtonLabel', e.target.value)}
                value={formValues.primaryButtonLabel}
              />

              <NovaInput
                clearable
                label="Secondary button label"
                onChange={e => handleInputChange('secondaryButtonLabel', e.target.value)}
                value={formValues.secondaryButtonLabel}
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
export default NovaDialogDemo;
/** !!! DELETE ME END !!! */
