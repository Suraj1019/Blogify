import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { signup } from "../api/auth";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { getErrorMessage } from "../utils/format";
import { email } from "../utils/validation";

const schema = Yup.object({
  name: Yup.string()
    .trim()
    .required("*Name Required")
    .min(3, "*Name should be min 3 characters long!"),
  email,
  password: Yup.string().min(6).required("*Password Required"),
  confirmPassword: Yup.string()
    .min(6)
    .required("*Password Required")
    .oneOf([Yup.ref("password")], "*Passwords do not match"),
});

type SignupValues = Yup.InferType<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();

  const onSubmit = async ({ name, email, password }: SignupValues) => {
    try {
      await signup({ name: name.trim(), email, password });
      toast.success("Registered! Log in now.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthCard
      title="Sign Up"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log in
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-6" noValidate>
            <FormField
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
            />
            <FormField
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              autoComplete="email"
            />
            <FormField
              type="password"
              name="password"
              label="Password"
              placeholder="Create a password"
              autoComplete="new-password"
            />
            <FormField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="submit"
              className="btn-primary py-2.5 text-base"
              disabled={isSubmitting}
            >
              Sign Up
            </button>
            <Loader show={isSubmitting} />
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
