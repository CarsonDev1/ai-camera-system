import api from "@/utils/api";

interface UploadFileResponse {
  message: any;
  status: 'success' | 'error';
  file_url?: string;
}

const FileUploadService = {
  /**
   * Uploads a file to the server
   * @param file File to upload
   * @param isPrivate Whether the file should be private (default: false)
   * @returns Promise with the upload response
   */
  uploadFile: async (
    file: File,
    docname: string = '',
    isPrivate: boolean = false
  ): Promise<UploadFileResponse> => {
    // Create form data object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_private', isPrivate ? '1' : '0');


    if (docname) {
      formData.append('docname', docname);
    }

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

      // Kiểm tra và format lại phản hồi từ API
      if (response.data && response.data.message && response.data.message.file_url) {
        return {
          message: response.data.message,
          status: 'success',
          file_url: response.data.message.file_url
        };
      }

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