import HomeTemplate from './home-template.js';

/**
 * @constructor
 * @param {HomeTemplate} template
 */
export default function HomeView(template) {
  this.template = template;

  this.$newUser = document.querySelector('.new-user');
  this.$users = document.querySelector('.users');
}

/**
 * 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다.
 *
 * @param {string} name 사용자 입력 이름
 * @param {function} handler 사용자 입력에 따라 실행할 함수
 */
HomeView.prototype.watch = function (name, handler) {
  if (name === 'new-user') {
    this.watchNewInput(handler);
  } else if (name === 'remove') {
    this.watchRemove(handler);
  } else if (name === 'edit') {
    this.watchEdit(handler);
  }
};

/**
 * 입력한 username에 따라 새로운 유저를 추가하는 이벤트 리스너를 등록한다.
 * username이 비어있으면 유저를 추가하지 않는다.
 *
 * @param {function} handler username을 받아 유저를 추가하는 함수
 */
HomeView.prototype.watchNewInput = function (handler) {
  function listener() {
    var value = window.prompt('추가할 사용자 이름을 입력하세요:');
    if (!value) {
      return;
    }

    var username = value.trim();
    if (username === '') {
      return;
    }

    handler(username);
  }

  this.$newUser.addEventListener('click', listener);
};

/**
 * 유저 삭제 버튼을 누르면 그 유저를 삭제하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id를 받아 유저 한 명을 삭제하는 함수
 */
HomeView.prototype.watchRemove = function (handler) {
  function listener(event) {
    var user = event.target.closest('.user');
    if (!user || !event.target.closest('.delete-btn')) {
      return;
    }

    handler(Number(user.dataset.id));
  }

  this.$users.addEventListener('click', listener);
};

/**
 * 유저 이름을 수정하는 이벤트 리스너를 등록한다.
 *
 * @param {function} handler id와 username을 받아 유저 이름을 수정하는 함수
 */
HomeView.prototype.watchEdit = function (handler) {
  function listener(event) {
    var user = event.target.closest('.user');
    if (!user || !event.target.closest('.edit-btn')) {
      return;
    }

    var value = window.prompt('수정할 사용자 이름을 입력하세요:');
    if (!value) {
      return;
    }

    var username = value.trim();
    if (!username) {
      return;
    }

    handler(Number(user.dataset.id), username);
  }
  this.$users.addEventListener('click', listener);
};

/**
 * 명령어에 해당하는 DOM 엘리먼트를 업데이트한다.
 *
 * @param {string} command 명령어 이름
 * @param {*} parameter DOM 엘리먼트를 업데이트하는 데 필요한 변수
 */
HomeView.prototype.render = function (command, parameter) {
  if (command === 'all') {
    this.renderAll(parameter);
  } else if (command === 'add') {
    this.renderAdd(parameter);
  } else if (command === 'remove') {
    this.renderRemove(parameter);
  } else if (command === 'edit') {
    this.renderEdit(parameter);
  }
};

/**
 * 전체 화면을 새로 렌더링한다.
 *
 * @param {User[]} users
 */
HomeView.prototype.renderAll = function (users) {
  function callback(user) {
    return this.template.user(user.id, user.name);
  }

  this.$users.innerHTML = users.map(callback, this).join('');
};

/**
 * 추가한 유저만 렌더링한다.
 *
 * @param {User} user
 */
HomeView.prototype.renderAdd = function (user) {
  var tmp = document.createElement('div');
  tmp.innerHTML = this.template.user(user.id, user.name);
  this.$users.appendChild(tmp.firstElementChild);
};

/**
 * 삭제한 유저만 DOM에서 없애준다.
 *
 * @param {number} userId
 */
HomeView.prototype.renderRemove = function (userId) {
  var user = this.$users.querySelector(`.user[data-id="${userId}"]`);
  this.$users.removeChild(user);
};

/**
 * 수정한 유저의 이름만 변경한다.
 *
 * @param {object} param
 * @param {number} param.userId
 * @param {string} param.username 새로 수정한 유저 이름
 */
HomeView.prototype.renderEdit = function ({ userId, username }) {
  var user = this.$users.querySelector(`.user[data-id="${userId}"]`);
  var link = user.querySelector('.link');
  link.innerHTML = username;
};
