import { API_URL } from './config';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    mode: 'cors'
  };

  try {
    // Log request details for debugging
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
        error: errorText
      });
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      console.error('Network error - Backend might be down or CORS issue:', {
        url,
        error: error.message
      });
      throw new Error('Unable to connect to the server. Please try again later.');
    }
    
    console.error('API Request failed:', {
      url,
      error: error.message
    });
    throw error;
  }
}