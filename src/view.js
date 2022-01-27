/**
 * @constructor
 * @param {Template} template
 */
export default function View(template) {
  this.template = template;
}

/** 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다. */
View.prototype.watch = function () {};

/** 화면에 렌더링한다. */
View.prototype.render = function () {};
