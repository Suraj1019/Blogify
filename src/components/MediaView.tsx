import { isImage } from '../utils/media';

/** Renders a post media URL as an image or a video player. */
export default function MediaView({ src, className = '', alt = 'Post media' }: { src: string; className?: string; alt?: string }) {
  return isImage(src) ? (
    <img src={src} alt={alt} className={`object-cover ${className}`} />
  ) : (
    <video controls src={src} className={`object-cover ${className}`} />
  );
}
