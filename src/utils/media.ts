import placeholder from '../assets/placeholder.jpg';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

export const isImage = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTENSIONS.includes(ext);
};

/** First image in a post's media, or a placeholder when the post has none. */
export const thumbnail = (media: string[] = []) => media.find(isImage) ?? placeholder;
