import { STORAGE_KEY } from '../../constants.js';
import Store from '../../storage.js';
import HomeController from './home-controller.js';
import HomeModel from './home-model.js';
import HomeTemplate from './home-template.js';
import HomeView from './home-view.js';

/**
 * @param {HTMLElement} root
 * @constructor
 */
export default function Home(root) {
  this.root = root;

  this.init();

  this.storage = new Store(STORAGE_KEY);
  this.model = new HomeModel(this.storage);
  this.template = new HomeTemplate();
  this.view = new HomeView(this.template);
  this.controller = new HomeController(this.model, this.view);

  this.controller.setView();
}

/** 최초 생성 시 root 엘리먼트의 내용을 초기화한다. */
Home.prototype.init = function () {
  this.root.innerHTML = `
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
  `;
};

/** 페이지가 바뀔 때 글로벌 이벤트 리스너를 제거하는 메소드 */
Home.prototype.removeEventListener = function () {
  this.view.removeEventListener();
};
