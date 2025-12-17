// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Fade in elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Animate scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    let scrollCount = 0;
    setInterval(() => {
      scrollIndicator.style.opacity = scrollCount % 2 === 0 ? '0.3' : '1';
      scrollCount++;
    }, 1000);
  }

  // Scroll Progress Indicator
  const scrollProgress = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  });

  // Back to Top Button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Gallery Filter Functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Ensure all gallery items are visible on page load
  galleryItems.forEach(item => {
    item.classList.remove('hidden', 'fade-out');
    item.style.display = 'block';
    item.style.opacity = '1';
    
    // Ensure images load properly
    const img = item.querySelector('img');
    if (img) {
      img.style.display = 'block';
      img.style.opacity = '1';
      img.style.visibility = 'visible';
      
      // Handle image load errors
      img.addEventListener('error', function() {
        console.error('Image failed to load:', this.src);
      });
      
      // Force image to load if lazy loading
      if (img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy') {
        img.loading = 'eager';
      }
    }
  });
  
  // Get all visible images for lightbox
  function getVisibleImages() {
    return Array.from(galleryItems)
      .filter(item => !item.classList.contains('hidden'))
      .map(item => {
        const img = item.querySelector('img');
        return img ? img.src : item.dataset.image;
      });
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Filter gallery items with smooth transitions
      galleryItems.forEach((item, index) => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden', 'fade-out');
          item.style.display = 'block';
          // Stagger the fade-in for smooth effect
          setTimeout(() => {
            item.style.animation = `fadeInScale 0.5s ease-out ${index * 0.05}s both`;
          }, 50);
        } else {
          item.classList.add('fade-out');
          setTimeout(() => {
            item.classList.add('hidden');
            item.style.display = 'none';
          }, 550);
        }
      });
    });
  });

  // Lightbox for Gallery Images
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentImageIndex = 0;

  function openLightbox() {
    if (!lightboxImage) return;
    if (!lightboxImage.src) return;
    lightboxImage.style.display = 'block';
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    const images = getVisibleImages();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImage.src = images[currentImageIndex];
  }

  function showPrevImage() {
    const images = getVisibleImages();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentImageIndex];
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const images = getVisibleImages();
      const imgEl = item.querySelector('img');
      const imageSrc = imgEl ? imgEl.src : item.dataset.image;
      const index = images.indexOf(imageSrc);
      if (index !== -1) {
        currentImageIndex = index;
        lightboxImage.src = imageSrc;
        openLightbox();
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', showNextImage);
  lightboxPrev?.addEventListener('click', showPrevImage);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });

  // Candle Lighting
  const candle = document.getElementById('candle');
  let isLit = false;

  candle?.addEventListener('click', () => {
    isLit = !isLit;
    if (isLit) {
      candle.classList.add('lit');
    } else {
      candle.classList.remove('lit');
    }
  });

  // Share Functionality
  const shareButtons = document.querySelectorAll('.share-btn');
  const currentUrl = window.location.href;
  const shareText = 'In loving memory of Joshua Ngumo Kinyingi';

  shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;

      // Use native share dialog when available
      if (platform === 'native') {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            text: shareText,
            url: currentUrl
          }).catch(() => {
            // If user cancels or share fails, silently ignore
          });
        } else if (navigator.clipboard) {
          // Fallback: copy link so it can be pasted into any social app
          navigator.clipboard.writeText(currentUrl);
        }
        return;
      }

      if (platform === 'copy') {
        navigator.clipboard.writeText(currentUrl).then(() => {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          setTimeout(() => {
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          }, 2000);
        });
        return;
      }

      let shareUrl = '';
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });

  // Friends videos carousel controls
  const friendsRow = document.querySelector('.friends-video-row');
  const friendsCards = friendsRow ? friendsRow.querySelectorAll('.video-card') : [];
  const friendsPrev = document.querySelector('.friends-prev');
  const friendsNext = document.querySelector('.friends-next');
  let friendsIndex = 0;

  // Ensure first friends video is active (especially for mobile carousel)
  if (friendsCards && friendsCards.length) {
    friendsCards.forEach((card, index) => {
      if (index === 0) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  }

  function scrollToFriend(index) {
    if (!friendsRow || !friendsCards.length) return;
    const maxIndex = friendsCards.length - 1;
    friendsIndex = Math.max(0, Math.min(index, maxIndex));

    // Update active card (used for mobile view)
    friendsCards.forEach((card, idx) => {
      if (idx === friendsIndex) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });

    // On larger screens, smoothly scroll the selected card into view
    if (window.innerWidth > 768) {
      const targetCard = friendsCards[friendsIndex];
      if (targetCard && typeof targetCard.scrollIntoView === 'function') {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }

  friendsPrev?.addEventListener('click', () => {
    scrollToFriend(friendsIndex - 1);
  });

  friendsNext?.addEventListener('click', () => {
    scrollToFriend(friendsIndex + 1);
  });
});

