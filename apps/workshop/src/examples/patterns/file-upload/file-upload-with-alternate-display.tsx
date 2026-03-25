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
  TableWrapper,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from '@visa/nova-react';
import {
  MessageIcon,
  VisaDocumentPdfLow,
  VisaDocumentLow,
  VisaDocumentPngLow,
  VisaDocumentJpgLow,
  VisaCloseTiny,
  VisaSortableTiny,
  VisaSortAscendingTiny,
  VisaSortDescendingTiny,
} from '@visa/nova-icons-react';

import { useMemo, useRef, useState, type CSSProperties } from 'react';

import { UploadRow } from './shared/upload-row';
import { UploadDialog } from './shared/upload-dialog';
import { SortType, type ColData, type SortKeyType, type UploadFile } from './shared/types';
import { mockUpload } from './shared/mock-upload';

// File size limit - customize as needed
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Accepted file types with corresponding icons - add/remove types as needed
export const ACCEPTED_FILE_TYPES = [
  { type: 'application/pdf', icon: <VisaDocumentPdfLow /> },
  { type: 'image/png', icon: <VisaDocumentPngLow /> },
  { type: 'image/jpeg', icon: <VisaDocumentJpgLow /> },
];

// Dialog configuration - customize as needed
const UPLOAD_DIALOG_TITLE = 'Upload Files';
const UPLOAD_DIALOG_DESCRIPTION =
  'Upload one or more files, up to 10 MB each. Accepted file types are .jpg, .pdf, .docx, and .xlsx. Only files that meet these requirements will be uploaded.';
const uploadQueueDialogId = 'manual-file-upload-alternative-dialog';

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
 * Assigns numeric rank to file status for sorting.
 * Lower numbers sort first: uploading (1) -> uploaded (2) -> error (3)
 *
 * @param file - File to get status rank for
 * @returns Numeric rank for sorting
 */
function getFileStatusRank(file: UploadFile): number {
  if (file.uploading) return 1;
  if (file.uploaded && !file.error) return 2;
  return 3;
}

// Column definitions for the upload table, matching dynamic-table ColData pattern
const columnData: ColData[] = [
  { name: 'File name', sortable: true, identifier: true },
  { name: 'File type', sortable: true },
  { name: 'Status', sortable: true },
  { name: 'Upload date', sortable: true },
  { name: 'Actions', sortable: false, compact: true },
];

/**
 * Sorts upload files based on the current sort key, using the same SortType
 * conventions as the dynamic-table pattern.
 *
 * @param files - Files to sort
 * @param sortKey - Current sort column and direction
 * @returns Sorted copy of files array
 */
function sortUploadFiles(files: UploadFile[], sortKey: SortKeyType): UploadFile[] {
  if (sortKey.direction === SortType.NONE) return files;

  const multiplier = sortKey.direction === SortType.ASC ? 1 : -1;

  return [...files].sort((a, b) => {
    switch (sortKey.column) {
      case 'File name':
        return multiplier * a.file.name.localeCompare(b.file.name, undefined, { numeric: true, sensitivity: 'base' });
      case 'File type':
        return multiplier * a.file.type.localeCompare(b.file.type, undefined, { numeric: true, sensitivity: 'base' });
      case 'Status':
        return multiplier * (getFileStatusRank(a) - getFileStatusRank(b));
      case 'Upload date': {
        const aDate = a.uploadDate ? a.uploadDate.getTime() : 0;
        const bDate = b.uploadDate ? b.uploadDate.getTime() : 0;
        return multiplier * (aDate - bDate);
      }
      default:
        return 0;
    }
  });
}

/**
 * Multiple file upload with Table display featuring sortable columns and upload date tracking.
 * Files are queued in Dialog for manual upload trigger, then displayed in sortable Table with detailed metadata.
 */
const FileUploadWithAlternateDisplay = () => {
  // Hidden file input reference for programmatic triggering
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for managing focus on retry buttons of failed files
  const retryRefs = useRef<Record<string, (element: HTMLDivElement | null) => void>>({});
  const retryElements = useRef<Record<string, HTMLDivElement | null>>({});

  // Files that have been uploaded or are uploading
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  // Files awaiting user confirmation in dialog
  const [queuedFiles, setQueuedFiles] = useState<UploadFile[]>([]);

  // Controls visibility of error section message
  const [showSectionMessage, setShowSectionMessage] = useState(true);

  // Controls visibility of success flag notification
  const [showFlag, setShowFlag] = useState(true);

  // Sort state matching dynamic-table pattern, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: 'File name', direction: SortType.ASC });

  /**
   * Triggers the hidden file input when Select button is clicked.
   */
  const handleSelectFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handles file selection and adds files to queue.
   * Important: Files are NOT uploaded immediately - they are queued in dialog.
   *
   * @param event - Change event from file input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);

      const uploadFiles: UploadFile[] = filesArray.map(f => validateFile(f));

      setQueuedFiles((prevQueuedFiles: UploadFile[]) => {
        const newlyQueuedFiles = uploadFiles
          // Filter out duplicates based on ID to prevent adding same file twice
          .filter(file => !prevQueuedFiles.some(f => f.id === file.id));

        return [...prevQueuedFiles, ...newlyQueuedFiles];
      });
    }
  };

  /**
   * Handles upload button click in dialog.
   * Closes dialog, timestamps files, and initiates concurrent uploads.
   */
  const handleUploadClick = () => {
    handleCloseDialog();

    setUploadedFiles((oldUploadFiles: UploadFile[]) => {
      const newUploadFiles = queuedFiles
        // Filter out files already tracked to prevent re-uploading
        .filter(file => !oldUploadFiles.some(f => f.id === file.id))
        .map(f => ({
          ...f,
          uploading: true,
          uploadDate: new Date(), // Record timestamp when upload begins for display in table
        }));

      newUploadFiles.forEach(newFileItem => {
        // Replace mockUpload with your actual upload API call
        mockUpload(newFileItem, {
          maxFileSize: MAX_FILE_SIZE,
          acceptedFileTypes: ACCEPTED_FILE_TYPES.map(t => t.type),
        })
          .then(() => {
            setUploadedFiles(oldUploadFiles =>
              oldUploadFiles.map(f =>
                f.file === newFileItem.file ? { ...f, uploading: false, uploaded: true, error: undefined } : f
              )
            );
            setShowFlag(true);
          })
          .catch((err: Error) => {
            setUploadedFiles(oldUploadFiles =>
              oldUploadFiles.map(f =>
                f.file === newFileItem.file ? { ...f, uploading: false, uploaded: false, error: err.message } : f
              )
            );
            setShowSectionMessage(true);
          });
      });

      return [...oldUploadFiles, ...newUploadFiles];
    });
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
   * Removes a file from the queue (before upload).
   *
   * @param fileToDelete - File to remove from queue
   */
  const handleDeleteQueuedFile = (fileToDelete: UploadFile) => {
    setQueuedFiles(files => files.filter(file => file.id !== fileToDelete.id));
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
    // Update file state to uploading and clear previous error
    setUploadedFiles(files =>
      files.map(f => (f.id === fileToRetry.id ? { ...fileToRetry, error: undefined, uploading: true } : f))
    );
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
   * Handles dialog close - clears queued files.
   */
  const handleCloseDialog = () => {
    setQueuedFiles([]);
  };

  /**
   * Updates the sort key to trigger table re-sorting.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setSortKey({ column: column.name, direction });
  };

  // Store sorted data and update based on sort key changes
  const sortedFiles = useMemo(() => {
    return sortUploadFiles(uploadedFiles, sortKey);
  }, [uploadedFiles, sortKey]);

  return (
    <Utility vFlex vFlexCol vGap={25}>
      <Utility vFlex vFlexCol vGap={4}>
        <Utility vFlex vFlexCol vGap={16}>
          <Utility vFlex vFlexCol vGap={8} style={{ maxWidth: '400px' }}>
            <Typography tag="h4" variant="subtitle-1">
              Upload files
            </Typography>
            {/* Update instructions to match your MAX_FILE_SIZE and ACCEPTED_FILE_TYPES */}
            <Typography variant="label-small">
              Choose one or more files to upload, up to 10MB each. Accepted file types are .jpg, .pdf, .docx, and .xlsx.
            </Typography>
          </Utility>
          {/* Hidden file input with multiple file support */}
          <ScreenReader<'input'>
            tag={'input'}
            type="file"
            hidden
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          ></ScreenReader>
          <UtilityFragment vAlignSelf="start">
            <Button colorScheme="secondary" onClick={handleSelectFilesClick}>
              Select file(s)
            </Button>
          </UtilityFragment>
        </Utility>
        {/* Always-present live region */}
        <Utility vFlex vFlexCol vGap={8} role="status" style={{ minHeight: '1rem' }}>
          {!!uploadingFiles.length && (
            <Typography variant="label-small">{`Uploading ${uploadingFiles.length} file${uploadingFiles.length > 1 ? 's' : ''}...`}</Typography>
          )}
          {/* Error message with clickable file links for keyboard navigation to retry buttons */}
          {!!erroredFiles.length && showSectionMessage && (
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
        {/* Table view for uploaded files - displays when files exist */}
        {!!sortedFiles.length && (
          <TableWrapper style={{ '--v-table-wrapper-inline-size': '1000px' } as CSSProperties}>
            <Table
              alternate
              style={
                {
                  // Use compact spacing matching dynamic-table default
                  '--v-table-data-padding-block-default': 'var(--v-table-data-padding-block-small)',
                  '--v-table-data-block-default': 'var(--v-table-data-block-small)',
                } as CSSProperties
              }
            >
              <ScreenReader tag="caption">
                File upload table showing file name, type, status, and upload date with sortable columns and action
                buttons for each file.
              </ScreenReader>
              <Thead>
                <Tr>
                  {columnData.map((col, index) => {
                    const sorted = col.name === sortKey.column ? sortKey.direction : SortType.NONE;
                    return (
                      <Th
                        key={index}
                        scope="col"
                        style={col.compact ? { inlineSize: '1%' } : undefined}
                        aria-sort={col.name === sortKey.column ? sortKey.direction : undefined}
                      >
                        <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={4}>
                          {col.compact ? <ScreenReader>{col.name}</ScreenReader> : col.name}
                          {col.sortable && (
                            <Button
                              iconButton
                              buttonSize="small"
                              colorScheme="tertiary"
                              aria-label={`Sort by ${col.name} ${sorted === SortType.ASC ? 'descending' : 'ascending'}`}
                              onClick={() => sort(col, sorted === SortType.ASC ? SortType.DESC : SortType.ASC)}
                            >
                              {sorted === SortType.ASC ? (
                                <VisaSortAscendingTiny />
                              ) : sorted === SortType.DESC ? (
                                <VisaSortDescendingTiny />
                              ) : (
                                <VisaSortableTiny />
                              )}
                            </Button>
                          )}
                        </Utility>
                      </Th>
                    );
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {sortedFiles.map(file => (
                  <UploadRow
                    key={file.id}
                    retryRef={retryRefs.current[file.id]}
                    file={file}
                    onRetry={() => handleRetryFile(file)}
                    onDelete={() => handleDeleteFile(file)}
                  />
                ))}
              </Tbody>
            </Table>
          </TableWrapper>
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
      {/* Dialog shows when files are queued - opens automatically when queuedFiles has items */}
      <UploadDialog
        isOpen={queuedFiles.length > 0}
        title={UPLOAD_DIALOG_TITLE}
        description={UPLOAD_DIALOG_DESCRIPTION}
        queuedFiles={queuedFiles}
        onSelectFiles={handleSelectFilesClick}
        onUpload={handleUploadClick}
        onClose={handleCloseDialog}
        onDeleteQueuedFile={handleDeleteQueuedFile}
        dialogId={uploadQueueDialogId}
      />
    </Utility>
  );
};

export default FileUploadWithAlternateDisplay;
