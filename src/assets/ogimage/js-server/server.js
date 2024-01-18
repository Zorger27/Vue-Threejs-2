const express = require('express');
const app = express();

const openGraphHandler = require('@/assets/ogimage/js-server/openGraphHandler');

// Зарегистрируйте обработчик openGraphHandler как middleware
app.use('/api/openGraphHandler', openGraphHandler);

// Загрузка статических ресурсов из папки dist
app.use(express.static('dist'));

// Обработка всех остальных запросов отправляется на index.html
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// Слушайте на порту 3000 (или на другом порту, который вы предпочитаете)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});