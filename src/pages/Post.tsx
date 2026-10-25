import { Form, Formik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { addComment, deleteComment, getPostById, replyToComment, updateViews } from '../api/posts';
import Avatar from '../components/Avatar';
import FormField from '../components/FormField';
import Loader from '../components/Loader';
import PostBody from '../components/PostBody';
import { useAuth } from '../context/AuthContext';
import type { Comment, Post as PostType } from '../types';
import { formatDateTime, getErrorMessage, titleCase } from '../utils/format';

const commentSchema = Yup.object({ comment: Yup.string().trim().required('*Comment Required') });
const replySchema = Yup.object({ reply: Yup.string().trim().required('*Reply Required') });

export default function Post() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const viewedId = useRef<string | null>(null);

  const loadPost = useCallback(async () => {
    try {
      setPost(await getPostById(id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    void loadPost();
    // Count each visit once (StrictMode runs effects twice in development).
    if (viewedId.current !== id) {
      viewedId.current = id;
      updateViews(id, user?.userId).catch((err) => toast.error(getErrorMessage(err)));
    }
  }, [id, loadPost, user?.userId]);

  const isAuthor = !!user && post?.authorId === user.userId;
  const comments = post?.comments?.filter((c) => c.status === 'approved') ?? [];

  const onDeleteComment = async (commentId: string) => {
    if (!post) return;
    setLoading(true);
    try {
      await deleteComment({ postId: post._id, commentId });
      toast.success('Comment deleted successfully!');
      await loadPost();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {post && (
        <div className="card">
          <PostBody post={post} />

          <section className="mt-10 border-t border-gray-200 pt-8 sm:mt-12 sm:pt-10">
            <h2 className="section-title mb-6">Comments</h2>

            {comments.length === 0 && <p className="mb-8 text-gray-500">No comments yet. Be the first to comment!</p>}
            <ul className="mb-10 flex flex-col gap-6">
              {comments.map((comment) => (
                <li key={comment.commentId}>
                  <CommentItem name={comment.userName} date={comment.commentDate} message={comment.message} />
                  {isAuthor && (
                    <div className="mt-2 flex flex-col gap-2 sm:ml-11 sm:flex-row sm:flex-wrap sm:items-start">
                      <ReplyForm postId={post._id} commentId={comment.commentId} onReplied={loadPost} />
                      <button type="button" className="btn-ghost self-start sm:mt-1" onClick={() => onDeleteComment(comment.commentId)}>
                        Delete Comment
                      </button>
                    </div>
                  )}
                  <Replies comment={comment} authorName={post.authorName} />
                </li>
              ))}
            </ul>

            <h3 className="mb-4 text-lg font-semibold text-gray-900">Add a Comment</h3>
            {user ? (
              <Formik
                initialValues={{ comment: '' }}
                validationSchema={commentSchema}
                validateOnMount
                onSubmit={async (values, { resetForm }) => {
                  try {
                    await addComment({ message: values.comment.trim(), postId: post._id, userId: user.userId, userName: user.name });
                    resetForm();
                    toast.success('Comment will approve soon!');
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
              >
                {({ isValid, isSubmitting }) => (
                  <Form className="flex flex-col items-start gap-4" noValidate>
                    <FormField as="textarea" name="comment" rows={4} placeholder="Write your comment here..." className="w-full" aria-label="Comment" />
                    <button type="submit" className="btn-accent" disabled={!isValid || isSubmitting}>
                      {isSubmitting ? 'Posting…' : 'Post Comment'}
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <p className="text-gray-600">
                <Link to="/login" state={{ from: location.pathname }} className="link">
                  Log in
                </Link>{' '}
                to join the discussion.
              </p>
            )}
          </section>
        </div>
      )}
      <Loader show={loading} />
    </div>
  );
}

function CommentItem({ name, date, message, isAuthor }: { name: string; date: string; message: string; isAuthor?: boolean }) {
  return (
    <div className="flex gap-3">
      <Avatar name={name} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-x-2">
          <span className="font-medium text-gray-900">
            {titleCase(name)}
            {isAuthor && <span className="ml-1 text-xs font-normal text-indigo-600">(Author)</span>}
          </span>
          <span className="text-sm text-gray-500">{formatDateTime(date)}</span>
        </div>
        <p className="break-anywhere text-gray-600">{message}</p>
      </div>
    </div>
  );
}

function Replies({ comment, authorName }: { comment: Comment; authorName: string }) {
  if (!comment.replies?.length) return null;
  return (
    <ul className="ml-4 mt-4 flex flex-col gap-4 border-l-2 border-gray-100 pl-3 sm:ml-11 sm:pl-4">
      {comment.replies.map((reply, i) => (
        <li key={`${reply.replyDate}-${i}`}>
          <CommentItem name={authorName} date={reply.replyDate} message={reply.message} isAuthor />
        </li>
      ))}
    </ul>
  );
}

function ReplyForm({ postId, commentId, onReplied }: { postId: string; commentId: string; onReplied: () => Promise<void> }) {
  return (
    <Formik
      initialValues={{ reply: '' }}
      validationSchema={replySchema}
      validateOnMount
      onSubmit={async (values, { resetForm }) => {
        try {
          await replyToComment({ message: values.reply.trim(), postId, commentId });
          resetForm();
          toast.success('Reply added!');
          await onReplied();
        } catch (err) {
          toast.error(getErrorMessage(err));
        }
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="flex w-full items-start gap-2 sm:w-auto" noValidate>
          <FormField name="reply" id={`reply-${commentId}`} placeholder="Reply" aria-label="Reply" className="min-w-0 flex-1 sm:w-56 sm:flex-none" />
          <button type="submit" className="btn-ghost mt-1" disabled={!isValid || isSubmitting}>
            Reply
          </button>
        </Form>
      )}
    </Formik>
  );
}
