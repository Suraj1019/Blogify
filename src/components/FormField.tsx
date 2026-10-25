import { useField } from 'formik';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseProps = { name: string; label?: string; className?: string };
type InputProps = BaseProps & { as?: 'input' } & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseProps & { as: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** A Formik-bound input/textarea with label and inline validation message. */
export default function FormField(props: InputProps | TextareaProps) {
  const { name, label, className = '', as = 'input', ...rest } = props;
  const [field, meta] = useField(name);
  const showError = meta.touched && !!meta.error;
  const id = rest.id ?? name;
  const inputClass = `input ${showError ? 'input-error' : ''}`;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...field}
          id={id}
          className={`${inputClass} resize-y`}
          aria-invalid={showError}
        />
      ) : (
        <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...field} id={id} className={inputClass} aria-invalid={showError} />
      )}
      {showError && <p className="error-text">{meta.error}</p>}
    </div>
  );
}
