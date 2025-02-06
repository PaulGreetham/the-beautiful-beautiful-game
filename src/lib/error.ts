export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown): {
  message: string;
  status: number;
  code?: string;
} {
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code
    };
  }
  
  console.error('Unhandled error:', error);
  return { 
    message: 'An unexpected error occurred', 
    status: 500, 
    code: 'INTERNAL_SERVER_ERROR' 
  };
} 