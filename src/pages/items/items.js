import ItemsController from './items-controller.js';
import ItemsModel from './items-model.js';
import ItemsTemplate from './items-template.js';
import ItemsView from './items-view.js';

/**
 * @param {HTMLElement} root
 * @constructor
 */
export default function Items(root) {
  this.root = root;

  this.init();

  this.model = new ItemsModel(this.userId);
  this.template = new ItemsTemplate();
  this.view = new ItemsView(this.template);
  this.controller = new ItemsController(this.model, this.view);

  this.setView();
}

/**
 * 최초 생성 시 root 엘리먼트의 내용을 초기화하고, URL에서 유저 id를 받아와 저장한다.
 * URL에 유저 id가 없으면 홈으로 이동한다.
 */
Items.prototype.init = function () {
  this.root.innerHTML = `
    <a href="/" aria-label="홈">홈</a>
    <main class="main page-items">
      <h1 class="user"><span class="user-name"></span>의 투두 리스트</h1>
      <div class="new-item-box">
        <label class="label">
          새로운 항목 추가
          <input class="input" autofocus />
        </label>
        <button class="button" aria-label="새로운 항목 추가">추가</button>
      </div>
      <ul class="items"></ul>
      <div class="count"></div>
    </main>
  `;

  var matchResult = window.location.pathname.match(/\/(?<userId>\d+)\/items/);
  if (!matchResult) {
    window.location.href = '/';
  }

  this.userId = Number(matchResult.groups.userId);
};

/**
 * 최초 생성 시 URL hash에 따라 View를 초기화하고,
 * URL hash가 바뀌면 View를 새로 초기화하도록 이벤트를 걸어준다.
 */
Items.prototype.setView = function () {
  var user = this.model.getUser();
  if (user) {
    this.controller.setView();
  }
};

/** 페이지가 바뀔 때 글로벌 이벤트 리스너를 제거하는 메소드 */
Items.prototype.removeEventListener = function () {
  this.view.removeEventListener();
};
