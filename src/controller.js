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
Controller.prototype.init = function () {};

/**
 * URL hash에 따라 View를 초기화한다.
 * 전체 항목, 작업 중인 항목, 완료한 항목 중 무엇을 출력할지 결정한다.
 */
Controller.prototype.setView = function () {
  var data = this.model.read();
  this.view.render(data);
};

/** 항목을 추가한다. */
Controller.prototype.add = function () {};

/** 항목의 내용을 수정한다. */
Controller.prototype.edit = function () {};

/** 항목 하나를 삭제한다. */
Controller.prototype.remove = function () {};

/** 항목의 완료 상태를 토글한다. */
Controller.prototype.toggle = function () {};

/** 모든 항목을 완료 상태를 토글한다. */
Controller.prototype.toggleAll = function () {};

/** 모든 완료 항목을 삭제한다. */
Controller.prototype.removeAllCompleted = function () {};
