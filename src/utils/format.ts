import { AxiosError } from 'axios';

/** Equivalent of Angular's `titlecase` pipe. */
export const titleCase = (value?: string | null) =>
  (value ?? '').toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export const firstName = (name?: string | null) => (name ?? '').trim().split(' ')[0];

export const initial = (name?: string | null) => (name ?? '').trim().charAt(0).toUpperCase();

/** Equivalent of Angular's default `date` pipe, e.g. "Jan 5, 2025". */
export const formatDate = (value?: string | Date | null) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

/** e.g. "1/5/25, 3:04 PM" */
export const formatDateTime = (value?: string | Date | null) =>
  value
    ? new Date(value).toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

/** "a, b ,, c" -> ["a", "b", "c"] */
export const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const getErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    return (err.response?.data as { message?: string } | undefined)?.message || 'An error occurred.';
  }
  return 'An error occurred.';
};
