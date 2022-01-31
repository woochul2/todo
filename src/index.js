import Home from './pages/home/home.js';
import Items from './pages/items/items.js';

const root = document.getElementById('root');

function render(path) {
  if (path === '/') {
    return new Home(root);
  } else if (/\/\d+\/items/.test(path)) {
    return new Items(root);
  }
}

var prev;

function removeEventListener() {
  if (!prev) {
    return;
  }

  prev.removeEventListener();
}

root.addEventListener('click', function (event) {
  if (!event.target.matches('a')) {
    return;
  }

  removeEventListener();
  event.preventDefault();

  var path = event.target.getAttribute('href');
  window.history.pushState({}, null, path);

  prev = render(path);
});

window.addEventListener('popstate', function () {
  removeEventListener();

  prev = render(window.location.pathname);
});

prev = render(window.location.pathname);
