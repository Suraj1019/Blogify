import placeholder from '../assets/placeholder.jpg';

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v', 'mkv', 'avi'];

/**
 * Media URLs are images unless they look like a video: a video extension, or a Cloudinary
 * `/video/upload/` path. Checking for videos (not images) keeps extensionless image URLs
 * such as Unsplash's `photo-123?w=800` from being rendered as a broken video player.
 */
export const isVideo = (url: string) => {
  const path = url.split('?')[0];
  const ext = path.split('/').pop()?.split('.').slice(1).pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.includes(ext) || path.includes('/video/upload/');
};

export const isImage = (url: string) => !isVideo(url);

/** First image in a post's media, or a placeholder when the post has none. */
export const thumbnail = (media: string[] = []) => media.find(isImage) ?? placeholder;
