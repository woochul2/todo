import { KEY } from '../../constants.js';
import ItemsTemplate from './items-template.js';

/**
 * @constructor
 * @param {ItemsTemplate} template
 */
export default function ItemsView(template) {
  this.template = template;

  this.$username = document.querySelector('.page-items__username');
  this.$newItem = document.querySelector('.new-item');
  this.$items = document.querySelector('.items');
  this.$count = document.querySelector('.items-count');

  this.removeEventListener = this.init();
}

/**
 * 최초 생성 시 입력 창에 포커스를 옮기고, 포커스 이벤트 리스너를 등록한다.
 *
 * @returns {function} 이벤트 리스너를 삭제하는 함수
 */
ItemsView.prototype.init = function () {
  var input = this.$newItem.querySelector('.new-item__input');
  input.focus();

  var listener = this.focus.bind(this);
  window.addEventListener('keydown', listener);

  return function () {
    window.removeEventListener('keydown', listener);
  };
};

/**
 * 슬래시(/) 키를 누르면 입력 창에 포커스 되도록 한다.
 *
 * @param {KeyboardEvent} event
 */
ItemsView.prototype.focus = function (event) {
  if (event.key === '/') {
    event.preventDefault();

    var input = this.$newItem.querySelector('.new-item__input');
    input.focus();
  }
};

/**
 * 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다.
 *
 * @param {string} name 사용자 입력 이름
 * @param {function} handler 사용자 입력에 따라 실행할 함수
 */
ItemsView.prototype.watch = function (name, handler) {
  if (name === 'new-item') {
    this.watchNewInput(handler);
  } else if (name === 'remove') {
    this.watchRemove(handler);
  } else if (name === 'edit-start') {
    this.watchEditStart(handler);
  } else if (name === 'edit') {
    this.watchEdit(handler);
  }
};

/**
 * 입력한 title에 따라 새로운 항목을 추가하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler title을 받아 항목을 추가하는 함수
 */
ItemsView.prototype.watchNewInput = function (handler) {
  function keydownListener(event) {
    if (event.key !== KEY.ENTER) {
      return;
    }

    var title = event.target.value.trim();
    if (title === '') {
      return;
    }

    handler(title);
    event.target.value = '';
  }

  function clickListener(event) {
    var button = event.target.closest('.new-item__btn');
    if (!button) {
      return;
    }

    var input = this.$newItem.querySelector('.new-item__input');
    var title = input.value.trim();
    if (title === '') {
      return;
    }

    handler(title);
    input.value = '';
    input.focus();
  }

  this.$newItem.addEventListener('keydown', keydownListener);
  this.$newItem.addEventListener('click', clickListener.bind(this));
};

/**
 * 항목 삭제 버튼을 누르면 그 항목을 삭제하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id를 받아 항목 하나를 삭제하는 함수
 */
ItemsView.prototype.watchRemove = function (handler) {
  function listener(event) {
    var item = event.target.closest('.item');
    if (!item || !event.target.closest('.item__delete-btn')) {
      return;
    }

    handler(Number(item.dataset.id));
  }

  this.$items.addEventListener('click', listener);
};

/**
 * 수정 버튼을 누르면 그 항목을 수정할 수 있도록 해주는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id를 받아 항목 수정 시작을 알리는 함수
 */
ItemsView.prototype.watchEditStart = function (handler) {
  function doubleClickListener(event) {
    if (!event.target.closest('.item__title')) {
      return;
    }

    var item = event.target.closest('.item');
    if (!item || item.classList.contains('editing')) {
      return;
    }

    handler(Number(item.dataset.id));
  }

  function clickListener(event) {
    var item = event.target.closest('.item');
    if (!item || !event.target.closest('.item__edit-btn') || item.classList.contains('editing')) {
      return;
    }

    handler(Number(item.dataset.id));

    item.startedEditing = true;
  }

  this.$items.addEventListener('dblclick', doubleClickListener);
  this.$items.addEventListener('click', clickListener);
};

/**
 * 수정을 완료하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id와 title을 받아 항목을 수정하는 함수
 */
ItemsView.prototype.watchEdit = function (handler) {
  function clickListener(event) {
    var item = event.target.closest('.item');
    if (!item || !event.target.closest('.item__edit-btn')) {
      return;
    }

    if (item.startedEditing) {
      item.startedEditing = false;
      return;
    }

    var input = item.querySelector('.item__input-edit');
    var title = input.value.trim();
    handler(Number(item.dataset.id), title);
  }

  function keydownListener(event) {
    var item = event.target.closest('.item');
    if (!item || !event.target.closest('.item__input-edit')) {
      return;
    }

    item.startedEditing = false;

    if (event.key === KEY.ENTER) {
      var input = item.querySelector('.item__input-edit');
      var nextTitle = input.value.trim();
      handler(Number(item.dataset.id), nextTitle);
    } else if (event.key === KEY.ESCAPE) {
      handler(Number(item.dataset.id));
    }
  }

  this.$items.addEventListener('click', clickListener);
  this.$items.addEventListener('keydown', keydownListener);
};

/**
 * 명령어에 해당하는 DOM 엘리먼트를 업데이트한다.
 *
 * @param {string} command 명령어 이름
 * @param {*} parameter DOM 엘리먼트를 업데이트하는 데 필요한 변수
 */
ItemsView.prototype.render = function (command, parameter) {
  if (command === 'all') {
    this.renderAll(parameter);
  } else if (command === 'add') {
    this.renderAdd(parameter);
  } else if (command === 'remove') {
    this.renderRemove(parameter);
  } else if (command === 'edit-start') {
    this.renderEditStart(parameter);
  } else if (command === 'edit') {
    this.renderEdit(parameter);
  }
};

/**
 * 전체 화면을 새로 렌더링한다.
 *
 * @param {object} param
 * @param {string} param.username
 * @param {Item[]} param.items
 */
ItemsView.prototype.renderAll = function ({ username, items }) {
  function callback(el) {
    return this.template.item(el);
  }

  this.$username.innerHTML = username;
  this.$items.innerHTML = items.map(callback, this).join('');
  this.$count.innerHTML = `${items.length}개`;
};

/**
 * 추가한 항목만 렌더링한다.
 *
 * @param {Item} item
 */
ItemsView.prototype.renderAdd = function (item) {
  var tmp = document.createElement('div');
  tmp.innerHTML = this.template.item(item);
  this.$items.appendChild(tmp.firstElementChild);

  var nextCount = parseInt(this.$count.innerHTML) + 1;
  this.$count.innerHTML = `${nextCount}개`;
};

/**
 * 삭제한 항목만 DOM에서 없애준다.
 *
 * @param {number} itemId
 */
ItemsView.prototype.renderRemove = function (itemId) {
  var item = this.$items.querySelector(`.item[data-id="${itemId}"]`);
  item.remove();

  var nextCount = parseInt(this.$count.innerHTML) - 1;
  this.$count.innerHTML = `${nextCount}개`;
};

/**
 * 항목에 input을 추가하여 수정을 시작한다.
 *
 * @param {number} itemId
 */
ItemsView.prototype.renderEditStart = function (itemId) {
  var item = this.$items.querySelector(`.item[data-id="${itemId}"]`);
  item.classList.add('editing');
  var title = item.querySelector('.item__title');
  title.outerHTML = this.template.editInput(title.innerHTML);
  var editButton = item.querySelector('.item__edit-btn');
  editButton.innerHTML = '완료';
  editButton.ariaLabel = '완료';

  var input = item.querySelector('.item__input-edit');
  input.focus();
  var cursorPos = input.value.length;
  input.setSelectionRange(cursorPos, cursorPos);
};

/**
 * 수정한 항목의 title만 변경한다.
 *
 * @param {object} param
 * @param {number} param.itemId
 * @param {string} param.title 새로 입력한 제목
 */
ItemsView.prototype.renderEdit = function ({ itemId, title }) {
  var item = this.$items.querySelector(`.item[data-id="${itemId}"]`);
  item.classList.remove('editing');

  var label = item.querySelector('.item__label-edit');
  var input = label.querySelector('.item__input-edit');
  var nextTitle = !title || title.trim() === '' ? input.defaultValue : title;
  label.outerHTML = this.template.title(nextTitle);

  var editButton = item.querySelector('.item__edit-btn');
  editButton.innerHTML = '수정';
  editButton.ariaLabel = '수정';
};
