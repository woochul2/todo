const express = require('express');
const path = require('path');

/**
 * 현재 파일을 기준으로 대상의 상대 경로를 구한다.
 *
 * @param {string} target
 * @returns {string}
 */
const getPath = (target) => path.join(__dirname, target);

const main = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use('/', express.static(getPath('./src')));
  app.use('/:any', express.static(getPath('./src')));

  app.get('*', (_req, res) => {
    res.sendFile(getPath('./src/index.html'));
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}/`);
  });
};

main();
