import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPendingComments, moderateComment } from '../api/posts';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import type { PendingComment } from '../types';
import { formatDateTime, getErrorMessage, titleCase } from '../utils/format';

export default function Notifications() {
  const { user } = useAuth();
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setComments(await getPendingComments(user.userId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (comment: PendingComment, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await moderateComment({ postId: comment.postId, commentId: comment.commentId, status });
      toast.success(status === 'approved' ? 'Comment approved.' : 'Comment rejected.');
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">Notifications</h1>
      <ul className="divide-y divide-gray-200">
        {comments.map((comment) => (
          <li key={comment.commentId} className="flex flex-col gap-4 py-6 first:pt-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <Avatar name={comment.userName} size="md" />
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-x-2">
                  <span className="font-medium text-gray-900">{titleCase(comment.userName)}</span>
                  <span className="text-sm text-gray-500">{formatDateTime(comment.commentDate ?? comment.commenDate)}</span>
                </div>
                <p className="text-gray-600">
                  Left a comment on <span className="text-indigo-600">{titleCase(comment.postTitle)}</span>
                </p>
                <p className="break-anywhere mt-2 text-gray-600">{comment.message}</p>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
              <button type="button" className="btn-success" onClick={() => act(comment, 'approved')}>
                Approve
              </button>
              <button type="button" className="btn-danger" onClick={() => act(comment, 'rejected')}>
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && comments.length === 0 && <EmptyState>No notifications found</EmptyState>}
      <Loader show={loading} />
    </div>
  );
}
