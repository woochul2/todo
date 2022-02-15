import Home from './pages/home/home.js';
import Items from './pages/items/items.js';
import NotFound from './pages/NotFound.js';
import './style.css';

const main = () => {
  let prevPage;
  let prevPath;

  const root = document.getElementById('root');

  const render = (path) => {
    prevPath = path;

    if (path === '/') return new Home(root);
    if (/\/\d+\/items$/.test(path)) return new Items(root);
    return new NotFound(root);
  };

  const removeEventListener = () => {
    if (!prevPage) return;

    prevPage.removeEventListener();
  };

  root.addEventListener('click', (event) => {
    if (!event.target.matches('a')) return;

    const path = event.target.getAttribute('href');
    if (path[0] === '#') return;

    event.preventDefault();
    removeEventListener();

    window.history.pushState({}, null, path);

    prevPage = render(path);
  });

  window.addEventListener('popstate', () => {
    const { pathname } = window.location;
    if (prevPath === pathname) return;

    removeEventListener();

    prevPage = render(pathname);
  });

  prevPage = render(window.location.pathname);
};

main();
