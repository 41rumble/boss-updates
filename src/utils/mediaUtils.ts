/**
 * Utility functions for handling media links (videos and images)
 */

/**
 * Checks if a URL is a YouTube video link
 * @param url The URL to check
 * @returns boolean indicating if the URL is a YouTube video
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

/**
 * Extracts the YouTube video ID from a YouTube URL
 * @param url The YouTube URL
 * @returns The video ID or null if not found
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  // Handle youtube.com format
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

/**
 * Checks if a URL is a Vimeo video link
 * @param url The URL to check
 * @returns boolean indicating if the URL is a Vimeo video
 */
export const isVimeoUrl = (url: string): boolean => {
  if (!url) return false;
  
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
  return vimeoRegex.test(url);
};

/**
 * Extracts the Vimeo video ID from a Vimeo URL
 * @param url The Vimeo URL
 * @returns The video ID or null if not found
 */
export const extractVimeoVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  return match ? match[1] : null;
};

/**
 * Determines if a URL is a video link (YouTube or Vimeo)
 * @param url The URL to check
 * @returns boolean indicating if the URL is a video
 */
export const isVideoUrl = (url: string): boolean => {
  return isYouTubeUrl(url) || isVimeoUrl(url);
};

/**
 * Checks if a URL is an image link
 * @param url The URL to check
 * @returns boolean indicating if the URL is an image
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if URL ends with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const lowerCaseUrl = url.toLowerCase();
  
  // Check for direct image URLs
  if (imageExtensions.some(ext => lowerCaseUrl.endsWith(ext))) {
    return true;
  }
  
  // Check for image hosting services
  const imageHostingPatterns = [
    /imgur\.com\/[a-zA-Z0-9]{5,8}$/i,
    /\.(flickr|unsplash|pexels|pixabay)\.com/i,
    /cloudinary\.com.*\/image\/upload/i
  ];
  
  return imageHostingPatterns.some(pattern => pattern.test(url));
};

/**
 * Determines if a URL is a media link (video or image)
 * @param url The URL to check
 * @returns boolean indicating if the URL is a media link
 */
export const isMediaUrl = (url: string): boolean => {
  return isVideoUrl(url) || isImageUrl(url);
};

/**
 * Gets the thumbnail URL for a video
 * @param url The video URL
 * @returns The thumbnail URL or null if not a supported video
 */
export const getVideoThumbnailUrl = (url: string): string | null => {
  if (isYouTubeUrl(url)) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      // Use the high-quality thumbnail
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  } else if (isVimeoUrl(url)) {
    // For Vimeo, we would need to use their API to get the thumbnail
    // This is a simplified version that doesn't actually work
    // In a real app, you would make an API call to Vimeo
    const videoId = extractVimeoVideoId(url);
    if (videoId) {
      return `https://vumbnail.com/${videoId}.jpg`;
    }
  }
  
  return null;
};

/**
 * Gets the embed URL for a video
 * @param url The video URL
 * @returns The embed URL or null if not a supported video
 */
export const getVideoEmbedUrl = (url: string): string | null => {
  if (isYouTubeUrl(url)) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (isVimeoUrl(url)) {
    const videoId = extractVimeoVideoId(url);
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }
  
  return null;
};