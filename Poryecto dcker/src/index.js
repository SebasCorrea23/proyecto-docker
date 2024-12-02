const express = require('express');
const cors = require('cors');
const { userRouter } = require('./routes/user.routes');
const { postRouter } = require('./routes/post.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});