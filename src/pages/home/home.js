import Page from '../../abstract/page.js';
import { STORAGE_KEY } from '../../constants.js';
import Store from '../../storage.js';
import HomeController from './home-controller.js';
import HomeModel from './home-model.js';
import HomeView from './home-view.js';

export default class Home extends Page {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);

    this.storage = new Store(STORAGE_KEY);
    this.model = new HomeModel(this.storage);
    this.view = new HomeView();
    this.controller = new HomeController(this.model, this.view);

    this.controller.setView();
  }

  setRoot() {
    super.setRoot(`
      <main class="main page-home">
        <div class="new-user">
          <label class="new-user__label" for="new-user-input">새로 추가할 사용자 이름을 입력하세요.</label>
          <div class="new-user__container">
            <input class="new-user__input" name="new-user-input" />
            <button class="new-user__btn" aria-label="새로운 사용자 추가">추가</button>
          </div>
        </div>
        <ul class="users"></ul>
      </main>
    `);
  }
}
