import { apiRequest } from './queryClient';

let initialized = false;

export async function initializeData() {
  if (initialized) return;
  
  try {
    await apiRequest('POST', '/api/init-data', undefined);
    initialized = true;
    console.log('Sample data initialized');
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
}
