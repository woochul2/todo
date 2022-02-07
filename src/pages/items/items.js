import Page from '../../abstract/page.js';
import { STORAGE_KEY } from '../../constants.js';
import Store from '../../storage.js';
import ItemsController from './items-controller.js';
import ItemsModel from './items-model.js';
import ItemsView from './items-view.js';

export default class Items extends Page {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    super(root);

    this.init();

    this.storage = new Store(STORAGE_KEY);
    this.model = new ItemsModel(this.storage, this.userId);
    this.view = new ItemsView();
    this.controller = new ItemsController(this.model, this.view);

    this.setView();
  }

  setRoot() {
    super.setRoot(`
      <main class="main page-items">
        <a href="/" class="home-link" aria-label="홈">홈</a>
        <h1 class="page-items__title"><span class="page-items__username"></span>의 투두 리스트</h1>
        <div class="new-item">
          <label class="hidden-label new-item__label">
            새로운 항목 추가
            <input class="new-item__input" />
          </label>
          <button class="new-item__btn" aria-label="새로운 항목 추가">추가</button>
        </div>
        <ul class="items"></ul>
        <div class="items-count"></div>
      </main>
    `);
  }

  /**
   * 최초 생성 시 URL에서 유저 id를 받아와 저장한다.
   * URL에 유저 id가 없으면 홈으로 이동한다.
   */
  init() {
    const regex = /\/(?<userId>\d+)\/items/;
    const matchResult = window.location.pathname.match(regex);
    if (!matchResult) window.location.href = '/';

    this.userId = Number(matchResult.groups.userId);
  }

  /**
   * 최초 생성 시 URL hash에 따라 View를 초기화하고,
   * URL hash가 바뀌면 View를 새로 초기화하도록 이벤트를 걸어준다.
   * Model에 ths.userId에 해당하는 유저가 없으면 홈으로 이동한다.
   */
  setView() {
    const user = this.model.getUser();
    if (user) this.controller.setView();
    else window.location.href = '/';
  }
}
