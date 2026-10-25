import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPostById, updatePost } from '../api/posts';
import Loader from '../components/Loader';
import PostForm, { type PostFormValues } from '../components/PostForm';
import type { Post } from '../types';
import { getErrorMessage, splitList } from '../utils/format';

export default function EditPost() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  // Which button submitted the form; Formik's onSubmit has no access to it.
  const mode = useRef<'draft' | 'publish'>('publish');

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then(setPost)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (values: PostFormValues) => {
    if (!post) return;
    try {
      await updatePost({
        _id: post._id,
        title: values.title.trim(),
        content: values.content.trim(),
        categories: splitList(values.categories),
        tags: splitList(values.tags),
        media: values.media,
        publishDate: values.publishDate ?? '',
        draft: mode.current === 'draft',
      });
      toast.success(mode.current === 'draft' ? 'Saved as draft.' : 'Post published!');
      navigate('/profile');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">Edit Blog</h1>
      {post && (
        <PostForm
          withPublishDate
          initialValues={{
            title: post.title,
            content: post.content,
            categories: post.categories.join(', '),
            tags: post.tags.join(', '),
            media: post.media ?? [],
            publishDate: post.publishDate ? new Date(post.publishDate).toISOString().split('T')[0] : '',
          }}
          onSubmit={onSubmit}
          actions={({ isValid, isSubmitting }) => (
            <>
              <button type="submit" className="btn-secondary" disabled={!isValid || isSubmitting} onClick={() => (mode.current = 'draft')}>
                Save as draft
              </button>
              <button type="submit" className="btn-primary" disabled={!isValid || isSubmitting} onClick={() => (mode.current = 'publish')}>
                Publish Post
              </button>
              <Loader show={isSubmitting} />
            </>
          )}
        />
      )}
      <Loader show={loading} />
    </div>
  );
}
