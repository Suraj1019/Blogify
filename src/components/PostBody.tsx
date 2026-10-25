import type { DraftPost } from '../types';
import Badges from './Badges';
import MediaView from './MediaView';

/** Title, badges, media and content of a post. Shared by the post and preview pages. */
export default function PostBody({ post }: { post: DraftPost }) {
  return (
    <article className="flex flex-col items-center text-center">
      <h1 className="break-anywhere mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">{post.title}</h1>
      <div className="mb-8 flex flex-col items-center gap-3 [&>div]:justify-center">
        <Badges label="Categories:" items={post.categories} variant="category" />
        <Badges label="Tags:" items={post.tags} hash />
      </div>
      {post.media.length > 0 && (
        <div className="mb-6 flex flex-col items-center gap-6">
          {post.media.map((file) => (
            <MediaView key={file} src={file} className="max-h-[400px] max-w-full rounded-xl" />
          ))}
        </div>
      )}
      <p className="break-anywhere w-full whitespace-pre-line text-base leading-relaxed sm:text-lg text-gray-600 md:w-4/5">{post.content}</p>
    </article>
  );
}
