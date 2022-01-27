import Template from './template.js';

/**
 * @constructor
 * @param {Template} template
 */
export default function View(template) {
  this.template = template;

  this.$todos = document.querySelector('.todos');
  this.$count = document.querySelector('.count');
}

/** 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다. */
View.prototype.watch = function () {};

/** 화면에 렌더링한다. */
View.prototype.render = function (data) {
  this.$todos.innerHTML = this.template.todos(data);
  this.$count.innerHTML = `${data.length}개`;
};
