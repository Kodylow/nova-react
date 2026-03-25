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
 * Single file upload with automatic upload on selection and inline progress display.
 * Includes error handling with retry functionality and success notification via Flag.
 */
const SingleFileUpload = () => {
  // Hidden file input reference for programmatic triggering
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current file being uploaded/displayed
  const [uploadedFile, setUploadedFile] = useState<UploadFile | undefined>();

  // Controls visibility of error section message
  const [showSectionMessage, setShowSectionMessage] = useState(true);

  // Controls visibility of success flag notification
  const [showFlag, setShowFlag] = useState(true);

  /**
   * Triggers the hidden file input when Select button is clicked.
   */
  const handleSelectFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handles file selection and initiates automatic upload.
   * Validates file, sets uploading state, and calls upload API.
   * Important: Upload starts immediately upon file selection.
   *
   * @param event - Change event from file input containing selected file
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const uploadFile = validateFile(file);

      setUploadedFile({ ...uploadFile, uploading: true });

      // Replace mockUpload with your actual upload API call
      mockUpload(uploadFile, {
        maxFileSize: MAX_FILE_SIZE,
        acceptedFileTypes: ACCEPTED_FILE_TYPES.map(t => t.type),
      })
        .then(() => {
          setUploadedFile(previousFile => {
            // Ensure file wasn't deleted during upload
            if (!previousFile) {
              return undefined;
            }
            // Ensure we're updating the correct file (prevents race conditions)
            if (previousFile.id !== uploadFile.id) {
              return previousFile;
            }
            return {
              ...uploadFile,
              uploading: false,
              uploaded: true,
              error: undefined,
            };
          });
          setShowSectionMessage(true);
        })
        .catch((err: Error) => {
          setUploadedFile(previousFile => {
            // Ensure file wasn't deleted during upload
            if (!previousFile) {
              return undefined;
            }
            // Ensure we're updating the correct file (prevents race conditions)
            if (previousFile.id !== uploadFile.id) {
              return previousFile;
            }
            return {
              ...uploadFile,
              uploading: false,
              uploaded: false,
              error: err.message,
            };
          });
          setShowSectionMessage(true);
        });
    }
  };

  /**
   * Removes the uploaded file from display.
   * Hides success flag if deleting an errored file.
   *
   * @param fileToDelete - File to remove from the uploaded file list
   */
  const handleDeleteFile = (fileToDelete: UploadFile) => {
    setUploadedFile(undefined);

    if (fileToDelete.error) {
      setShowFlag(false);
    }
  };

  /**
   * Retries upload for a failed file.
   * Re-validates file and attempts upload again.
   *
   * @param fileToRetry - File with error state to retry uploading
   */
  const handleRetryFile = (fileToRetry: UploadFile) => {
    const validatedFile = validateFile(fileToRetry.file);

    setUploadedFile({ ...validatedFile, uploading: true });
    setShowSectionMessage(true);

    mockUpload(fileToRetry, {
      maxFileSize: MAX_FILE_SIZE,
      acceptedFileTypes: ACCEPTED_FILE_TYPES.map(t => t.type),
    })
      .then(() => {
        setUploadedFile(previousFile => {
          // Ensure file wasn't deleted during retry
          if (!previousFile) {
            return undefined;
          }
          // Ensure we're updating the correct file (prevents race conditions)
          if (previousFile.id !== fileToRetry.id) {
            return previousFile;
          }
          return {
            ...fileToRetry,
            uploading: false,
            uploaded: true,
            error: undefined,
          };
        });
        setShowFlag(true);
      })
      .catch((err: Error) => {
        setUploadedFile(previousFile => {
          // Ensure file wasn't deleted during retry
          if (!previousFile) {
            return undefined;
          }
          // Ensure we're updating the correct file (prevents race conditions)
          if (previousFile.id !== fileToRetry.id) {
            return previousFile;
          }
          return {
            ...fileToRetry,
            uploading: false,
            uploaded: false,
            error: err.message,
          };
        });
        setShowFlag(true);
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

  return (
    <Utility vFlex vFlexCol vGap={25}>
      <Utility vFlex vFlexCol vGap={4} style={{ maxWidth: '400px' }}>
        <Utility vFlex vFlexCol vGap={16}>
          <Utility vFlex vFlexCol vGap={8}>
            <Typography tag="h4" variant="subtitle-1">
              Upload file
            </Typography>
            {/* Update instructions to match your MAX_FILE_SIZE and ACCEPTED_FILE_TYPES */}
            <Typography variant="label-small">
              Choose one file to upload, up to 25 MB each. Accepted file types are .pdf, .png, and .jpg.
            </Typography>
          </Utility>
          <>
            {/* Hidden file input - triggered programmatically by Select button */}
            <ScreenReader<'input'>
              tag={'input'}
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            ></ScreenReader>
            <UtilityFragment vAlignSelf="start">
              <Button colorScheme="secondary" onClick={handleSelectFilesClick}>
                Select file
              </Button>
            </UtilityFragment>
          </>
        </Utility>
        {/* Always-present live region */}
        <div role="status" style={{ minHeight: '1rem' }}>
          {uploadedFile?.uploading && <Typography variant="label-small">Upload in progress...</Typography>}
          {uploadedFile?.error && showSectionMessage && (
            <UtilityFragment vMarginVertical={21}>
              <SectionMessage messageType="error">
                <MessageIcon messageType="error" />
                <UtilityFragment vPaddingLeft={2} vPaddingBottom={2}>
                  <SectionMessageContent style={{ wordBreak: 'break-all' }}>
                    <Typography>File failed to upload.</Typography>
                  </SectionMessageContent>
                </UtilityFragment>
                <SectionMessageCloseButton onClick={handleSectionMessageClose}>
                  <VisaCloseTiny />
                </SectionMessageCloseButton>
              </SectionMessage>
            </UtilityFragment>
          )}
        </div>
        {/* Display uploaded file with status and actions */}
        {!!uploadedFile && (
          <Utility tag="ul">
            <UploadCard
              file={uploadedFile}
              renderActions={() => (
                <>
                  <FileStatusButton uploadFile={uploadedFile} onRetry={() => handleRetryFile(uploadedFile)} />
                  <Button
                    aria-label={`Delete ${uploadedFile.file.name}`}
                    colorScheme="tertiary"
                    iconButton
                    onClick={() => handleDeleteFile(uploadedFile)}
                  >
                    <VisaDeleteTiny />
                  </Button>
                </>
              )}
            />
          </Utility>
        )}
      </Utility>
      {/* Success notification - positioned at bottom right */}
      <Utility role="alert" vAlignSelf="end">
        {showFlag && uploadedFile && uploadedFile.uploaded && (
          <Flag messageType="success">
            <MessageIcon messageType="success" />
            <FlagContent className="v-pl-2 v-pb-2">File uploaded successfully.</FlagContent>
            <FlagCloseButton onClick={handleFlagClose}>
              <VisaCloseTiny />
            </FlagCloseButton>
          </Flag>
        )}
      </Utility>
    </Utility>
  );
};

export default SingleFileUpload;
