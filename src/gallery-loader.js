import { fetchImages } from './api.js';

// Intersection Observer for lazy loading images
let imageObserver = null;

/**
 * Initialize Intersection Observer for lazy loading
 */
function initImageObserver() {
  if ('IntersectionObserver' in window) {
    const options = {
      root: null,
      rootMargin: '50px', // Start loading 50px before image enters viewport
      threshold: 0.01
    };

    imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const img = item.querySelector('img[data-src]');
          const video = item.querySelector('video[data-src]');
          
          if (img) {
            // Load the actual image
            const src = img.dataset.src;
            img.src = src;
            img.removeAttribute('data-src');
            img.removeAttribute('loading');
            
            // Remove loading placeholder and make image visible
            const placeholder = item.querySelector('.image-placeholder');
            if (placeholder) {
              img.addEventListener('load', () => {
                placeholder.style.opacity = '0';
                setTimeout(() => placeholder.remove(), 300);
                img.style.opacity = '1';
                img.style.visibility = 'visible';
              }, { once: true });
            } else {
              // If no placeholder, just make image visible
              img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
              }, { once: true });
            }
          }
          
          if (video) {
            const src = video.dataset.src;
            video.src = src;
            video.removeAttribute('data-src');
          }
          
          // Stop observing once loaded
          imageObserver.unobserve(item);
        }
      });
    }, options);
  }
}

/**
 * Check if element is in viewport (fallback for browsers without IntersectionObserver)
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 100
  );
}

/**
 * Load images from API and populate the gallery
 * Falls back to existing HTML if API is unavailable
 */
export async function loadGalleryFromAPI() {
  const galleryContainer = document.getElementById('galleryContainer');
  if (!galleryContainer) return;

  // Initialize observer
  if (!imageObserver) {
    initImageObserver();
  }

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
    console.log('Images structure keys:', Object.keys(images || {}));
    if (images && typeof images === 'object') {
      Object.keys(images).forEach(key => {
        if (Array.isArray(images[key])) {
          console.log(`  ${key}: ${images[key].length} items`);
          if (images[key].length > 0 && images[key][0]) {
            console.log(`    Sample item keys:`, Object.keys(images[key][0]));
            if (images[key][0].category) {
              console.log(`    Sample item category:`, images[key][0].category);
            }
          }
        }
      });
    }
    
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
    await renderImages(images, galleryContainer);
    
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
 * Render images into the gallery container with progressive loading
 */
async function renderImages(images, container) {
  const categories = ['josh', 'family', 'friends'];
  const allItems = [];
  
  // Collect all images first - ALWAYS use the category from the image object if it exists
  // This handles cases where images might be in the wrong array
  const categoryCounts = { josh: 0, family: 0, friends: 0 };
  
  categories.forEach(arrayCategory => {
    if (images[arrayCategory] && Array.isArray(images[arrayCategory])) {
      if (images[arrayCategory].length > 0) {
        images[arrayCategory].forEach((image, index) => {
          // Try to determine category from multiple sources:
          // 1. Image's category property (if valid)
          // 2. URL path (check if URL contains category folder name)
          // 3. Array name as fallback
          let imageCategory = image.category;
          
          // If category is invalid or all are the same, try to infer from URL
          if (!imageCategory || !categories.includes(imageCategory) || 
              (arrayCategory === 'family' && imageCategory === 'family' && images.family.length > 20)) {
            // Try to detect category from Cloudinary URL path
            const url = image.url || image.publicId || '';
            if (url.includes('/josh-farewell/josh/') || url.includes('/josh/')) {
              imageCategory = 'josh';
            } else if (url.includes('/josh-farewell/friends/') || url.includes('/friends/')) {
              imageCategory = 'friends';
            } else if (url.includes('/josh-farewell/family/') || url.includes('/family/')) {
              imageCategory = 'family';
            } else {
              // Fallback to array category
              imageCategory = arrayCategory;
            }
          }
          
          // Ensure we have a valid category
          if (!categories.includes(imageCategory)) {
            imageCategory = arrayCategory;
          }
          
          allItems.push({ image, category: imageCategory, index });
          categoryCounts[imageCategory] = (categoryCounts[imageCategory] || 0) + 1;
        });
        console.log(`✓ Processed ${images[arrayCategory].length} images from array "${arrayCategory}"`);
      } else {
        console.log(`✗ Array "${arrayCategory}" is empty`);
      }
    } else {
      console.warn(`✗ Array "${arrayCategory}" is missing or not an array`);
    }
  });
  
  console.log(`Final category distribution - Josh: ${categoryCounts.josh}, Family: ${categoryCounts.family}, Friends: ${categoryCounts.friends}`);
  
  // Also check if there's a flat array with category property
  if (Array.isArray(images) && images.length > 0 && images[0].category) {
    console.log('Found flat array structure with category property, processing...');
    images.forEach((image, index) => {
      if (image.category && categories.includes(image.category)) {
        allItems.push({ image, category: image.category, index });
      }
    });
  }
  
  console.log(`Total items to render: ${allItems.length}`);
  
  // Separate visible items (first 12) for immediate loading
  // Try to get a mix from each category for initial display
  const visibleItems = [];
  const lazyItems = [];
  
  // Get first 4 from each category for immediate loading, rest for lazy loading
  categories.forEach(category => {
    const categoryItems = allItems.filter(item => item.category === category);
    categoryItems.slice(0, 4).forEach(item => visibleItems.push(item));
    categoryItems.slice(4).forEach(item => lazyItems.push(item));
  });
  
  // Fill remaining visible slots with any remaining items
  const remainingVisible = 12 - visibleItems.length;
  if (remainingVisible > 0 && lazyItems.length > 0) {
    visibleItems.push(...lazyItems.splice(0, remainingVisible));
  }
  
  console.log(`Visible items: ${visibleItems.length}, Lazy items: ${lazyItems.length}`);
  
  // Use DocumentFragment for batch DOM updates
  const fragment = document.createDocumentFragment();
  
  // Create visible items with eager loading
  visibleItems.forEach(({ image, category }) => {
    const galleryItem = createGalleryItem(image, category, true);
    fragment.appendChild(galleryItem);
  });
  
  // Create lazy items with lazy loading
  lazyItems.forEach(({ image, category }) => {
    const galleryItem = createGalleryItem(image, category, false);
    fragment.appendChild(galleryItem);
  });
  
  // Append all at once for better performance
  const itemsCount = fragment.children.length;
  container.appendChild(fragment);
  
  console.log(`Rendered ${itemsCount} gallery items`);
  
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    // Ensure all items are visible initially (for "all" filter)
    const allGalleryItems = container.querySelectorAll('.gallery-item');
    console.log(`Total gallery items in DOM: ${allGalleryItems.length}`);
    
    // Count items by category
    const categoryCounts = { josh: 0, family: 0, friends: 0 };
    allGalleryItems.forEach((item, idx) => {
      item.classList.remove('hidden', 'fade-out');
      item.style.display = 'block';
      item.style.opacity = '1';
      const cat = item.dataset.category;
      if (categoryCounts.hasOwnProperty(cat)) {
        categoryCounts[cat]++;
      }
      if (idx < 5 || idx >= allGalleryItems.length - 5) {
        // Only log first 5 and last 5 to avoid console spam
        console.log(`Item ${idx}: category="${cat}", lazy="${item.dataset.lazy}"`);
      }
    });
    console.log(`Category breakdown - Josh: ${categoryCounts.josh}, Family: ${categoryCounts.family}, Friends: ${categoryCounts.friends}`);
    
    // Setup observers for lazy-loaded images
    const lazyGalleryItems = container.querySelectorAll('.gallery-item[data-lazy="true"]');
    console.log(`Setting up lazy loading for ${lazyGalleryItems.length} items`);
    
    if (imageObserver) {
      lazyGalleryItems.forEach(item => {
        imageObserver.observe(item);
      });
    } else {
      // Fallback: load images in viewport immediately
      lazyGalleryItems.forEach(item => {
        if (isInViewport(item)) {
          const img = item.querySelector('img[data-src]');
          if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.style.opacity = '1';
            const placeholder = item.querySelector('.image-placeholder');
            if (placeholder) placeholder.remove();
          }
        }
      });
      
      // Scroll listener as fallback
      let scrollTimeout;
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          lazyGalleryItems.forEach(item => {
            if (isInViewport(item) && item.querySelector('img[data-src]')) {
              const img = item.querySelector('img[data-src]');
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.style.opacity = '1';
              const placeholder = item.querySelector('.image-placeholder');
              if (placeholder) {
                placeholder.style.opacity = '0';
                setTimeout(() => placeholder.remove(), 300);
              }
            }
          });
        }, 100);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  });
}

/**
 * Create a gallery item element from image data
 */
function createGalleryItem(image, category, eager = false) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.category = category;
  // Store lightbox URL for full-size view, fallback to regular URL
  item.dataset.image = image.lightbox || image.url;
  item.dataset.lazy = !eager;
  
  // Create placeholder for loading state
  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder';
  placeholder.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    z-index: 1;
  `;
  
  // Create media element based on resource type
  let mediaEl;
  if (image.resourceType === 'video') {
    mediaEl = document.createElement('video');
    if (eager) {
      mediaEl.src = image.url;
      mediaEl.preload = 'metadata';
    } else {
      mediaEl.dataset.src = image.url;
      mediaEl.preload = 'none';
    }
    mediaEl.controls = true;
    mediaEl.playsInline = true;
    mediaEl.className = 'gallery-media';
  } else {
    mediaEl = document.createElement('img');
    mediaEl.alt = `${category} Memory ${image.id || ''}`;
    mediaEl.className = 'gallery-media';
    mediaEl.decoding = 'async';
    mediaEl.style.opacity = eager ? '1' : '0';
    mediaEl.style.transition = 'opacity 0.3s ease-in-out';
    
    // Use thumbnail for gallery grid (faster loading), fallback to url
    const galleryImageUrl = image.thumbnail || image.url;
    // Store lightbox URL for when image is clicked
    item.dataset.lightboxUrl = image.lightbox || image.url;
    
    if (eager) {
      // Load immediately for visible images
      mediaEl.src = galleryImageUrl;
      mediaEl.loading = 'eager';
      mediaEl.setAttribute('fetchpriority', 'high');
      placeholder.style.display = 'none';
    } else {
      // Lazy load with placeholder
      mediaEl.dataset.src = galleryImageUrl;
      mediaEl.loading = 'lazy';
      // Create a tiny transparent pixel as placeholder
      mediaEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    }
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

  // Handle image load
  if (mediaEl.tagName === 'IMG') {
    mediaEl.addEventListener('error', function() {
      console.error('Image failed to load:', this.src);
      placeholder.style.display = 'none';
      this.style.opacity = '0';
    });
    
    if (eager) {
      mediaEl.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.visibility = 'visible';
        placeholder.style.display = 'none';
      }, { once: true });
    } else {
      // For lazy-loaded images, ensure they become visible when loaded
      mediaEl.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.visibility = 'visible';
        const placeholderEl = this.parentElement.querySelector('.image-placeholder');
        if (placeholderEl) {
          placeholderEl.style.opacity = '0';
          setTimeout(() => placeholderEl.remove(), 300);
        }
      }, { once: true });
    }
  }

  item.appendChild(placeholder);
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

// Add shimmer animation CSS if not already present
if (!document.getElementById('gallery-loader-styles')) {
  const style = document.createElement('style');
  style.id = 'gallery-loader-styles';
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .gallery-item {
      position: relative;
    }
    .gallery-item .image-placeholder {
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}
