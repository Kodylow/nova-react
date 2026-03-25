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

import type { UploadFile } from './types';

/**
 * Configuration options for mock upload.
 */
export interface MockUploadOptions {
  maxFileSize: number; // Maximum file size in bytes
  acceptedFileTypes: string[]; // Array of accepted MIME types
}

/**
 * Mock utility simulating file upload with 5-second delay and validation.
 *
 * @param uploadFile - File to upload
 * @param options - Validation options
 * @returns Promise that resolves on success or rejects with error message
 */
export const mockUpload = (uploadFile: UploadFile, options: MockUploadOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay (5 seconds)
    setTimeout(() => {
      let fileError;

      // Validate file size
      if (uploadFile.file.size > options.maxFileSize) {
        fileError = 'File size is too large.';
      }

      // Validate file type
      if (!options.acceptedFileTypes.includes(uploadFile.file.type)) {
        fileError = 'File type not accepted.';
      }

      if (fileError) {
        reject(new Error(fileError));
        return;
      }

      // Simulate successful upload
      resolve();
    }, 5000);
  });
};
