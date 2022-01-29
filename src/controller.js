import Model from './model.js';
import View from './view.js';

/**
 * @constructor
 * @param {Model} model
 * @param {View} view
 */
export default function Controller(model, view) {
  this.model = model;
  this.view = view;

  this.init();
}

/** 최초 생성 시 사용자 입력에 따라 어떤 함수를 실행할지 설정한다. */
Controller.prototype.init = function () {
  this.view.watch('new-input', this.add.bind(this));
  this.view.watch('remove', this.remove.bind(this));
  this.view.watch('edit-start', this.editStart.bind(this));
  this.view.watch('edit', this.edit.bind(this));
};

/**
 * URL hash에 따라 View를 초기화한다.
 * 전체 항목, 작업 중인 항목, 완료한 항목 중 무엇을 출력할지 결정한다.
 */
Controller.prototype.setView = function () {
  function callback(data) {
    this.view.render('all', data);
  }

  this.model.read(callback.bind(this));
};

/**
 * 항목을 추가한다.
 *
 * @param {string} title title이 비어있으면 항목을 추가하지 않는다.
 * @returns {boolean} 항목을 정상적으로 추가했는지에 대한 결과를 반환한다.
 */
Controller.prototype.add = function (title) {
  var trimmedTitle = title.trim();
  if (trimmedTitle === '') {
    return false;
  }

  function callback(item) {
    this.view.render('add', item);
  }

  this.model.create(trimmedTitle, callback.bind(this));
  return true;
};

/**
 * 항목 하나를 삭제한다.
 *
 * @param {string | number} id
 */
Controller.prototype.remove = function (id) {
  function callback(id) {
    this.view.render('remove', id);
  }

  this.model.delete(id, callback.bind(this));
};

/**
 * 항목 내용 수정을 시작할 수 있도록 상태를 변경한다.
 *
 * @param {string | number} id
 */
Controller.prototype.editStart = function (id) {
  this.view.render('edit-start', id);
};

/**
 * 항목의 내용을 수정한다.
 *
 * @param {string | number} id
 * @param {string | undefined} title
 */
Controller.prototype.edit = function (id, title) {
  var trimmedTitle = title && title.trim();

  function callback(id, title) {
    this.view.render('edit', { id, title });
  }

  if (trimmedTitle === '') {
    callback.call(this, id, trimmedTitle);
  } else {
    this.model.update(id, trimmedTitle, callback.bind(this));
  }
};

/** 항목의 완료 상태를 토글한다. */
Controller.prototype.toggle = function () {};

/** 모든 항목을 완료 상태를 토글한다. */
Controller.prototype.toggleAll = function () {};

/** 모든 완료 항목을 삭제한다. */
Controller.prototype.removeAllCompleted = function () {};
