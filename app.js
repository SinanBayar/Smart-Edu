const express = require('express');
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

app.get('/', (req, res) => {
  res.status(200).send('INDEX SAYFASI');
});
