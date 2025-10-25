interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export function ok<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function fail(message: string): ApiResponse {
  return {
    success: false,
    message,
  };
}
