import dotenv from 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/databse.js';

const PORT = process.env.PORT || 3000;

connectDB()
.catch((error) => {
  console.error('Failed to connect to the database:', error);
});

 app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
 });
