import { api } from './client';
import type { DraftPost, Post } from '../types';

export const getPosts = (search = '') =>
  api.get<Post[]>('/posts', { params: { search } }).then((r) => r.data);

export const getPostById = (id: string) => api.get<Post>(`/posts/${id}`).then((r) => r.data);

export const getPostsByUser = (userId: string) =>
  api.get<Post[]>(`/posts/userId/${userId}`).then((r) => r.data);

/** Uploads one file and returns its public URL. */
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<{ url?: string; file?: string }>('/upload', formData);
  // The Angular app read `url` in one place and `file` in another; accept either.
  const url = data.url ?? data.file;
  if (!url) throw new Error('Upload response did not include a file URL.');
  return url;
};

export type NewPost = DraftPost & {
  authorName: string;
  authorId: string;
  draft: boolean;
  publishDate?: string;
};

export const createPost = (post: NewPost) => api.post<Post>('/posts', post).then((r) => r.data);

export type EditedPost = DraftPost & { _id: string; draft: boolean; publishDate: string };

export const updatePost = (post: EditedPost) => api.put<Post>('/posts', post).then((r) => r.data);

export const deletePost = (postId: string) => api.delete(`/posts/${postId}`).then((r) => r.data);

export const updateViews = (postId: string, visitor?: string) =>
  api.put('/posts/updateviews', { postId, visitor }).then((r) => r.data);

export const addComment = (body: { message: string; postId: string; userId: string; userName: string }) =>
  api.put('/posts/comment', body).then((r) => r.data);

export const deleteComment = (body: { postId: string; commentId: string }) =>
  api.put('/posts/delete/comment', body).then((r) => r.data);

export const replyToComment = (body: { message: string; postId: string; commentId: string }) =>
  api.put('/posts/reply', body).then((r) => r.data);
