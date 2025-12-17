// API Configuration – force use of hosted backend
const API_BASE_URL = 'https://josh-backend-0vhk.onrender.com/api';

// Log API URL for debugging
console.log('API Base URL:', API_BASE_URL);

/**
 * Fetch all images from the backend API
 */
export async function fetchImages() {
  const url = `${API_BASE_URL}/images`;
  console.log('Fetching images from:', url);
  
  try {
    const response = await fetch(url);
    console.log('API Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    console.error('API URL was:', url);
    // Re-throw the error so gallery-loader can handle it properly
    throw error;
  }
}

/**
 * Fetch images by category
 */
export async function fetchImagesByCategory(category) {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${category} images:`, error);
    return [];
  }
}

/**
 * Upload an image to the backend
 */
export async function uploadImage(file, category, caption = '') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('caption', caption);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete an image from the backend
 */
export async function deleteImage(imageId) {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/${imageId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
