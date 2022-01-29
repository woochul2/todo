import { KEY } from './constants.js';
import Template from './template.js';

/**
 * @constructor
 * @param {Template} template
 */
export default function View(template) {
  this.template = template;

  this.$newInputBox = document.querySelector('.new-input-box');
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
    var input = this.$newInputBox.querySelector('.input');
    input.focus();
  }
};

/**
 * 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다.
 *
 * @param {string} name 사용자 입력 이름
 * @param {function} handler 사용자 입력에 따라 실행할 함수
 */
View.prototype.watch = function (name, handler) {
  if (name === 'new-input') {
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
 * @param {function} handler title을 받아 작동 결과를 boolean으로 반환하는 함수
 */
View.prototype.watchNewInput = function (handler) {
  function keydownListener(event) {
    if (event.key !== KEY.ENTER) {
      return;
    }

    var hasAdded = handler(event.target.value);
    if (hasAdded) {
      event.target.value = '';
    }
  }

  function clickListener(event) {
    var button = event.target.closest('.button');
    if (!button) {
      return;
    }

    var inputBox = event.target.closest('.new-input-box');
    var input = inputBox.querySelector('.input');

    var hasAdded = handler(input.value);
    if (hasAdded) {
      input.value = '';
      input.focus();
    }
  }

  this.$newInputBox.addEventListener('keydown', keydownListener);
  this.$newInputBox.addEventListener('click', clickListener);
};

/**
 * 항목 삭제 버튼을 누르면 그 항목을 삭제하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id를 받아 항목 하나를 삭제하는 함수
 */
View.prototype.watchRemove = function (handler) {
  function listener(event) {
    var todo = event.target.closest('.todo');
    if (!todo || !event.target.closest('.delete-btn')) {
      return;
    }

    handler(todo.dataset.id);
  }

  this.$todos.addEventListener('click', listener);
};

/**
 * 수정 버튼을 누르면 그 항목을 수정할 수 있도록 해주는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id를 받아 항목 수정 시작을 알리는 함수
 */
View.prototype.watchEditStart = function (handler) {
  function doubleClickListener(event) {
    if (!event.target.closest('.title')) {
      return;
    }

    var todo = event.target.closest('.todo');
    if (!todo || todo.classList.contains('editing')) {
      return;
    }

    handler(todo.dataset.id);
  }

  function clickListener(event) {
    var todo = event.target.closest('.todo');
    if (!todo || !event.target.closest('.edit-btn') || todo.classList.contains('editing')) {
      return;
    }

    handler(todo.dataset.id);

    todo.startedEditing = true;
  }

  this.$todos.addEventListener('dblclick', doubleClickListener);
  this.$todos.addEventListener('click', clickListener);
};

/**
 * 수정을 완료하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id와 title을 받아 항목을 수정하는 함수
 */
View.prototype.watchEdit = function (handler) {
  function clickListener(event) {
    var todo = event.target.closest('.todo');
    if (!todo || !event.target.closest('.edit-btn')) {
      return;
    }

    if (todo.startedEditing) {
      todo.startedEditing = false;
      return;
    }

    var input = todo.querySelector('.input-edit');
    var nextTitle = input.value;
    handler(todo.dataset.id, nextTitle);
  }

  function keydownListener(event) {
    var todo = event.target.closest('.todo');
    if (!todo || !event.target.closest('.input-edit')) {
      return;
    }

    todo.startedEditing = false;

    if (event.key === KEY.ENTER) {
      var input = todo.querySelector('.input-edit');
      var nextTitle = input.value;
      handler(todo.dataset.id, nextTitle);
    } else if (event.key === KEY.ESCAPE) {
      handler(todo.dataset.id);
    }
  }

  this.$todos.addEventListener('click', clickListener);
  this.$todos.addEventListener('keydown', keydownListener);
};

/**
 * 명령어에 해당하는 DOM 엘리먼트를 업데이트한다.
 *
 * @param {string} command 명령어 이름
 * @param {*} parameter DOM 엘리먼트를 업데이트하는 데 필요한 변수
 */
View.prototype.render = function (command, parameter) {
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
 * @param {Item[]} items
 */
View.prototype.renderAll = function (items) {
  function callback(el) {
    return this.template.todo(el);
  }

  this.$todos.innerHTML = items.map(callback, this).join('');
  this.$count.innerHTML = `${items.length}개`;
};

/**
 * 추가한 항목만 렌더링한다.
 *
 * @param {Item} item
 */
View.prototype.renderAdd = function (item) {
  var tmp = document.createElement('div');
  tmp.innerHTML = this.template.todo(item);
  this.$todos.appendChild(tmp.firstElementChild);

  var nextCount = parseInt(this.$count.innerHTML) + 1;
  this.$count.innerHTML = `${nextCount}개`;
};

/**
 * 삭제한 항목만 DOM에서 없애준다.
 *
 * @param {string | number} id
 */
View.prototype.renderRemove = function (id) {
  var item = this.$todos.querySelector(`.todo[data-id="${id}"]`);
  this.$todos.removeChild(item);

  var nextCount = parseInt(this.$count.innerHTML) - 1;
  this.$count.innerHTML = `${nextCount}개`;
};

/**
 * 항목에 input을 추가하여 수정을 시작한다.
 *
 * @param {string | number} id
 */
View.prototype.renderEditStart = function (id) {
  var item = this.$todos.querySelector(`.todo[data-id="${id}"]`);
  item.classList.add('editing');
  var title = item.querySelector('.title');
  title.outerHTML = this.template.editInput(title.innerHTML);
  var editButton = item.querySelector('.edit-btn');
  editButton.innerHTML = '완료';
  editButton.ariaLabel = '완료';

  var input = item.querySelector('.input-edit');
  input.focus();
  var cursorPos = input.value.length;
  input.setSelectionRange(cursorPos, cursorPos);
};

/**
 * 수정한 항목의 title만 변경한다.
 *
 * @param {object} param
 * @param {string | number} param.id
 * @param {string} param.title 새로 입력한 제목
 */
View.prototype.renderEdit = function ({ id, title }) {
  var item = this.$todos.querySelector(`.todo[data-id="${id}"]`);
  item.classList.remove('editing');

  var label = item.querySelector('.label-edit');
  var input = label.querySelector('.input-edit');
  var nextTitle = !title || title.trim() === '' ? input.defaultValue : title;
  label.outerHTML = this.template.title(nextTitle);

  var editButton = item.querySelector('.edit-btn');
  editButton.innerHTML = '수정';
  editButton.ariaLabel = '수정';
};
