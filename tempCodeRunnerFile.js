// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('prepmate');

// Create a new document in the collection.
db.getCollection('files').insertOne({
    name: 'My First File',
    content: 'console.log("Hello, World!");',
    ownerId: 'user123',
    createdAt: new Date(),
    updatedAt: new Date()
    
});
