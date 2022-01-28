/**
 * @constructor
 */
export default function Template() {}

/**
 * id, 제목, 완료 상태를 가진 항목들
 *
 * @param {Item[]} items
 * @returns {string}
 */
Template.prototype.todos = function (items) {
  function callback(el) {
    return `
      <li id="${el.id}" class="todo">
        <div class="todo__inside">
          <span>${el.title}</span>
          <button class="delete">삭제</button>
        </div>
      </li>
    `;
  }

  return items.map(callback).join('');
};

/** 모든 완료 항목을 삭제하는 버튼 */
Template.prototype.clearCompletedButton = function () {};
