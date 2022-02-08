import Page from '../abstract/page.js';

export default class NotFound extends Page {
  setRoot() {
    super.setRoot(`
      <main class="main page-notFound">
        <a href="/" class="home-link" aria-label="홈">홈으로 이동</a>
        <h1 class="not-found-message">Not Found</h1>
      </main>
    `);
  }
}
