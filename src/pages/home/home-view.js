import ViewParent from '../../abstract/view-parent.js';
import { KEY } from '../../constants.js';

export default class HomeView extends ViewParent {
  constructor() {
    super();

    this.$newUser = document.querySelector('.new-user');
    this.$newUserInput = document.querySelector('.new-user__input');
    this.$users = document.querySelector('.users');

    this.removeEventListener = this.init();
  }

  /**
   * 최초 생성 시 입력 창에 포커스를 옮기고, 포커스 이벤트 리스너를 등록한다.
   *
   * @returns {function} 이벤트 리스너를 삭제하는 함수
   */
  init() {
    this.$newUserInput.focus();

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
    super.focus(event, this.$newUserInput);
  }

  /**
   * 입력한 username에 따라 새로운 유저를 추가하는 이벤트 리스너를 등록한다.
   * username이 비어있으면 유저를 추가하지 않는다.
   *
   * @param {function} handler username을 받아 유저를 추가하는 함수
   */
  ['watch_new-user'](handler) {
    const keydownListener = (event) => {
      if (event.key !== KEY.ENTER) {
        return;
      }

      const username = event.target.value.trim();
      if (username === '') {
        return;
      }

      handler(username);
      event.target.value = '';
    };

    const clickListener = (event) => {
      const button = event.target.closest('.new-user__btn');
      if (!button) {
        return;
      }

      const input = this.$newUser.querySelector('.new-user__input');
      const username = input.value.trim();
      if (username === '') {
        return;
      }

      handler(username);
      input.value = '';
      input.focus();
    };

    this.$newUser.addEventListener('keydown', keydownListener);
    this.$newUser.addEventListener('click', clickListener);
  }

  /**
   * 유저 삭제 버튼을 누르면 그 유저를 삭제하는 이벤트 리스너를 등록한다.
   *
   * @param {function} handler id를 받아 유저 한 명을 삭제하는 함수
   */
  watch_remove(handler) {
    const listener = (event) => {
      const user = event.target.closest('.user');
      if (!user || !event.target.closest('.user__delete-btn')) {
        return;
      }

      handler(Number(user.dataset.id));
    };

    this.$users.addEventListener('click', listener);
  }

  /**
   * 유저 이름을 수정하는 이벤트 리스너를 등록한다.
   *
   * @param {function} handler id와 username을 받아 유저 이름을 수정하는 함수
   */
  watch_edit(handler) {
    const listener = (event) => {
      const user = event.target.closest('.user');
      if (!user || !event.target.closest('.user__edit-btn')) {
        return;
      }

      const value = window.prompt('수정할 사용자 이름을 입력하세요:');
      if (!value) {
        return;
      }

      const username = value.trim();
      if (!username) {
        return;
      }

      handler(Number(user.dataset.id), username);
    };

    this.$users.addEventListener('click', listener);
  }

  /**
   * 전체 화면을 새로 렌더링한다.
   *
   * @param {User[]} users
   */
  render_all(users) {
    const callback = (user) => this.template.user(user.id, user.name);

    this.$users.innerHTML = users.map(callback).join('');
  }

  /**
   * 추가한 유저만 렌더링한다.
   *
   * @param {User} user
   */
  render_add(user) {
    const tmp = document.createElement('div');
    tmp.innerHTML = this.template.user(user.id, user.name);
    this.$users.appendChild(tmp.firstElementChild);
  }

  /**
   * 삭제한 유저만 DOM에서 없애준다.
   *
   * @param {number} userId
   */
  render_remove(userId) {
    const user = this.$users.querySelector(`.user[data-id="${userId}"]`);
    user.remove();
  }

  /**
   * 수정한 유저의 이름만 변경한다.
   *
   * @param {object} param
   * @param {number} param.userId
   * @param {string} param.username 새로 수정한 유저 이름
   */
  render_edit({ userId, username }) {
    const user = this.$users.querySelector(`.user[data-id="${userId}"]`);
    const link = user.querySelector('.user__link');
    link.innerHTML = username;
  }

  get template() {
    return {
      /**
       * 해당 유저의 항목으로 이동하는 링크와 수정, 삭제 버튼을 포함한 템플릿
       *
       * @param {number} userId 유저 id는 링크에 포함된다.
       * @param {string} username 유저 이름을 화면에 출력한다.
       * @returns
       */
      user: (userId, username) => {
        return `
          <li data-id="${userId}" class="user">
            <a href="/${userId}/items" class="user__link" aria-label="${username} 사용자의 항목">${username}</a>
            <div class="user__btn-container">
              <button class="user__edit-btn" aria-label="${username} 사용자의 이름 수정">수정</button>
              <button class="user__delete-btn" aria-label="${username} 사용자 삭제">삭제</button>
            </div>
          </li>
        `;
      },
    };
  }
}
