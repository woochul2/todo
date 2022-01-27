import Controller from './controller.js';
import Model from './model.js';
import Store from './store.js';
import Template from './template.js';
import View from './view.js';

/**
 * @constructor
 * @param {string} name 앱의 이름
 */
export default function App(name) {
  this.storage = new Store(name);
  this.model = new Model(this.storage);
  this.template = new Template();
  this.view = new View(this.template);
  this.controller = new Controller(this.model, this.view);

  this.init();
}

/**
 * 최초 생성 시 URL hash에 따라 View를 초기화하고,
 * URL hash가 바뀌면 View 새로 초기화하도록 이벤트를 걸어준다.
 */
App.prototype.init = function () {
  this.controller.setView();
};
