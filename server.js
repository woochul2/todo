var express = require('express');
var path = require('path');

/**
 * 현재 파일을 기준으로 대상의 상대 경로를 구한다.
 *
 * @param {string} target
 * @returns {string}
 */
function getPath(target) {
  return path.join(__dirname, target);
}

function main() {
  var app = express();
  var port = process.env.PORT || 3000;

  app.use('/', express.static(getPath('./src')));
  app.use('/:any', express.static(getPath('./src')));

  app.get('*', function (_req, res) {
    res.sendFile(getPath('./src/index.html'));
  });

  app.listen(port, function () {
    console.log(`Server is listening on port ${port}/`);
  });
}

main();
