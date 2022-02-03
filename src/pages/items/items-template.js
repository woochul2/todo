/**
 * @constructor
 */
export default function ItemsTemplate() {}

/**
 * id, 제목, 완료 상태를 가진 항목
 *
 * @param {Item} item
 * @returns {string}
 */
ItemsTemplate.prototype.item = function (item) {
  return `
    <li data-id="${item.id}" class="item">
      <div class="item__inside">
        <span class="item__title">${item.title}</span>
        <div class="item__btn-container">
          <button class="item__edit-btn" aria-label="수정">수정</button>
          <button class="item__delete-btn" aria-label="삭제">삭제</button>
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
ItemsTemplate.prototype.title = function (title) {
  return `<span class="item__title">${title}</span>`;
};

/**
 * 수정을 시작하면 사용하는 input
 *
 * @param {string} value
 * @returns {string}
 */
ItemsTemplate.prototype.editInput = function (value) {
  return `
    <label class="hidden-label item__label-edit">
      항목 제목 수정
      <input class="item__input-edit" value="${value}" />
    </label>
  `;
};

/** 모든 완료 항목을 삭제하는 버튼 */
ItemsTemplate.prototype.clearCompletedButton = function () {};
