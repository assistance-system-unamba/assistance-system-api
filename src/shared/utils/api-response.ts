export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
  }
  
  export function buildResponse<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }
  