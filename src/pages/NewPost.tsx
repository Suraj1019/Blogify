import { useNavigate } from 'react-router-dom';
import PostForm, { type PostFormValues } from '../components/PostForm';
import { useDraftPost } from '../context/DraftPostContext';
import { splitList } from '../utils/format';

export default function NewPost() {
  const { draft, setDraft } = useDraftPost();
  const navigate = useNavigate();

  // Coming back from the preview page restores what was typed.
  const initialValues: PostFormValues = {
    title: draft?.title ?? '',
    content: draft?.content ?? '',
    categories: draft?.categories.join(', ') ?? '',
    tags: draft?.tags.join(', ') ?? '',
    media: draft?.media ?? [],
  };

  const onSubmit = (values: PostFormValues) => {
    setDraft({
      title: values.title.trim(),
      content: values.content.trim(),
      categories: splitList(values.categories),
      tags: splitList(values.tags),
      media: values.media,
    });
    navigate('/previewpost');
  };

  return (
    <div className="card">
      <h1 className="page-title">Create New Blog Post</h1>
      <PostForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        actions={({ isValid }) => (
          <button type="submit" className="btn-primary" disabled={!isValid}>
            Preview Post
          </button>
        )}
      />
    </div>
  );
}
