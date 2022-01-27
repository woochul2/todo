import { KEY } from './constants.js';
import Template from './template.js';

/**
 * @constructor
 * @param {Template} template
 */
export default function View(template) {
  this.template = template;

  this.$newInput = document.querySelector('.new-input');
  this.$todos = document.querySelector('.todos');
  this.$count = document.querySelector('.count');

  this.init();
}

/** 최초 생성 시 포커스 이벤트 리스너를 등록한다. */
View.prototype.init = function () {
  window.addEventListener('keydown', this.focus.bind(this));
};

/**
 * 슬래시(/) 키를 누르면 입력 창에 포커스 되도록 한다.
 *
 * @param {KeyboardEvent} event
 */
View.prototype.focus = function (event) {
  if (event.key === '/') {
    event.preventDefault();
    this.$newInput.focus();
  }
};

/**
 * 화면에 렌더링한다.
 *
 * @param {Item[]} items
 */
View.prototype.render = function (items) {
  this.$todos.innerHTML = this.template.todos(items);
  this.$count.innerHTML = `${items.length}개`;
};

/**
 * 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다.
 *
 * @param {string} name 사용자 입력 이름
 * @param {function} handler 사용자 입력에 따라 실행할 함수
 */
View.prototype.watch = function (name, handler) {
  if (name === 'new-input') {
    this.newInput(handler);
  }
};

/**
 * 사용자가 입력한 title에 따라 새로운 항목을 추가하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler title을 받아 작동 결과를 boolean으로 반환하는 함수
 */
View.prototype.newInput = function (handler) {
  this.$newInput.addEventListener('keydown', function (event) {
    if (event.key !== KEY.ENTER) {
      return;
    }

    var hasAdded = handler(event.target.value);
    if (hasAdded) {
      event.target.value = '';
    }
  });
};
