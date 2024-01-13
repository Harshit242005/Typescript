import React, { useState } from 'react';
import Navigation from './Navigation';
import styles from './App.module.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  timestamp: string;
}

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const addTodo = () => {
    // Create a new ToDo item with a unique ID, text, completion status, and timestamp
    const newTodo: Todo = {
      id: new Date().getTime(),
      text: "Your ToDo Text",
      completed: false,
      timestamp: new Date().toLocaleString(),
    };

    // Update the state with the new ToDo item
    setTodoList([...todoList, newTodo]);
  };

  return (
    <div className={styles.App}>
      <Navigation Create='Create' onClick={addTodo} />

      <div className={styles.todolists}>
        {/* Render the ToDo list */}
        {todoList.map((todo) => (
          <div key={todo.id} className={styles.todo}>
            <input type="checkbox" checked={todo.completed} className={styles.todocheckup} />
            <textarea value={todo.text} className={styles.todotextarea} />
            <p>{todo.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
