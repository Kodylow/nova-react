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
import React from 'react';
import { Utility, UtilityFragment, Surface, Typography, ScreenReader } from '@visa/nova-react';
import { VisaErrorTiny } from '@visa/nova-icons-react';
import type { UploadFile, UploadCardProps } from './types';

/**
 * Generates unique ID for error message to link with aria-describedby.
 *
 * @param file - File to generate error ID for
 * @returns Unique error ID or empty string if no error
 */
function getListItemErrorId(file: UploadFile): string {
  if (!file.error) {
    return '';
  }
  return `file-list-error-${file.id}`;
}

/**
 * Card-based file display component showing file icon, name, size, and custom action buttons.
 * Used in list-style upload patterns; includes error state styling and accessible error messaging.
 *
 * @param file - UploadFile object containing file data and state
 * @param renderActions - Render prop function returning action buttons/elements
 */
export const UploadCard: React.FC<UploadCardProps> = ({ file, renderActions }) => {
  const errorId = getListItemErrorId(file);
  const fileNameId = `${file.id}-name`;
  const fileSizeId = `${file.id}-size`;
  const errorMessage = `Error: ${file.error}`;
  const fileSize = `${(file.file.size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <Utility tag="li" vFlex vFlexCol vGap={5}>
      <UtilityFragment vFlex vJustifyContent="between" vPaddingHorizontal={15} vPaddingVertical={7}>
        {/* Card container with error state styling */}
        <Surface
          style={{
            border: file.error
              ? '1px solid var(--palette-messaging-graphics-negative)'
              : '1px solid var(--v-surface-border-color)',
            borderRadius: 'var(--theme-border-radius)',
            wordBreak: 'break-all',
          }}
        >
          {/* File info section with icon, name, and size */}
          <Utility vFlex vAlignItems="center" vGap={8}>
            {file.icon}
            <div>
              <Typography id={fileNameId} tag="h5" variant="label" aria-describedby={errorId}>
                {file.file.name}
              </Typography>
              <Typography id={fileSizeId} variant="label-small" colorScheme="subtle">
                {fileSize}
              </Typography>
              {/* Hidden error message for screen readers */}
              <UtilityFragment vHide={!file.error}>
                <ScreenReader tag="span" id={errorId}>
                  {errorMessage}
                </ScreenReader>
              </UtilityFragment>
            </div>
          </Utility>
          {/* Action buttons area (passed via render prop) */}
          <Utility vFlex vAlignItems="center" vGap={8}>
            {renderActions()}
          </Utility>
        </Surface>
      </UtilityFragment>
      {/* Visible error message below card (aria-hidden since screen reader uses errorId) */}
      <UtilityFragment
        vHide={!file.error}
        vFlex
        vGap={4}
        style={{
          lineHeight: '16px',
          color: 'var(--palette-messaging-text-negative)',
        }}
      >
        <Typography tag="span" variant="label" aria-hidden>
          <VisaErrorTiny
            style={
              {
                '--v-icon-primary': 'var(--palette-messaging-text-negative)',
                '--v-icon-secondary': 'var(--palette-messaging-text-negative)',
              } as React.CSSProperties
            }
          />
          {errorMessage}
        </Typography>
      </UtilityFragment>
    </Utility>
  );
};
