import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
import styles from './App.module.css';

// to handle the response body of the server data sent
interface Todo {
  id: string; // Assuming the ID is a string, adjust it based on your MongoDB configuration
  text: string;
  completed: boolean;
  timestamp: string;
  delete: boolean;
}


function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  // Function to fetch todos from the server
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/fetch-todos');
      const todos: Todo[] = response.data;
      setTodoList(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Use useEffect to fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const addTodo = async () => {
    console.log('adding a todo...');
    try {

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString(); // Convert to ISO string format
      // Send a POST request to the server to create a new todo
      const response = await axios.post('http://localhost:3000/create-todo', {
        text: '',
        completed: false,
        timestamp: formattedDate,
      });
      const newTodo: Todo = response.data;

      // Update the state with the new todo
      setTodoList([...todoList, newTodo]);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleTextChange = async (id: string, newText: string) => {
    try {
      // Send a POST request to update the text
      await axios.post('http://localhost:3000/update-todo-text', {
        id: id,
        text: newText,
      });
  
      // Assuming you have a function to fetch updated todos, call it here
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo text:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      // Send a POST request to delete the todo
      await axios.post('http://localhost:3000/delete-todo', {
        id: id,
      });
  
      // Assuming you have a function to fetch updated todos, call it here
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  

  return (
    <div className={styles.App}>
      <Navigation Create='Create' onClick={addTodo} />

      <div className={styles.todolists}>
        {/* Render the ToDo list */}
        {todoList.map((todo) => (
          <div key={todo.id} className={styles.todo}>
            <input type="checkbox" className={styles.todocheckup} />
            <textarea defaultValue={todo.text}
            placeholder='Type todo...'
            // change the text of the todo in the database
            onChange={(e) => handleTextChange(todo.id, e.target.value)}
            className={styles.todotextarea} />
            <div>
            <p>{todo.timestamp}</p>
            </div>
            {/* here we would pass that id to delete up the todo list item */}
            <button className={styles.deleteButton}
            // delete the id based todo
            onClick={() => handleDelete(todo.id)}
            >Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;