# My To-Do List

A simple to-do list app I built with vanilla JavaScript. No frameworks or libraries, just plain HTML, CSS, and JS. Tasks are saved in the browser using localStorage so they stick around after a refresh.

## Features

- Add, edit, delete, and mark tasks as complete (full CRUD)
- Filter tasks by All, Active, or Completed
- Tasks persist in localStorage
- Uses event delegation for the task list (one listener instead of many)
- Edit tasks in a modal popup
- Keyboard shortcuts (Enter to save, Esc to close)

## How to run

Just open `index.html` in any browser. No build step needed.

If you want to run it with a local server:

```
python -m http.server 8000
```

Then go to http://localhost:8000

## Project structure

```
todo-app/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How it works

The app keeps a `todos` array in memory and writes it to localStorage whenever it changes. Every time the state changes it re-renders the list.

I used event delegation on the task list, so there's one click listener that figures out which button was clicked using `data-action` attributes. This is more efficient than attaching a listener to every button and it also works for new tasks added later.

## Stuff I might add later

- Due dates
- Drag to reorder
- Multiple lists
