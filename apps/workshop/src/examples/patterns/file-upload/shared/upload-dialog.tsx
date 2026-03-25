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
import React, { type CSSProperties, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  Divider,
  Typography,
  Utility,
  UtilityFragment,
  useFocusTrap,
} from '@visa/nova-react';

import { VisaCloseTiny, VisaDeleteTiny } from '@visa/nova-icons-react';

import type { UploadDialogProps } from './types';
import { UploadCard } from './upload-card';

/**
 * Dialog component for reviewing and managing queued files before manual upload.
 * Displays file queue with add/remove capabilities and focus trap for keyboard accessibility.
 */
export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  title = 'Upload files',
  description,
  queuedFiles,
  onSelectFiles,
  onUpload,
  onClose,
  onDeleteQueuedFile,
  dialogId = 'upload-dialog',
}) => {
  // Focus trap ensures keyboard navigation stays within dialog when open
  const { onKeyNavigation, ref: dialogRef } = useFocusTrap();

  // Sync dialog native open/close state with isOpen prop
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal?.();
    } else {
      dialogRef.current?.close?.();
    }
  }, [isOpen]);
  return (
    <UtilityFragment
      style={{ maxWidth: '400px', '--v-message-display': 'block', overflowY: 'auto' } as CSSProperties}
      vPaddingHorizontal={0}
    >
      <Dialog
        aria-describedby={`${dialogId}-description`}
        aria-labelledby={`${dialogId}-title`}
        id={dialogId}
        ref={dialogRef}
        onKeyDown={e => onKeyNavigation(e, dialogRef.current?.open)}
      >
        {/* Close button positioned top-right */}
        <UtilityFragment style={{ marginInlineEnd: 4, float: 'inline-end' }}>
          <DialogCloseButton onClick={onClose}>
            <VisaCloseTiny />
          </DialogCloseButton>
        </UtilityFragment>
        <DialogContent style={{ overflowY: 'visible' }}>
          {/* Header section with title and description */}
          <Utility vPaddingHorizontal={24}>
            <DialogHeader id={`${dialogId}-title`} variant="headline-4">
              {title}
            </DialogHeader>
            <Typography id={`${dialogId}-description`} variant="body-3">
              {description}
            </Typography>
          </Utility>
          {/* Button to add more files */}
          <Utility vAlignItems="center" vFlex vFlexWrap vGap={8} vPaddingTop={16} vPaddingHorizontal={24}>
            <Button colorScheme="secondary" onClick={onSelectFiles}>
              Select file(s)
            </Button>
          </Utility>
          <UtilityFragment vMarginTop={20}>
            <Divider dividerType="decorative" />
          </UtilityFragment>

          {/* File queue list area with minimum height */}
          <UtilityFragment
            vPaddingVertical={12}
            vFlex
            vFlexCol
            vGap={8}
            vPaddingHorizontal={24}
            style={{ minHeight: 'min(25vh, 266px)' }}
          >
            <Utility tag="ul" vFlex vFlexCol vGap={8}>
              {queuedFiles.map(queuedFile => (
                <UploadCard
                  key={queuedFile.id}
                  file={queuedFile}
                  renderActions={() => (
                    <Button
                      aria-label={`Delete ${queuedFile.file.name}`}
                      colorScheme="tertiary"
                      iconButton
                      onClick={() => onDeleteQueuedFile(queuedFile)}
                    >
                      <VisaDeleteTiny />
                    </Button>
                  )}
                />
              ))}
            </Utility>
          </UtilityFragment>
          <UtilityFragment>
            <Divider dividerType="decorative" />
          </UtilityFragment>
          {/* Action buttons: Upload and Cancel */}
          <Utility vAlignItems="center" vFlex vFlexWrap vGap={8} vPaddingTop={16} vPaddingHorizontal={24}>
            <Button onClick={onUpload}>Upload</Button>
            <Button colorScheme="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Utility>
        </DialogContent>
      </Dialog>
    </UtilityFragment>
  );
};
