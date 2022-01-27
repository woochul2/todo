/**
 * @constructor
 */
export default function Template() {}

/** id, 제목, 완료 상태를 가진 항목들  */
Template.prototype.todos = function (data) {
  function callback(el) {
    return `<li id="${el.id}" class="todo">${el.title}</li>`;
  }

  return data.map(callback).join('');
};

/** 전체 완료 항목을 삭제하는 버튼 */
Template.prototype.clearCompletedButton = function () {};
