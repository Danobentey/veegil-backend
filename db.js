const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = "mongodb+srv://wallet_user:QnHt2puoU2HoOVFF@cluster0.rnpbfbx.mongodb.net/bank_app?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;

const connectDB = (app) => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      })
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = connectDB;
