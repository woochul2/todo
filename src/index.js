import Home from './pages/home/home.js';
import Items from './pages/items/items.js';

const main = () => {
  const root = document.getElementById('root');

  const render = (path) => {
    if (path === '/') return new Home(root);
    if (/\/\d+\/items/.test(path)) return new Items(root);
    return new Home(root);
  };

  let prev;

  const removeEventListener = () => {
    if (!prev) return;

    prev.removeEventListener();
  };

  root.addEventListener('click', (event) => {
    if (!event.target.matches('a')) return;

    event.preventDefault();
    removeEventListener();

    const path = event.target.getAttribute('href');
    window.history.pushState({}, null, path);

    prev = render(path);
  });

  window.addEventListener('popstate', () => {
    removeEventListener();

    prev = render(window.location.pathname);
  });

  prev = render(window.location.pathname);
};

main();
