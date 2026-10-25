import * as Yup from 'yup';
import { splitList } from './format';

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}/;

export const email = Yup.string().required('*Email Required').matches(EMAIL_PATTERN, 'Invalid email format');

const commaList = (label: string, max: number) =>
  Yup.string()
    .required(`*${label} Required`)
    .test('max-items', `*${label} should be less than or equal to ${max}.`, (value) => splitList(value ?? '').length <= max);

/** Shared by the new-post and edit-post forms. */
export const postFields = {
  title: Yup.string().trim().required('*Title Required'),
  content: Yup.string().trim().required('*Content Required'),
  categories: commaList('Categories', 5),
  tags: commaList('Tags', 10),
};
