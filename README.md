# Blogify (React)

## Tech stack

| Concern     | Library                          |
| ----------- | -------------------------------- |
| Build       | Vite                             |
| Routing     | `react-router-dom` + `ProtectedRoute` |
| Forms       | Formik + Yup                     |
| Charts      | Recharts                         |
| Toasts      | react-toastify                   |
| HTTP        | axios (token added by interceptor) |
| Styling     | Tailwind (shared primitives in `src/index.css`) |

## Scripts

```bash
npm install
npm run dev      # http://localhost:4200
npm run build
```

The API URL defaults to `https://blogify-server-nine.vercel.app`; override it with `VITE_API_URL` in a `.env` file (see `.env.example`).

## Structure

```
src/
  api/          axios client + auth/posts endpoints
  context/      AuthContext (user), DraftPostContext (new post -> preview)
  components/   Layout, Header, Footer, Loader, ConfirmDialog, FormField,
                PostForm, PostBody, MediaUploader, Badges, ...
  pages/        one file per route
  utils/        formatting, media helpers, Yup schemas
```

## Styling conventions

Use the classes in `src/index.css` instead of ad-hoc utilities for recurring UI:
`card`, `page-title`, `section-title`, `btn-primary | btn-accent | btn-secondary | btn-danger | btn-success | btn-ghost`,
`input`, `form-label`, `error-text`, `badge-tag`, `badge-category`, `link`.
Page width and padding come from `Layout` (`container-page`), so pages shouldn't add their own outer padding.
