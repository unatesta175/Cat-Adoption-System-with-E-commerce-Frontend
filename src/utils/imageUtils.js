/**
 * Get upload image URL (works in both dev and production)
 * @param {string} imageName - Image filename
 * @returns {string} Full image URL
 */
export const getUploadImageUrl = (imageName) => {
  // Return placeholder if no image name provided
  if (!imageName) {
    return 'https://via.placeholder.com/400x300/9b5de5/ffffff?text=No+Image';
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  // In production, if VITE_API_URL is not set, log a warning
  if (import.meta.env.PROD && !baseUrl) {
    console.warn('⚠️ VITE_API_URL is not set! Images may not load correctly.');
    console.warn('Set VITE_API_URL in Vercel environment variables to your Render backend URL');
  }
  
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  
  // Construct URL
  const imageUrl = `${cleanBaseUrl}/uploads/${imageName}`;
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('🖼️ Image URL:', imageUrl);
  }
  
  return imageUrl;
};

/**
 * Generate a random image URL based on an ID
 * Uses Picsum Photos (Lorem Picsum) for consistent random images
 * 
 * @param {string} id - The document ID (MongoDB _id)
 * @param {number} width - Image width (default: 400)
 * @param {number} height - Image height (default: 300)
 * @param {string} type - Type of image: 'cat' or 'product' (default: 'cat')
 * @returns {string} Image URL
 */
export const getImageUrl = (id, width = 400, height = 300, type = 'cat') => {
  if (!id) {
    // Fallback placeholder if no ID provided
    return `https://via.placeholder.com/${width}x${height}/9b5de5/ffffff?text=${type === 'cat' ? 'Cat' : 'Product'}`;
  }

  // Convert MongoDB ObjectId to a numeric seed for consistent images
  // Using a simple hash of the ID string
  const seed = id.toString().split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  // Use absolute value and modulo to get a positive seed number
  const imageSeed = Math.abs(seed) % 1000;

  // Picsum Photos with seed for consistent images
  // You can also use: https://picsum.photos/seed/{seed}/{width}/{height}
  return `https://picsum.photos/seed/${imageSeed}/${width}/${height}`;
};

/**
 * Generate a cat-specific image URL
 * Uses cat-related image services for better relevance
 */
export const getCatImageUrl = (catId, width = 400, height = 300) => {
  if (!catId) {
    return `https://via.placeholder.com/${width}x${height}/9b5de5/ffffff?text=Cat`;
  }

  // Alternative: Use a cat-specific image service
  // For now, using Picsum with seed, but you can switch to:
  // - https://api.thecatapi.com/v1/images/search (requires API key)
  // - https://cataas.com/cat?json=true (random cat images)
  
  const seed = catId.toString().split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const imageSeed = Math.abs(seed) % 1000;

  return `https://picsum.photos/seed/${imageSeed}/${width}/${height}`;
};

/**
 * Generate a product-specific image URL
 */
export const getProductImageUrl = (productId, width = 400, height = 300) => {
  if (!productId) {
    return `https://via.placeholder.com/${width}x${height}/9b5de5/ffffff?text=Product`;
  }

  const seed = productId.toString().split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const imageSeed = Math.abs(seed) % 1000;

  return `https://picsum.photos/seed/${imageSeed}/${width}/${height}`;
};






