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
import { fireEvent, render, screen, act, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import MultiFileUpload, { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '../multi-file-upload';
import { mockUpload } from '../shared/mock-upload';

vi.mock('../shared/mock-upload', () => ({
  mockUpload: vi.fn(),
}));

describe('MultiFileUpload', () => {
  const mockUploadFn = mockUpload as jest.MockedFunction<typeof mockUpload>;

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render correctly', async () => {
    const { container } = render(<MultiFileUpload />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    expect(container).toMatchSnapshot();
  });

  it('should trigger file input when Select file(s) button is clicked', () => {
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const selectButton = screen.getByText('Select file(s)');

    const clickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(selectButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should process files when files are selected via input', async () => {
    mockUploadFn.mockResolvedValue();

    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(mockUploadFn).toHaveBeenCalledWith(
      expect.objectContaining({
        file: expect.objectContaining({
          name: 'test.pdf',
          type: 'application/pdf',
        }),
      }),
      {
        maxFileSize: MAX_FILE_SIZE,
        acceptedFileTypes: ACCEPTED_FILE_TYPES.map(t => t.type),
      }
    );
  });

  it('should handle drag and drop functionality', async () => {
    mockUploadFn.mockResolvedValue();
    render(<MultiFileUpload />);

    const dropZone = screen.getByText('Drag and drop files or').parentElement as HTMLElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.dragOver(dropZone);
    await act(async () => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(mockUploadFn).toHaveBeenCalled();
  });

  it('should show error message for unsupported file types', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockRejectedValue(new Error('File type not accepted.'));
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const unsupportedFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [unsupportedFile] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    const errorMessage = screen.getByText('The following files have errors:');
    const errorList = within(errorMessage.parentElement as HTMLElement).getByRole('list');
    expect(within(errorList).getByText('test.txt')).toBeInTheDocument();
  });

  it('should delete file when delete button is clicked', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockResolvedValue();
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText(/^Delete/);
    fireEvent.click(deleteButton);

    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });

  it('should retry file upload when retry button is clicked', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockRejectedValueOnce(new Error('Upload failed')).mockResolvedValueOnce();

    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    const retryButton = screen.getByLabelText(/^Retry upload/);

    fireEvent.click(retryButton);

    await act(async () => {
      vi.runAllTimers();
    });

    const fileListItem = screen.getByRole('listitem');
    expect(within(fileListItem).getByLabelText(/^Success/)).toBeInTheDocument();
  });

  it('should show success flag when all files are uploaded successfully', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockResolvedValue();
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText('Files uploaded successfully.')).toBeInTheDocument();
  });

  it('should close section message when close button is clicked', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockRejectedValue(new Error('File size exceeds the 25MB limit.'));
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = new File(['x'.repeat(26 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText('The following files have errors:')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('The following files have errors:')).not.toBeInTheDocument();
  });

  it('should close success flag when close button is clicked', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockResolvedValue();
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText('Files uploaded successfully.')).toBeInTheDocument();

    const flagCloseButton = screen.getByLabelText('Close');
    fireEvent.click(flagCloseButton);

    expect(screen.queryByText('Files uploaded successfully.')).not.toBeInTheDocument();
  });

  it('should retry all files when retry all button is clicked', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockRejectedValue(new Error('Upload failed'));

    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile1 = new File(['x'.repeat(26 * 1024 * 1024)], 'large1.pdf', { type: 'application/pdf' });
    const largeFile2 = new File(['x'.repeat(26 * 1024 * 1024)], 'large2.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile1, largeFile2] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText('The following files have errors:')).toBeInTheDocument();

    mockUploadFn.mockResolvedValue();

    const retryAllButton = screen.getByText('Retry all');
    fireEvent.click(retryAllButton);

    await act(async () => {
      vi.runAllTimers();
    });

    const fileListItems = screen.getAllByRole('listitem');
    expect(fileListItems).toHaveLength(2);
    fileListItems.forEach(item => {
      expect(within(item).getByLabelText(/^Successfully/)).toBeInTheDocument();
    });
  });

  it('should prevent duplicate files from being added', async () => {
    vi.useFakeTimers();
    mockUploadFn.mockResolvedValue();
    const { container } = render(<MultiFileUpload />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      vi.runAllTimers();
    });

    const fileElements = screen.getAllByText('test.pdf');
    expect(fileElements).toHaveLength(1);
  });
});
