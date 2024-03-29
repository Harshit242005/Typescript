const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const MongoClinetString = "mongodb+srv://agreharshit610:i4ZnXRbFARI4kaSl@taskhandler.u5cgjfw.mongodb.net/";


app.post('/create-todo', async (req, res) => {
  try {

    // Connect to the MongoDB database
    const client = await MongoClient.connect(MongoClinetString);
    const db = client.db('TODOS');
    const todoCollection = db.collection('TodoList');

    // Extract data from the request body
    const { text, completed, timestamp } = req.body;
    const newTodo = { text, completed, timestamp, delete: false };

    // Insert the newTodo document into the collection
    const result = await todoCollection.insertOne(newTodo);

    // Close the MongoDB connection
    client.close();
    const responseTodo = {
      id: result.insertedId.toHexString(),
      ...newTodo,
    }
    // Send the response
    res.json(responseTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// fetch request to get the todos
app.get('/fetch-todos', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MongoClinetString);

    // Access the TODOS database and TodoList collection
    const db = client.db('TODOS');
    const todoCollection = db.collection('TodoList');

    // Fetch only todos where delete is not true and completed is not true
    const todos = await todoCollection.find({
      $and: [
        { delete: { $ne: true } },   // Not equal to true
        { completed: { $ne: true } } // Not equal to true
      ]
    }).toArray();
    
    console.log(todos);

    // Close the MongoDB connection
    client.close();

    // Send the todos as a response
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to update todo text
app.post('/update-todo-text', async (req, res) => {
  try {
    const { id, text } = req.body;
    console.log(`new text value is: ${text} for the doc which has id: ${id}`)
    // Establish MongoDB connection
    const client = await MongoClient.connect(MongoClinetString);
    const db = client.db('TODOS');
    const todoCollection = db.collection('TodoList');

    // Update the text for the specified todo
    await todoCollection.updateOne({ _id: new ObjectId(id) }, { $set: { text } });

    // Close the MongoDB connection
    client.close();

    res.status(200).send('Todo text updated successfully');
  } catch (error) {
    console.error('Error updating todo text:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// completing todos
app.post('/complete-task', async (req, res) => {
  try {
    const id = req.body.id;
    console.log(`id for completing the todo is: ${id}`);

    // Establish MongoDB connection
    const client = await MongoClient.connect(MongoClinetString);
    const db = client.db('TODOS');
    const todoCollection = db.collection('TodoList');

    // Update the specified todo's 'delete' field to true
    const result = await todoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: true } }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log(`Todo with id ${id} marked as completed.`);
    } else {
      console.log(`Todo with id ${id} not found or not updated.`);
    }

    // Close the MongoDB connection
    client.close();

    res.status(200).send('Todo completed successfully');
  }
  catch (error) {
    console.error('Error completing todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Endpoint to delete a todo
app.post('/delete-todo', async (req, res) => {
  try {
    const { id } = req.body;
    console.log(`Todo id to be deleted is: ${id}`);
    // Establish MongoDB connection
    const client = await MongoClient.connect(MongoClinetString);
    const db = client.db('TODOS');
    const todoCollection = db.collection('TodoList');

    // Update the specified todo's 'delete' field to true
    const result = await todoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { delete: true } }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log(`Todo with id ${id} marked as deleted.`);
    } else {
      console.log(`Todo with id ${id} not found or not updated.`);
    }

    // Close the MongoDB connection
    client.close();

    res.status(200).send('Todo deleted successfully');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
