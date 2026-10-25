import { Form, Formik } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { login, type LoginPayload } from '../api/auth';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';
import { email } from '../utils/validation';

const schema = Yup.object({
  email,
  password: Yup.string().required('*Password Required'),
});

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/home';

  const onSubmit = async (values: LoginPayload) => {
    try {
      setUser(await login(values));
      toast.success('Log in success.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthCard
      title="Login"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="link">
            Sign up
          </Link>
        </>
      }
    >
      <Formik initialValues={{ email: '', password: '' }} validationSchema={schema} onSubmit={onSubmit} validateOnMount>
        {({ isValid, isSubmitting }) => (
          <Form className="flex flex-col gap-6" noValidate>
            <FormField type="email" name="email" label="Email" placeholder="Enter your email" autoComplete="email" />
            <FormField type="password" name="password" label="Password" placeholder="Enter your password" autoComplete="current-password" />
            <button type="submit" className="btn-primary py-2.5 text-base" disabled={!isValid || isSubmitting}>
              Login
            </button>
            <Loader show={isSubmitting} />
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
