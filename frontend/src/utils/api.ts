interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const API_BASE_URL = 'http://18.156.4.170:8000/api/index.php';

export async function apiCall<T>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    timeout = 10000,
    headers = {}
  } = options;

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`${API_BASE_URL}?path=${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    console.error(`API call failed for ${path}:`, error);
    return {
      data: null as T,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Health check function to test backend connectivity
export async function checkBackendHealth(): Promise<{ isRunning: boolean; responseTime?: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}?path=career-options`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return { isRunning: true, responseTime };
    } else {
      return { 
        isRunning: false, 
        responseTime, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return { 
      isRunning: false, 
      responseTime, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

// Specific API functions
export const careerOptionsApi = () => apiCall<Array<{ id: number; status_name: string }>>('career-options', { timeout: 5000 });

export const registerUserApi = (userData: any) => apiCall<any>('register', {
  method: 'POST',
  body: userData,
  timeout: 10000
});

export const getUsersApi = () => apiCall<any[]>('users', { timeout: 5000 });

export const deleteUserApi = (userId: number) => apiCall<any>('delete-user', {
  method: 'DELETE',
  body: { id: userId },
  timeout: 10000
}); 