import ItemsController from './items-controller.js';
import ItemsModel from './items-model.js';
import ItemsTemplate from './items-template.js';
import ItemsView from './items-view.js';

/**
 * @constructor
 */
export default function Items() {
  this.init();

  this.model = new ItemsModel(this.userId);
  this.template = new ItemsTemplate();
  this.view = new ItemsView(this.template);
  this.controller = new ItemsController(this.model, this.view);

  this.setView();
}

/**
 * 최초 생성 시 쿼리 스트링에서 유저 id를 받아와 저장하고,
 * 쿼리 스트링에 유저 id가 없으면 홈으로 이동한다.
 */
Items.prototype.init = function () {
  var matchResult = document.location.search.match(/userId=(?<userId>\d+)/);
  if (!matchResult) {
    window.location.href = 'index.html';
  }

  this.userId = Number(matchResult.groups.userId);
};

/**
 * 최초 생성 시 URL hash에 따라 View를 초기화하고,
 * URL hash가 바뀌면 View를 새로 초기화하도록 이벤트를 걸어준다.
 */
Items.prototype.setView = function () {
  this.controller.setView();
};
