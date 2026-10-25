export interface User {
  userId: string;
  name: string;
  email: string;
  token: string;
}

export interface Reply {
  message: string;
  replyDate: string;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Comment {
  commentId: string;
  userId?: string;
  userName: string;
  message: string;
  commentDate: string;
  status: CommentStatus;
  replies?: Reply[];
}

/** A pending comment as returned by the notifications endpoint. */
export interface PendingComment extends Comment {
  postId: string;
  postTitle: string;
  /** The API has been seen to return this misspelled field. */
  commenDate?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  media: string[];
  authorName: string;
  authorId: string;
  publishDate?: string;
  draft?: boolean;
  views?: number;
  visitors?: string[];
  comments?: Comment[];
}

/** A post being composed, before it has been saved. */
export type DraftPost = Pick<Post, 'title' | 'content' | 'categories' | 'tags' | 'media'>;
