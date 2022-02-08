const express = require('express');
const path = require('path');

const main = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use('/static', express.static(path.resolve('./dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}/`);
  });
};

main();