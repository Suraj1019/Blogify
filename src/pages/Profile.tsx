import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deletePost, getPostsByUser } from '../api/posts';
import Badges from '../components/Badges';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { EditIcon, TrashIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import { firstName, formatDate, getErrorMessage, titleCase } from '../utils/format';
import { thumbnail } from '../utils/media';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setPosts(await getPostsByUser(user.userId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deletePost(deleteId);
      toast.success('Post deleted.');
      setDeleteId(null);
      await fetchPosts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const onLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div>
      <div className="card mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="section-title">Logged in as:</h2>
          <p className="break-anywhere text-gray-600">
            {titleCase(firstName(user?.name))} ({user?.email})
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 [&>*]:flex-1 sm:[&>*]:flex-none">
          <Link to="/analytics" className="btn-accent">
            Analytics
          </Link>
          <Link to="/notifications" className="btn-accent">
            Notifications
          </Link>
          <button type="button" className="btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <section>
        <h2 className="section-title mb-6">My Posts</h2>
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article
              key={post._id}
              className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg md:flex-row"
            >
              <Link to={`/post/${post._id}`} className="md:w-1/3 md:shrink-0">
                <img src={thumbnail(post.media)} alt={post.title} className="h-48 w-full object-cover md:h-60" />
              </Link>
              <Link to={`/post/${post._id}`} className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-6 md:p-8">
                <span className="mb-4 text-sm text-gray-500">
                  {titleCase(post.authorName)}
                  {post.publishDate && ` • ${formatDate(post.publishDate)}`}
                </span>
                <h3 className="break-anywhere mb-4 text-xl font-semibold text-gray-900 sm:text-2xl md:pr-28">{post.title}</h3>
                <p className="break-anywhere mb-6 text-gray-600">
                  {post.content.slice(0, 155)}
                  {post.content.length > 155 && '...'} <span className="text-indigo-600">read more</span>
                </p>
                <Badges items={post.tags} />
              </Link>
              {/* Sits over the image on phones, so give it a backdrop to stay legible. */}
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-sm md:bg-transparent md:p-0 md:shadow-none">
                {post.draft && <span className="badge-tag mr-1">Drafted</span>}
                <Link to={`/edit/${post._id}`} className="icon-btn text-blue-600" aria-label="Edit post">
                  <EditIcon className="h-5 w-5" />
                </Link>
                <button type="button" className="icon-btn text-red-600" aria-label="Delete post" onClick={() => setDeleteId(post._id)}>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </article>
          ))}
          {!loading && posts.length === 0 && <EmptyState>No blogs found</EmptyState>}
        </div>
      </section>

      <ConfirmDialog
        open={!!deleteId}
        message="Are you sure you want to delete this post?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
      <Loader show={loading || deleting} />
    </div>
  );
}
