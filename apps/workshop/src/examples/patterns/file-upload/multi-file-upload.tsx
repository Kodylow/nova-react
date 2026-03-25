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

import {
  Button,
  Flag,
  FlagCloseButton,
  FlagContent,
  ScreenReader,
  SectionMessage,
  SectionMessageCloseButton,
  SectionMessageContent,
  Typography,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import {
  MessageIcon,
  VisaDocumentPdfLow,
  VisaDeleteTiny,
  VisaDocumentLow,
  VisaDocumentPngLow,
  VisaDocumentJpgLow,
  VisaCloseTiny,
} from '@visa/nova-icons-react';
import type { UploadFile } from './shared/types';
import { UploadCard } from './shared/upload-card';
import { FileStatusButton } from './shared/file-status-button';
import { mockUpload } from './shared/mock-upload';

import { useRef, useState } from 'react';

// File size limit - customize as needed
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Accepted file types with corresponding icons - add/remove types as needed
export const ACCEPTED_FILE_TYPES = [
  { type: 'application/pdf', icon: <VisaDocumentPdfLow /> },
  { type: 'image/png', icon: <VisaDocumentPngLow /> },
  { type: 'image/jpeg', icon: <VisaDocumentJpgLow /> },
];

/**
 * Validates and prepares a file for upload.
 * Assigns appropriate icon based on file type and creates a unique ID for tracking.
 *
 * @param f - Native File object from browser
 * @returns UploadFile object with icon, unique ID, and file reference
 */
const validateFile = (f: File): UploadFile => {
  let icon = undefined;
  const acceptedTypeObj = ACCEPTED_FILE_TYPES.find(t => t.type === f.type);
  if (!acceptedTypeObj) {
    icon = <VisaDocumentLow />;
  } else {
    icon = acceptedTypeObj.icon;
  }

  return {
    file: f,
    // Create unique ID combining sanitized filename and size for duplicate detection
    id: `${f.name.replace(/[^a-zA-Z0-9-_]/g, '-')}-${f.size}`,
    icon,
  };
};

/**
 * Multiple file upload with drag-and-drop support and concurrent automatic uploads.
 * Includes duplicate detection, batch retry functionality, and clickable error file links for keyboard navigation.
 */
const MultiFileUpload = () => {
  // Hidden file input reference for programmatic triggering
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for managing focus on retry buttons of failed files
  const retryRefs = useRef<Record<string, (element: HTMLDivElement | null) => void>>({});
  const retryElements = useRef<Record<string, HTMLDivElement | null>>({});

  // Array of all files being tracked (uploading, uploaded, or failed)
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  // Controls visibility of error section message
  const [showSectionMessage, setShowSectionMessage] = useState(true);

  // Controls visibility of success flag notification
  const [showFlag, setShowFlag] = useState(true);

  // Tracks drag state for visual feedback
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Processes selected or dropped files.
   * Validates files, filters duplicates, and initiates upload for each.
   * Important: All uploads start concurrently.
   *
   * @param files - FileList from input or drop event
   */
  const processFiles = (files: FileList) => {
    const filesArray = Array.from(files);

    const validatedFiles: UploadFile[] = filesArray.map(f => {
      return validateFile(f);
    });

    setUploadedFiles((prevValidatedFiles: UploadFile[]) => {
      const newlyValidatedFiles = validatedFiles
        // Filter out duplicates based on ID to prevent re-uploading same file
        .filter(file => !prevValidatedFiles.some(f => f.id === file.id))
        .map(f => ({
          ...f,
          uploading: true,
        }));

      newlyValidatedFiles.forEach(newFileItem => {
        // Replace mockUpload with your actual upload API call
        mockUpload(newFileItem, {
          maxFileSize: MAX_FILE_SIZE,
          acceptedFileTypes: ACCEPTED_FILE_TYPES.map(t => t.type),
        })
          .then(() => {
            setUploadedFiles(current =>
              current.map(f =>
                f.file === newFileItem.file ? { ...f, uploading: false, uploaded: true, error: undefined } : f
              )
            );
            setShowFlag(true);
          })
          .catch((err: Error) => {
            setUploadedFiles(current =>
              current.map(f =>
                f.file === newFileItem.file ? { ...f, uploading: false, uploaded: false, error: err.message } : f
              )
            );
            setShowSectionMessage(true);
          });
      });

      return [...prevValidatedFiles, ...newlyValidatedFiles];
    });
  };

  /**
   * Triggers the hidden file input when Select button is clicked.
   */
  const handleSelectFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handles file input change and processes selected files.
   *
   * @param event - Change event from file input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  /**
   * Removes a file from the uploaded files list.
   * Hides success flag if deleting an errored file.
   *
   * @param fileToDelete - File to remove from tracking
   */
  const handleDeleteFile = (fileToDelete: UploadFile) => {
    setUploadedFiles(files => files.filter(file => file.id !== fileToDelete.id));
    if (fileToDelete.error) {
      setShowFlag(false);
    }
  };

  /**
   * Retries all failed file uploads.
   */
  const handleRetryAll = () => {
    erroredFiles.forEach(f => handleRetryFile(f));
  };

  /**
   * Retries upload for a single failed file.
   *
   * @param fileToRetry - File with error state to retry
   */
  const handleRetryFile = (fileToRetry: UploadFile) => {
    const validatedFile = validateFile(fileToRetry.file);

    setUploadedFiles(files => files.map(f => (f.id === fileToRetry.id ? { ...validatedFile, uploading: true } : f)));
    setShowSectionMessage(true);

    mockUpload(fileToRetry, {
      maxFileSize: MAX_FILE_SIZE,
      acceptedFileTypes: ACCEPTED_FILE_TYPES.map(t => t.type),
    })
      .then(() => {
        setUploadedFiles(files =>
          files.map(f =>
            f.file.name === fileToRetry.file.name && f.file.size === fileToRetry.file.size
              ? { ...f, uploading: false, uploaded: true, error: undefined }
              : f
          )
        );

        setShowFlag(true);
      })
      .catch(err => {
        setUploadedFiles(files =>
          files.map(f =>
            f.file.name === fileToRetry.file.name && f.file.size === fileToRetry.file.size
              ? {
                  ...f,
                  uploading: false,
                  uploaded: false,
                  error: err?.message || 'Error: Failed to upload file to server.',
                }
              : f
          )
        );

        setShowSectionMessage(true);
      });
  };

  /**
   * Hides the error section message.
   */
  const handleSectionMessageClose = () => {
    setShowSectionMessage(false);
  };

  /**
   * Hides the success flag notification.
   */
  const handleFlagClose = () => {
    setShowFlag(false);
  };

  /**
   * Handles file drop events.
   * Processes dropped files immediately.
   *
   * @param event - Drag event containing dropped files
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    setIsDragging(false);
  };

  /**
   * Handles drag over events to prevent default behavior and show visual feedback.
   *
   * @param event - Drag event during drag over
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles drag leave events to remove visual feedback.
   *
   * @param event - Drag event when leaving drop zone
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // Computed values for UI state
  const erroredFiles = uploadedFiles.filter(f => !!f.error);
  const uploadingFiles = uploadedFiles.filter(f => !!f.uploading);
  const allFilesUploaded =
    uploadedFiles.length > 0 && uploadedFiles.filter(f => f.uploaded).length === uploadedFiles.length;

  // Create callback refs for retry buttons to enable keyboard navigation to errors
  erroredFiles.forEach(f => {
    if (!retryRefs.current[f.id]) {
      retryRefs.current[f.id] = (element: HTMLDivElement | null) => {
        retryElements.current[f.id] = element;
      };
    }
  });

  return (
    <Utility vFlex vFlexCol vGap={25}>
      <Utility vFlex vFlexCol vGap={4} style={{ maxWidth: '400px' }}>
        <Utility vFlex vFlexCol vGap={16}>
          <Utility vFlex vFlexCol vGap={8}>
            <Typography tag="h4" variant="subtitle-1">
              Upload files
            </Typography>
            {/* Update instructions to match your MAX_FILE_SIZE and ACCEPTED_FILE_TYPES */}
            <Typography variant="label-small">
              Choose one or more files to upload, up to 25 MB each. Accepted file types are .pdf, .png, and .jpg.
            </Typography>
          </Utility>
          {/* Drag-and-drop zone with visual feedback when dragging */}
          <Utility
            vFlex
            vFlexCol
            vJustifyContent="center"
            vAlignItems="center"
            vGap={8}
            style={{
              border: '1px solid var(--palette-default-active)',
              borderRadius: 'var(--theme-border-radius)',
              height: '158px',
              background: isDragging ? 'var(--palette-default-surface-highlight)' : 'initial',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Hidden file input with multiple file support */}
            <ScreenReader<'input'>
              tag="input"
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            ></ScreenReader>
            <Typography>Drag and drop files or</Typography>
            <Button colorScheme="secondary" onClick={handleSelectFilesClick}>
              Select file(s)
            </Button>
          </Utility>
        </Utility>
        {/* Always-present live region */}
        <Utility vFlex vFlexCol vGap={8} role="status" style={{ minHeight: '1rem' }}>
          {!!uploadingFiles.length && (
            <Typography variant="label-small">{`Uploading ${uploadingFiles.length} file${uploadingFiles.length > 1 ? 's' : ''}...`}</Typography>
          )}
          {/* Error message with clickable file links for keyboard navigation to retry buttons */}
          {!!erroredFiles.length && !uploadingFiles.length && showSectionMessage && (
            <UtilityFragment vMarginVertical={21}>
              <SectionMessage messageType="error">
                <MessageIcon messageType="error" />
                <UtilityFragment vPaddingLeft={2} vPaddingBottom={2}>
                  <SectionMessageContent style={{ wordBreak: 'break-all' }}>
                    <Typography>The following files have errors:</Typography>
                    <UtilityFragment vPaddingLeft={20}>
                      <ul style={{ listStyle: 'initial' }}>
                        {erroredFiles.map(f => (
                          <li key={f.file.name + f.file.size}>
                            <Typography<'a'>
                              tag="a"
                              href="#"
                              onClick={e => {
                                e.preventDefault();
                                retryElements.current[f.id]?.focus();
                              }}
                            >
                              {f.file.name}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </UtilityFragment>
                    {erroredFiles.length > 1 && (
                      <UtilityFragment vMarginTop={8}>
                        <Button colorScheme="secondary" onClick={handleRetryAll}>
                          Retry all
                        </Button>
                      </UtilityFragment>
                    )}
                  </SectionMessageContent>
                </UtilityFragment>
                <SectionMessageCloseButton onClick={handleSectionMessageClose}>
                  <VisaCloseTiny />
                </SectionMessageCloseButton>
              </SectionMessage>
            </UtilityFragment>
          )}
        </Utility>
        {/* Display all tracked files with status and actions */}
        {!!uploadedFiles.length && (
          <Utility tag="ul" vFlex vFlexCol vGap={8} aria-label="Uploaded files">
            {uploadedFiles.map(uploadFile => (
              <UploadCard
                key={uploadFile.id}
                file={uploadFile}
                renderActions={() => (
                  <>
                    <FileStatusButton
                      ref={retryRefs.current[uploadFile.id]}
                      uploadFile={uploadFile}
                      onRetry={() => handleRetryFile(uploadFile)}
                    />
                    <Button
                      aria-label={`Delete ${uploadFile.file.name}`}
                      colorScheme="tertiary"
                      iconButton
                      onClick={() => handleDeleteFile(uploadFile)}
                    >
                      <VisaDeleteTiny />
                    </Button>
                  </>
                )}
              />
            ))}
          </Utility>
        )}
      </Utility>
      {/* Success notification - positioned at bottom right */}
      <Utility role="alert" vAlignSelf="end">
        {showFlag && allFilesUploaded && (
          <Flag messageType="success">
            <MessageIcon messageType="success" />
            <FlagContent className="v-pl-2 v-pb-2">Files uploaded successfully.</FlagContent>
            <FlagCloseButton onClick={handleFlagClose}>
              <VisaCloseTiny />
            </FlagCloseButton>
          </Flag>
        )}
      </Utility>
    </Utility>
  );
};

export default MultiFileUpload;
