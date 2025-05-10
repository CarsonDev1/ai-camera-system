import api from "@/utils/api";

interface UploadFileResponse {
  message: string;
  status: 'success' | 'error';
  file_url?: string;
  docname?: string;
}

const FileUploadService = {
  /**
   * Uploads a file to the server
   * @param file File to upload
   * @param doctype Document type (e.g., 'Employee')
   * @param docname Document name/ID (e.g., 'HR-EMP-00001')
   * @param isPrivate Whether the file should be private (default: false)
   * @returns Promise with the upload response
   */
  uploadFile: async (
    file: File,
    doctype: string,
    docname: string,
    isPrivate: boolean = false
  ): Promise<UploadFileResponse> => {
    // Create form data object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doctype', doctype);
    formData.append('docname', docname);
    formData.append('is_private', isPrivate ? '1' : '0');

    try {
      const response = await api.post<UploadFileResponse>(
        '/method/upload_file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        message: error instanceof Error ? error.message : 'Unknown error occurred during file upload',
        status: 'error'
      };
    }
  }
};

export default FileUploadService;