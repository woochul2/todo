import ViewParent from '../../abstract/view-parent.js';
import { KEY } from '../../constants.js';

export default class ItemsView extends ViewParent {
  constructor() {
    super();

    this.$username = document.querySelector('.page-items__username');
    this.$newItem = document.querySelector('.new-item');
    this.$newItemInput = document.querySelector('.new-item__input');
    this.$items = document.querySelector('.items');
    this.$count = document.querySelector('.items-count');

    this.removeEventListener = this.init();
  }

  /**
   * 최초 생성 시 입력 창에 포커스를 옮기고, 포커스 이벤트 리스너를 등록한다.
   *
   * @returns {function} 이벤트 리스너를 삭제하는 함수
   */
  init() {
    this.$newItemInput.focus();

    const listener = this.focus.bind(this);
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }

  /**
   * @param {KeyboardEvent} event
   */
  focus(event) {
    super.focus(event, this.$newItemInput);
  }

  /**
   * 입력한 title에 따라 새로운 항목을 추가하는 이벤트 리스너를 등록한다.
   *
   * @param {function} handler title을 받아 항목을 추가하는 함수
   */
  ['watch_new-item'](handler) {
    const keydownListener = (event) => {
      if (event.key !== KEY.ENTER) {
        return;
      }

      const title = event.target.value.trim();
      if (title === '') {
        return;
      }

      handler(title);
      event.target.value = '';
    };

    const clickListener = (event) => {
      const button = event.target.closest('.new-item__btn');
      if (!button) {
        return;
      }

      const input = this.$newItem.querySelector('.new-item__input');
      const title = input.value.trim();
      if (title === '') {
        return;
      }

      handler(title);
      input.value = '';
      input.focus();
    };

    this.$newItem.addEventListener('keydown', keydownListener);
    this.$newItem.addEventListener('click', clickListener);
  }

  /**
   * 항목 삭제 버튼을 누르면 그 항목을 삭제하는 이벤트 리스너를 등록한다.
   *
   * @param {function} handler id를 받아 항목 하나를 삭제하는 함수
   */
  watch_remove(handler) {
    const listener = (event) => {
      const item = event.target.closest('.item');
      if (!item || !event.target.closest('.item__delete-btn')) {
        return;
      }

      handler(Number(item.dataset.id));
    };

    this.$items.addEventListener('click', listener);
  }

  /**
   * 수정 버튼을 누르면 그 항목을 수정할 수 있도록 해주는 이벤트 리스너를 등록한다.
   *
   * @param {function} handler id를 받아 항목 수정 시작을 알리는 함수
   */
  ['watch_edit-start'](handler) {
    const doubleClickListener = (event) => {
      if (!event.target.closest('.item__title')) {
        return;
      }

      const item = event.target.closest('.item');
      if (!item || item.classList.contains('editing')) {
        return;
      }

      handler(Number(item.dataset.id));
    };

    const clickListener = (event) => {
      const item = event.target.closest('.item');
      if (!item || !event.target.closest('.item__edit-btn') || item.classList.contains('editing')) {
        return;
      }

      handler(Number(item.dataset.id));

      item.startedEditing = true;
    };

    this.$items.addEventListener('dblclick', doubleClickListener);
    this.$items.addEventListener('click', clickListener);
  }

  /**
   * 수정을 완료하는 이벤트 리스너를 등록한다.
   *
   * @param {function} handler id와 title을 받아 항목을 수정하는 함수
   */
  watch_edit(handler) {
    const clickListener = (event) => {
      const item = event.target.closest('.item');
      if (!item || !event.target.closest('.item__edit-btn')) {
        return;
      }

      if (item.startedEditing) {
        item.startedEditing = false;
        return;
      }

      const input = item.querySelector('.item__input-edit');
      const title = input.value.trim();
      handler(Number(item.dataset.id), title);
    };

    const keydownListener = (event) => {
      const item = event.target.closest('.item');
      if (!item || !event.target.closest('.item__input-edit')) {
        return;
      }

      item.startedEditing = false;

      if (event.key === KEY.ENTER) {
        const input = item.querySelector('.item__input-edit');
        const nextTitle = input.value.trim();
        handler(Number(item.dataset.id), nextTitle);
      } else if (event.key === KEY.ESCAPE) {
        handler(Number(item.dataset.id));
      }
    };

    this.$items.addEventListener('click', clickListener);
    this.$items.addEventListener('keydown', keydownListener);
  }

  /**
   * 전체 화면을 새로 렌더링한다.
   *
   * @param {object} param
   * @param {string} param.username
   * @param {Item[]} param.items
   */
  render_all({ username, items }) {
    const callback = (el) => this.template.item(el);

    this.$username.innerHTML = username;
    this.$items.innerHTML = items.map(callback, this).join('');
    this.$count.innerHTML = `${items.length}개`;
  }

  /**
   * 추가한 항목만 렌더링한다.
   *
   * @param {Item} item
   */
  render_add(item) {
    const tmp = document.createElement('div');
    tmp.innerHTML = this.template.item(item);
    this.$items.appendChild(tmp.firstElementChild);

    const nextCount = parseInt(this.$count.innerHTML) + 1;
    this.$count.innerHTML = `${nextCount}개`;
  }

  /**
   * 삭제한 항목만 DOM에서 없애준다.
   *
   * @param {number} itemId
   */
  render_remove(itemId) {
    const item = this.$items.querySelector(`.item[data-id="${itemId}"]`);
    item.remove();

    const nextCount = parseInt(this.$count.innerHTML) - 1;
    this.$count.innerHTML = `${nextCount}개`;
  }

  /**
   * 항목에 input을 추가하여 수정을 시작한다.
   *
   * @param {number} itemId
   */
  ['render_edit-start'](itemId) {
    const item = this.$items.querySelector(`.item[data-id="${itemId}"]`);
    item.classList.add('editing');
    const title = item.querySelector('.item__title');
    title.outerHTML = this.template.editInput(title.innerHTML);
    const editButton = item.querySelector('.item__edit-btn');
    editButton.innerHTML = '완료';
    editButton.ariaLabel = '완료';

    const input = item.querySelector('.item__input-edit');
    input.focus();
    const cursorPos = input.value.length;
    input.setSelectionRange(cursorPos, cursorPos);
  }

  /**
   * 수정한 항목의 title만 변경한다.
   *
   * @param {object} param
   * @param {number} param.itemId
   * @param {string} param.title 새로 입력한 제목
   */
  render_edit({ itemId, title }) {
    const item = this.$items.querySelector(`.item[data-id="${itemId}"]`);
    item.classList.remove('editing');

    const label = item.querySelector('.item__label-edit');
    const input = label.querySelector('.item__input-edit');
    const nextTitle = !title || title.trim() === '' ? input.defaultValue : title;
    label.outerHTML = this.template.title(nextTitle);

    const editButton = item.querySelector('.item__edit-btn');
    editButton.innerHTML = '수정';
    editButton.ariaLabel = '수정';
  }

  get template() {
    return {
      /**
       * id, 제목, 완료 상태를 가진 항목
       *
       * @param {Item} item
       * @returns {string}
       */
      item: (item) => {
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
      },

      /**
       * 항목의 제목
       *
       * @param {*} title
       * @returns {string}
       */
      title: (title) => {
        return `<span class="item__title">${title}</span>`;
      },

      /**
       * 수정을 시작하면 사용하는 input
       *
       * @param {string} value
       * @returns {string}
       */
      editInput: (value) => {
        return `
          <label class="hidden-label item__label-edit">
            항목 제목 수정
            <input class="item__input-edit" value="${value}" />
          </label>
        `;
      },

      /**
       * 모든 완료 항목을 삭제하는 버튼
       */
      clearCompletedButton: () => {},
    };
  }
}
