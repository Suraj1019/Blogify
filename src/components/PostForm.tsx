import { Form, Formik, type FormikHelpers, type FormikProps } from 'formik';
import type { ReactNode } from 'react';
import * as Yup from 'yup';
import { postFields } from '../utils/validation';
import FormField from './FormField';
import MediaUploader from './MediaUploader';

export interface PostFormValues {
  title: string;
  content: string;
  categories: string;
  tags: string;
  media: string[];
  publishDate?: string;
}

interface PostFormProps {
  initialValues: PostFormValues;
  /** Shows and requires the publish-date field (edit mode). */
  withPublishDate?: boolean;
  onSubmit: (values: PostFormValues, helpers: FormikHelpers<PostFormValues>) => void | Promise<void>;
  actions: (formik: FormikProps<PostFormValues>) => ReactNode;
}

/** Fields shared by the "Create" and "Edit" post pages. */
export default function PostForm({ initialValues, withPublishDate, onSubmit, actions }: PostFormProps) {
  const schema = Yup.object({
    ...postFields,
    ...(withPublishDate ? { publishDate: Yup.string().required('*Publish Date Required') } : {}),
  });

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit} enableReinitialize validateOnMount>
      {(formik) => (
        <Form className="flex flex-col gap-6" noValidate>
          <FormField name="title" label="Title" placeholder="Enter post title" />
          <FormField as="textarea" name="content" label="Content" rows={6} placeholder="Enter post content" />
          {withPublishDate && <FormField type="date" name="publishDate" label="Publish Date" />}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField name="categories" label="Category" placeholder="Enter categories (comma separated)" />
            <FormField name="tags" label="Tags" placeholder="Enter tags (comma separated)" />
          </div>
          <MediaUploader media={formik.values.media} onChange={(media) => formik.setFieldValue('media', media)} />
          {/* Full-width stacked buttons on phones, right-aligned row from sm up. */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">{actions(formik)}</div>
        </Form>
      )}
    </Formik>
  );
}
