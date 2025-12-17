import { fetchImages } from './api.js';

/**
 * Load images from API and populate the gallery
 * Falls back to existing HTML if API is unavailable
 */
export async function loadGalleryFromAPI() {
  const galleryContainer = document.getElementById('galleryContainer');
  if (!galleryContainer) return;

  // Always clear the gallery container first (remove hardcoded HTML)
  const loadingElement = galleryContainer.querySelector('.gallery-loading');
  galleryContainer.innerHTML = '';
  if (loadingElement) {
    galleryContainer.appendChild(loadingElement);
  } else {
    // Add loading indicator if it doesn't exist
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'gallery-loading';
    loadingDiv.id = 'galleryLoading';
    loadingDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px;';
    loadingDiv.innerHTML = '<p style="color: #666; font-size: 18px;">Loading memories...</p>';
    galleryContainer.appendChild(loadingDiv);
  }

  try {
    console.log('Loading images from API...');
    const images = await fetchImages();
    console.log('Received images:', images);
    
    // Check if we have any images from API
    const hasImages = images && (images.josh?.length > 0 || images.family?.length > 0 || images.friends?.length > 0);
    
    if (!hasImages) {
      console.log('No images found in API. Images object:', images);
      galleryContainer.innerHTML = '<div class="gallery-loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p style="color: #666; font-size: 18px;">No images available</p></div>';
      return;
    }

    console.log(`Loaded ${images.josh?.length || 0} Josh, ${images.family?.length || 0} Family, ${images.friends?.length || 0} Friends images from API`);

    // Clear loading indicator and render images from API
    galleryContainer.innerHTML = '';
    renderImages(images, galleryContainer);
    
    // Re-initialize gallery functionality
    initializeGallery();
  } catch (error) {
    console.error('Failed to load gallery from API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    galleryContainer.innerHTML = '<div class="gallery-loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p style="color: #d32f2f; font-size: 18px;">Failed to load images. Please check the console for details.</p><p style="color: #999; font-size: 14px; margin-top: 10px;">' + error.message + '</p></div>';
  }
}

/**
 * Render images into the gallery container
 */
function renderImages(images, container) {
  const categories = ['josh', 'family', 'friends'];
  
  categories.forEach(category => {
    images[category].forEach((image, index) => {
      const galleryItem = createGalleryItem(image, category);
      container.appendChild(galleryItem);
    });
  });
}

/**
 * Create a gallery item element from image data
 */
function createGalleryItem(image, category) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.category = category;
  item.dataset.image = image.url;
  
  // Create media element based on resource type
  let mediaEl;
  if (image.resourceType === 'video') {
    mediaEl = document.createElement('video');
    mediaEl.src = image.url;
    mediaEl.controls = true;
    mediaEl.preload = 'metadata';
    // Add a class to secure specific styling if needed
    mediaEl.className = 'gallery-media';
  } else {
    mediaEl = document.createElement('img');
    mediaEl.src = image.url;
    mediaEl.alt = `${category} Memory ${image.id}`;
    mediaEl.loading = 'lazy';
    mediaEl.className = 'gallery-media';
  }

  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  
  const categorySpan = document.createElement('span');
  categorySpan.className = 'gallery-category';
  categorySpan.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  overlay.appendChild(categorySpan);

  const caption = document.createElement('p');
  caption.className = 'gallery-caption';
  caption.textContent = image.caption || '';

  item.appendChild(mediaEl);
  item.appendChild(overlay);
  item.appendChild(caption);

  return item;
}

/**
 * Re-initialize gallery functionality after dynamic loading
 */
function initializeGallery() {
  // Trigger a custom event that main.js can listen to
  window.dispatchEvent(new CustomEvent('galleryReloaded', { 
    detail: { message: 'Gallery images loaded from API' } 
  }));
}
