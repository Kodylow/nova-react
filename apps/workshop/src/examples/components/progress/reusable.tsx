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
import { VisaErrorTiny, VisaInformationTiny, VisaSuccessTiny, VisaWarningTiny } from '@visa/nova-icons-react';
import {
  Button,
  type MessageType,
  ProgressCircular,
  ProgressLabel,
  ProgressLinear,
  ScreenReader,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import clsx from 'clsx';
import { type CSSProperties, useId, useMemo, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';

const ICON_MAP = {
  error: <VisaErrorTiny />,
  warning: <VisaWarningTiny />,
  success: <VisaSuccessTiny />,
  information: <VisaInformationTiny />,
  subtle: undefined,
};

const MAX = 100;
const MAX_CIRCULAR_PROGRESS_VISIBLE_SIZE = 48;
const MIN = 0;

const normalizeProgressValue = (value?: number | null): number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (value < MIN) return MIN;
  if (value > MAX) return MAX;
  return Math.floor(value);
};

// Nova Progress Component Props
export type NovaProgressProps = {
  completeStatusMessage?: string;
  determinate?: boolean;
  hideMessage?: boolean;
  hideProgress?: boolean;
  id?: string;
  inline?: boolean;
  loadingStatusMessage?: string;
  message?: string;
  messageType?: Exclude<MessageType, 'close'>;
  paused?: boolean;
  progress?: number;
  size?: 'small' | 'large' | number;
  speed?: number;
  type?: 'linear' | 'circular';
};

// Main Nova Progress Component
export const NovaProgress = ({
  completeStatusMessage = 'Loading complete',
  determinate = false,
  hideMessage = false,
  hideProgress = false,
  id: idProp,
  inline = false,
  loadingStatusMessage = 'Loading...',
  message,
  messageType = 'subtle',
  paused: pausedProp = false,
  progress: progressProp,
  size,
  speed,
  type = 'circular',
  ...remainingProps
}: NovaProgressProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const circularProgressVisible =
    determinate &&
    !hideProgress &&
    (size === undefined ||
      typeof size === 'string' ||
      (typeof size === 'number' && size >= MAX_CIRCULAR_PROGRESS_VISIBLE_SIZE));

  const paused = determinate ? false : pausedProp || messageType === 'error';
  // Normalize progress value
  const progressValue = normalizeProgressValue(progressProp);

  // Compute screen reader status message
  const srStatusMessage = useMemo(() => {
    if (!determinate || (progressValue || 0) < 100) return loadingStatusMessage;
    return completeStatusMessage;
  }, [determinate, progressValue, loadingStatusMessage, completeStatusMessage]);

  // Get icon based on message type
  const messageIcon = ICON_MAP[messageType];

  if (type === 'linear')
    return (
      <>
        <UtilityFragment vMarginVertical={8}>
          <ProgressLinear
            id={`${id}-progress`}
            max={determinate ? MAX : undefined}
            style={{ animationPlayState: paused ? 'paused' : undefined }}
            value={determinate ? progressValue : undefined}
            {...remainingProps}
          />
        </UtilityFragment>
        <ProgressLabel htmlFor={`${id}-progress`}>
          {message && (
            <Utility className={hideMessage ? 'v-sr' : undefined} role="alert" vFlex vGap={4}>
              {messageIcon}
              {message}
            </Utility>
          )}
          {!hideProgress && determinate && <span>{progressValue}%</span>}

          <ScreenReader tag="span" role="alert">
            {srStatusMessage}
          </ScreenReader>
        </ProgressLabel>
      </>
    );

  // Circular progress
  return (
    <Utility vFlex vFlexCol={inline ? false : true} vGap={8} vAlignItems={inline ? 'center' : undefined}>
      <ProgressCircular
        aria-invalid={messageType === 'error' ? 'true' : undefined}
        aria-labelledby={`${id}-label ${id}-message`}
        aria-valuenow={determinate ? progressValue : undefined}
        indeterminate={!determinate}
        progressSize={size}
        style={
          {
            animationPlayState: paused ? 'paused' : 'running',
            '--v-progress-animation-factor': speed ?? undefined,
          } as CSSProperties
        }
        value={determinate ? progressValue : undefined}
        {...remainingProps}
      >
        <ProgressLabel id={`${id}-label`}>
          <ProgressLabel className={clsx(!circularProgressVisible && 'v-sr')} tag="div" variant="body-2-bold">
            {determinate && `${progressValue}%`}
            {!determinate && loadingStatusMessage}
          </ProgressLabel>
        </ProgressLabel>
      </ProgressCircular>
      <ProgressLabel>
        <Utility
          id={`${id}-message`}
          tag="span"
          role="alert"
          className={clsx(hideMessage && 'v-sr', undefined)}
          vFlex
          vGap={4}
        >
          {messageIcon}
          {message}
        </Utility>
      </ProgressLabel>
    </Utility>
  );
};

// export default NovaProgress;

/** !!! DELETE ME START !!! */

// Demo Component Types
interface DemoCustomizations {
  determinate: boolean;
  hideMessage: boolean;
  hideProgress: boolean;
  inline: boolean;
  message: string;
  messageType: Exclude<MessageType, 'close'>;
  paused: boolean;
  progress: number;
  size?: string;
  speed?: number;
  type: 'linear' | 'circular';
}

// Demo Component
export const NovaProgressDemo = () => {
  const messageTypes: { label: string; value: Exclude<MessageType, 'close'> }[] = [
    { label: 'Subtle', value: 'subtle' },
    { label: 'Information', value: 'information' },
    { label: 'Error', value: 'error' },
    { label: 'Success', value: 'success' },
    { label: 'Warning', value: 'warning' },
  ];

  const types: { label: string; value: 'linear' | 'circular' }[] = [
    { label: 'Circular', value: 'circular' },
    { label: 'Linear', value: 'linear' },
  ];

  const defaultCustomizations: DemoCustomizations = {
    determinate: true,
    hideMessage: false,
    hideProgress: false,
    inline: false,
    message: 'Filename.jpg',
    messageType: 'subtle',
    paused: false,
    progress: 70,
    size: undefined,
    speed: undefined,
    type: 'linear',
  };

  const [customizations, setCustomizations] = useState<DemoCustomizations>(defaultCustomizations);
  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = (field: keyof DemoCustomizations, value?: string | boolean | number) => {
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

  // Parse size value
  const parsedSize = useMemo(() => {
    const sizeValue = customizations.size;
    if (!sizeValue) return undefined;
    if (sizeValue === 'small' || sizeValue === 'large') return sizeValue;
    const numValue = Number(sizeValue);
    return isNaN(numValue) ? undefined : numValue;
  }, [customizations.size]);

  return (
    <div>
      <style>{`
        .circular-progress-label {
          block-size: 100%;
          inline-size: 100%;
      }
      `}</style>

      <NovaProgress
        determinate={customizations.determinate}
        hideMessage={customizations.hideMessage}
        hideProgress={customizations.hideProgress}
        inline={customizations.inline}
        message={customizations.message || ''}
        messageType={customizations.messageType}
        paused={customizations.paused}
        progress={customizations.progress}
        size={parsedSize ?? undefined}
        speed={customizations.speed}
        type={customizations.type}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Message"
                onChange={e => handleInputChange('message', e.target.value)}
                value={formValues.message}
              />

              {customizations.message && (
                <NovaSelect
                  label="Message type"
                  onChange={e => handleInputChange('messageType', e.target.value as DemoCustomizations['messageType'])}
                  options={messageTypes}
                  value={formValues.messageType}
                />
              )}

              {customizations.determinate && (
                <NovaInput
                  clearable
                  label="Progress"
                  onChange={e => handleInputChange('progress', e.target.value ? Number(e.target.value) : undefined)}
                  type="number"
                  value={formValues.progress?.toString() || ''}
                />
              )}

              {customizations.type === 'circular' && (
                <>
                  <NovaInput
                    clearable
                    label="Size"
                    message="Valid options are 'small', 'large', or a number."
                    onChange={e => handleInputChange('size', e.target.value)}
                    value={formValues.size || ''}
                  />

                  {!customizations.determinate && (
                    <NovaInput
                      clearable
                      label="Speed"
                      message="The smaller the number the faster the animation."
                      onChange={e => handleInputChange('speed', e.target.value ? Number(e.target.value) : undefined)}
                      step={0.1}
                      type="number"
                      value={formValues.speed?.toString() || ''}
                    />
                  )}
                </>
              )}

              <NovaSelect
                label="Type"
                onChange={e => handleInputChange('type', e.target.value as DemoCustomizations['type'])}
                options={types}
                value={formValues.type}
              />

              <NovaCheckbox
                label="Determinate"
                checked={formValues.determinate}
                onChange={e => handleInputChange('determinate', e.target.checked)}
              />

              <NovaCheckbox
                label="Hide message"
                checked={formValues.hideMessage}
                onChange={e => handleInputChange('hideMessage', e.target.checked)}
              />

              {customizations.type === 'circular' && !customizations.hideMessage && (
                <NovaCheckbox
                  label="Inline"
                  checked={formValues.inline}
                  onChange={e => handleInputChange('inline', e.target.checked)}
                />
              )}

              {!customizations.determinate && (
                <NovaCheckbox
                  label="Paused"
                  checked={formValues.paused}
                  onChange={e => handleInputChange('paused', e.target.checked)}
                />
              )}

              {customizations.determinate && (
                <NovaCheckbox
                  label="Hide progress"
                  checked={formValues.hideProgress}
                  onChange={e => handleInputChange('hideProgress', e.target.checked)}
                />
              )}
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
export default NovaProgressDemo;
/** !!! DELETE ME END !!! */
