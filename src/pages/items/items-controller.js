import ItemsModel from './items-model.js';
import ItemsView from './items-view.js';

/**
 * @constructor
 * @param {ItemsModel} model
 * @param {ItemsView} view
 */
export default function ItemsController(model, view) {
  this.model = model;
  this.view = view;

  this.init();
}

/** 최초 생성 시 사용자 입력에 따라 어떤 함수를 실행할지 설정한다. */
ItemsController.prototype.init = function () {
  this.view.watch('new-item', this.add.bind(this));
  this.view.watch('remove', this.remove.bind(this));
  this.view.watch('edit-start', this.editStart.bind(this));
  this.view.watch('edit', this.edit.bind(this));
};

/**
 * URL hash에 따라 View를 초기화한다.
 * 전체 항목, 작업 중인 항목, 완료한 항목 중 무엇을 출력할지 결정한다.
 */
ItemsController.prototype.setView = function () {
  function callback(username, items) {
    this.view.render('all', { username, items });
  }

  this.model.read(callback.bind(this));
};

/**
 * 항목을 추가한다.
 *
 * @param {string} title
 */
ItemsController.prototype.add = function (title) {
  function callback(item) {
    this.view.render('add', item);
  }

  this.model.create(title, callback.bind(this));
};

/**
 * 항목 하나를 삭제한다.
 *
 * @param {number} itemId
 */
ItemsController.prototype.remove = function (itemId) {
  function callback(itemId) {
    this.view.render('remove', itemId);
  }

  this.model.delete(itemId, callback.bind(this));
};

/**
 * 항목 내용 수정을 시작할 수 있도록 상태를 변경한다.
 *
 * @param {number} itemId
 */
ItemsController.prototype.editStart = function (itemId) {
  this.view.render('edit-start', itemId);
};

/**
 * 항목의 내용을 수정한다.
 *
 * @param {number} itemId
 * @param {string | undefined} title
 */
ItemsController.prototype.edit = function (itemId, title) {
  function callback(itemId, title) {
    this.view.render('edit', { itemId, title });
  }

  if (!title) {
    callback.call(this, itemId, title);
  } else {
    this.model.update(itemId, title, callback.bind(this));
  }
};

/** 항목의 완료 상태를 토글한다. */
ItemsController.prototype.toggle = function () {};

/** 모든 항목을 완료 상태를 토글한다. */
ItemsController.prototype.toggleAll = function () {};

/** 모든 완료 항목을 삭제한다. */
ItemsController.prototype.removeAllCompleted = function () {};
