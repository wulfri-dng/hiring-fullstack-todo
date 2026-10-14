# Client

React + Vite frontend for the TODO app, written in TypeScript and styled with Tailwind CSS and shadcn/ui.

## Setup

Make sure the server is running first (see `../server/README.md`).

```bash
# from the repo root
npm install
npm run dev:client
```

Open `http://localhost:5173`.

In development, Vite proxies `/api` requests to `http://localhost:4000`. Set `API_PROXY_TARGET` to proxy somewhere else. For a production build that talks to a separate API, set `VITE_API_URL`:

```bash
VITE_API_URL=https://my-api.example.com npm run build -w client
```

## Features

- List all todos, newest first, with All / Active / Done filter tabs and counts
- Add a todo with a title and optional description
- Edit a todo inline (Enter to save, Esc to cancel)
- Mark as done/undone with a checkbox (done items are faded and struck through)
- Delete a todo
- **Optimistic updates** for edit, toggle and delete: the change shows up instantly and is rolled back with an error toast if the server request fails
- Form validation with per-field messages and a character counter, using the same rules as the server (`@todo/shared`)
- Loading skeletons, empty states, and an error state with a retry button
- Enter/exit and reorder animations (Motion), light/dark theme toggle

## How it's organised

```
src/
├── api/todos.ts          typed fetch wrapper, turns failures into readable messages
├── hooks/useTodos.ts     list state + optimistic update/toggle/delete
├── components/
│   ├── TodoForm.tsx      add form
│   ├── TodoItem.tsx      single todo, view + inline edit modes
│   ├── TodoFields.tsx    title/description inputs shared by add and edit
│   ├── ThemeToggle.tsx
│   └── ui/               shadcn/ui components (generated)
└── App.tsx               layout, filters, loading/error/empty states
```

### Optimistic updates

`useTodos` has one small `optimistic()` helper used by edit, toggle and delete. It saves the current list, applies the change locally, then calls the API. If the request fails it puts the saved list back and shows an error toast.

Creating a todo is not optimistic: it waits for the server so the new todo has its real id. The form keeps what you typed if saving fails.

## Assumptions and limitations

- No routing or global state library, a single custom hook is enough for one list.
- A rollback restores the whole list as it was before that change, so if two requests fail at the same moment the later rollback wins. Fine for a single user list.
- No offline support or retry queue: failed changes are rolled back and the user can try again.
- No real-time sync, changes from other tabs show up after a reload.
