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

/**
 * Shared Types for File Upload Patterns
 *
 * Type definitions for data structures and component props used across all file upload pattern variants.
 * Includes UploadFile for tracking file state, and props types for UploadDialog, UploadCard, UploadRow, and FileStatusButton components.
 */

/**
 * Represents a file being tracked in the upload system.
 *
 * @property file - Native File object from browser
 * @property id - Unique identifier combining filename and size for duplicate detection
 * @property icon - React element for file type icon (optional)
 * @property uploaded - True when file has successfully uploaded (optional)
 * @property uploading - True while file is being uploaded (optional)
 * @property error - Error message string if upload failed (optional)
 * @property uploadDate - Timestamp when upload started (optional, used in table display variant)
 */
export type UploadFile = {
  file: File;
  id: string;
  icon?: React.ReactElement;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
  uploadDate?: Date;
};

/**
 * Props for UploadDialog component.
 * Used in manual upload patterns to show file queue before uploading.
 *
 * @property isOpen - Controls dialog visibility
 * @property title - Dialog title text (optional, defaults to "Upload files")
 * @property description - Instructional text displayed in dialog
 * @property queuedFiles - Array of files awaiting upload
 * @property onSelectFiles - Callback to open file picker
 * @property onUpload - Callback to initiate upload for queued files
 * @property onClose - Callback to close dialog
 * @property onDeleteQueuedFile - Callback to remove file from queue
 * @property dialogId - Unique ID for dialog element (optional)
 */
export type UploadDialogProps = {
  isOpen: boolean;
  title?: string;
  description: string;
  queuedFiles: UploadFile[];
  onSelectFiles: () => void;
  onUpload: () => void;
  onClose: () => void;
  onDeleteQueuedFile: (file: UploadFile) => void;
  dialogId?: string;
};

/**
 * Props for UploadCard component.
 * Displays file information in card format for list-based upload patterns.
 *
 * @property file - File to display
 * @property renderActions - Render prop function returning action buttons
 */
export type UploadCardProps = {
  file: UploadFile;
  renderActions: () => React.ReactNode;
};

/**
 * Props for UploadRow component.
 * Displays file information in table row format for table-based upload patterns.
 *
 * @property file - File to display
 * @property retryRef - Ref for retry button to enable keyboard navigation focus
 * @property onRetry - Callback to retry failed upload
 * @property onDelete - Callback to delete file
 */
export type UploadRowProps = {
  file: UploadFile;
  retryRef: React.RefObject<HTMLDivElement> | ((element: HTMLDivElement | null) => void);
  onRetry: () => void;
  onDelete: () => void;
};

/**
 * Props for FileStatusButton component.
 * Displays dynamic status indicator that changes based on upload state.
 *
 * @property uploadFile - File to show status for
 * @property onRetry - Callback to retry failed upload
 */
export interface FileStatusButtonProps {
  uploadFile: UploadFile;
  onRetry: () => void;
}

/**
 * Column data type definition, matching the dynamic-table pattern.
 *
 * @property compact - (optional) Whether the column should use compact spacing
 * @property identifier - (optional) Whether this column serves as the row identifier
 * @property name - Display name of the column
 * @property sortable - Whether the column supports sorting
 */
export type ColData = {
  compact?: boolean;
  identifier?: boolean;
  name: string;
  sortable: boolean;
};

/**
 * Sort key type definition.
 *
 * @property column - Name of the column to sort by
 * @property direction - Sort direction (ascending, descending, or none)
 */
export type SortKeyType = {
  column: string;
  direction: SortType;
};

/**
 * Sort type constants mapping to aria-sort attribute values.
 */
export const SortType = {
  NONE: 'none',
  ASC: 'ascending',
  DESC: 'descending',
} as const;
export type SortType = (typeof SortType)[keyof typeof SortType];
