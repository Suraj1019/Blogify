import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPost } from '../api/posts';
import Loader from '../components/Loader';
import PostBody from '../components/PostBody';
import { useAuth } from '../context/AuthContext';
import { useDraftPost } from '../context/DraftPostContext';
import { getErrorMessage } from '../utils/format';

export default function PreviewPost() {
  const { draft, clearDraft } = useDraftPost();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  if (!draft) return <Navigate to="/newpost" replace />;

  const publish = async (asDraft: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      await createPost({
        ...draft,
        authorName: user.name,
        authorId: user.userId,
        draft: asDraft,
        ...(asDraft ? {} : { publishDate: new Date().toISOString() }),
      });
      toast.success(asDraft ? 'Saved as draft.' : 'Post published!');
      navigate(asDraft ? '/profile' : '/home');
      clearDraft();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="card">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-gray-400">Preview</p>
        <PostBody post={draft} />
        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="btn-secondary" onClick={() => navigate('/newpost')} disabled={saving}>
            &larr; Back
          </button>
          <div className="flex gap-4">
            <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={() => publish(true)} disabled={saving}>
              Save as Draft
            </button>
            <button type="button" className="btn-accent flex-1 sm:flex-none" onClick={() => publish(false)} disabled={saving}>
              Publish
            </button>
          </div>
        </div>
      </div>
      <Loader show={saving} />
    </div>
  );
}
