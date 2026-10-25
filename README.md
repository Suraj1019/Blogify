# Blogify (React)

React port of the Angular app in `../Client`.

| Concern     | Angular                    | React                            |
| ----------- | -------------------------- | -------------------------------- |
| Build       | Angular CLI                | Vite                             |
| Routing     | `@angular/router` + guard  | `react-router-dom` + `ProtectedRoute` |
| Forms       | Reactive forms             | Formik + Yup                     |
| Charts      | Chart.js                   | Recharts                         |
| Toasts      | ngx-toastr                 | react-toastify                   |
| HTTP        | `HttpClient`               | axios (token added by interceptor) |
| Styling     | per-component CSS          | Tailwind (shared primitives in `src/index.css`) |

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
  api/          axios client + auth/posts endpoints (replaces Angular services)
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
