import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPosts } from '../api/posts';
import Badges from '../components/Badges';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { PlusIcon, SearchIcon } from '../components/icons';
import type { Post } from '../types';
import { formatDate, getErrorMessage, titleCase } from '../utils/format';
import { thumbnail } from '../utils/media';
import { useDebouncedValue } from '../utils/useDebouncedValue';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getPosts(debouncedSearch.trim())
      .then((data) => !ignore && setPosts(data))
      .catch((err) => !ignore && toast.error(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [debouncedSearch]);

  return (
    // Bottom padding keeps the floating "New Post" button from covering the last row.
    <div className="pb-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="section-title">All blog posts</h2>
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search by tag or category"
            aria-label="Search posts"
          />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-6 sm:gap-8">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          >
            <img src={thumbnail(post.media)} alt={post.title} className="h-48 w-full object-cover" />
            <div className="flex flex-1 flex-col p-4">
              <span className="mb-3 text-sm text-gray-600">
                {titleCase(post.authorName)} • {formatDate(post.publishDate)}
              </span>
              <h3 className="break-anywhere mb-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-700">{post.title}</h3>
              <p className="break-anywhere mb-4 flex-1 text-gray-600">
                {post.content.slice(0, 100)}
                {post.content.length > 100 && '...'} <span className="text-indigo-600">read more</span>
              </p>
              <Badges label="Tags:" items={post.tags} />
            </div>
          </Link>
        ))}
        {!loading && posts.length === 0 && <EmptyState>No blogs found</EmptyState>}
      </div>

      <Link
        to="/newpost"
        className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full border border-gray-400 bg-blue-100 px-4 py-3 font-medium sm:bottom-8 sm:right-8 sm:px-5 text-gray-900 shadow-md transition hover:bg-blue-200 hover:shadow-lg"
      >
        <PlusIcon className="h-5 w-5" />
        New Post
      </Link>
      <Loader show={loading} />
    </div>
  );
}
