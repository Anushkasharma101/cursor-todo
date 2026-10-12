# Still — To-do list

A small, calm browser to-do app built with plain HTML, CSS, and JavaScript. Add tasks, mark them complete, delete them, and keep everything in `localStorage` across refreshes.

## Stack

- `index.html`, `style.css`, and `script.js` at the repo root
- [Vite](https://vite.dev/) as a minimal static/dev server

## Run locally

```bash
npm install
npm run dev
```

The app serves at [http://127.0.0.1:4632](http://127.0.0.1:4632).

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the Vite dev server  |
| `npm run build` | Production build to `dist` |
| `npm run preview` | Preview the production build |

## Features

- Add tasks from the composer
- Toggle complete / incomplete
- Delete with a short leave animation
- Persist tasks in `localStorage` (`still-todos-v1`)
- Empty state when the list is clear
- Responsive layout for desktop and mobile
