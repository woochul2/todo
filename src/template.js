/**
 * @constructor
 */
export default function Template() {}

/**
 * id, 제목, 완료 상태를 가진 항목
 *
 * @param {Item} item
 * @returns {string}
 */
Template.prototype.todo = function (item) {
  return `
    <li data-id="${item.id}" class="todo">
      <div class="todo__inside">
        <span class="title">${item.title}</span>
        <div class="button-container">
          <button class="edit-btn" aria-label="수정">수정</button>
          <button class="delete-btn" aria-label="삭제">삭제</button>
        </div>
      </div>
    </li>
  `;
};

/**
 * 항목의 제목
 *
 * @param {*} title
 * @returns {string}
 */
Template.prototype.title = function (title) {
  return `<span class="title">${title}</span>`;
};

/**
 * 수정을 시작하면 사용하는 input
 *
 * @param {string} value
 * @returns {string}
 */
Template.prototype.editInput = function (value) {
  return `
    <label class="label label-edit">
      항목 제목 수정
      <input class="input input-edit" value="${value}" />
    </label>
  `;
};

/** 모든 완료 항목을 삭제하는 버튼 */
Template.prototype.clearCompletedButton = function () {};
