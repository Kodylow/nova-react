/**
 *              © 2025-2026 Visa
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

/**
 * Table row component displaying file information with dynamic status indicators and action buttons.
 * Used in table-based upload patterns; includes focus management for keyboard accessibility when retrying failed uploads.
 */

import { VisaDeleteTiny, VisaErrorTiny, VisaReloadTiny, VisaSuccessTiny } from '@visa/nova-icons-react';
import { Button, ProgressCircular, ScreenReader, Td, Th, Tr, Typography, Utility, UtilityFragment } from '@visa/nova-react';
import type { UploadRowProps } from './types';
import { useRef, type CSSProperties, type RefObject } from 'react';

/**
 * Generates unique ID for error message to link with aria-describedby.
 *
 * @param fileId - Unique file identifier
 * @returns Error message ID for ARIA linking
 */
function getListItemErrorId(fileId: string) {
  return `file-list-error-${fileId}`;
}

export const UploadRow: React.FC<UploadRowProps> = ({ file, onRetry, retryRef, onDelete }) => {
  const errorId = getListItemErrorId(file.id);
  const statusRef = useRef<HTMLDivElement>(null);

  /**
   * Focuses status cell and retries upload.
   * Called when retry button clicked in table row to provide visual feedback.
   */
  const focusStatusAndRetry = () => {
    if (statusRef.current) {
      statusRef.current.focus();
    }
    onRetry();
  };

  return (
    <Tr>
      {/* File name cell with error message if applicable */}
      <Th scope="row">
        <Utility vFlex vFlexCol vGap={1}>
          <Typography variant="label-large">{file.file.name}</Typography>
          {file.error && (
            <UtilityFragment
              vFlex
              vGap={2}
              style={{
                color: 'var(--palette-messaging-text-negative)',
              }}
            >
              <Typography tag="span" id={errorId} variant="label-small">
                <VisaErrorTiny
                  style={
                    {
                      '--v-icon-primary': 'var(--palette-messaging-text-negative)',
                      '--v-icon-secondary': 'var(--palette-messaging-text-negative)',
                      blockSize: '14px',
                      inlineSize: '14px',
                    } as React.CSSProperties
                  }
                />
                {`Error: ${file.error}`}
              </Typography>
            </UtilityFragment>
          )}
        </Utility>
      </Th>

      {/* File type cell */}
      <Td>{file.file.type}</Td>

      {/* Status cell with dynamic content based on file state */}
      <Td>
        <Utility
          vFlex
          ref={statusRef}
          tabIndex={-1}
          style={{
            borderRadius: 'var(--v-button-default-border-radius)',
            maxInlineSize: 'fit-content',
          }}
        >
          {file.uploading && (
            <Utility style={{ '--v-progress-bar-thickness': '2px' } as CSSProperties}>
              <ProgressCircular indeterminate progressSize={16} />
              <ScreenReader>{`Uploading ${file.file.name}`}</ScreenReader>
            </Utility>
          )}
          {file.uploaded && !file.error && (
            <Utility>
              <VisaSuccessTiny
                style={
                  {
                    '--v-icon-primary': 'var(--palette-messaging-text-positive)',
                    '--v-icon-secondary': 'var(--palette-messaging-text-positive)',
                  } as CSSProperties
                }
              />
              <ScreenReader>Success</ScreenReader>
            </Utility>
          )}
          {!file.uploaded && file.error && (
            <Utility style={{ display: 'inline-block', blockSize: 'var(--v-icon-tiny-height)' }}>
              <VisaErrorTiny
                style={
                  {
                    '--v-icon-primary': 'var(--palette-messaging-text-negative)',
                    '--v-icon-secondary': 'var(--palette-messaging-text-negative)',
                  } as CSSProperties
                }
              />
              <ScreenReader>Error</ScreenReader>
            </Utility>
          )}
        </Utility>
      </Td>

      {/* Upload date cell */}
      <Td>{file.uploadDate ? file.uploadDate.toLocaleString() : ''}</Td>

      {/* Actions cell with retry and delete buttons */}
      <Td>
        <Utility vFlex>
          {/* Show retry button only when file has error */}
          {!!file.error && (
            <UtilityFragment vAlignSelf="stretch" style={{ '--v-button-default-block-size': '34px' } as CSSProperties}>
              <Button
                ref={retryRef as unknown as RefObject<HTMLButtonElement>}
                aria-label={`Retry uploading ${file.file.name}`}
                aria-describedby={`${errorId}`}
                colorScheme="tertiary"
                iconButton
                onClick={() => focusStatusAndRetry()}
              >
                <VisaReloadTiny />
              </Button>
            </UtilityFragment>
          )}
          {/* Delete button always visible */}
          <UtilityFragment vAlignSelf="stretch" style={{ '--v-button-default-block-size': '34px' } as CSSProperties}>
            <Button aria-label={`Delete ${file.file.name}`} colorScheme="tertiary" iconButton onClick={onDelete}>
              <VisaDeleteTiny />
            </Button>
          </UtilityFragment>
        </Utility>
      </Td>
    </Tr>
  );
};
