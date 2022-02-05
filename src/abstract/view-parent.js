/**
 * @abstract
 */
export default class ViewParent {
  constructor() {}

  /**
   * 슬래시(/) 키를 누르면 입력 창에 포커스 되도록 한다.
   *
   * @abstract
   * @param {KeyboardEvent} event
   * @param {HTMLInputElement} input
   */
  focus(event, input) {
    if (event.key === '/') {
      event.preventDefault();

      input.focus();
    }
  }

  /**
   * 사용자 입력을 감지해 입력 별로 특정 함수를 실행한다.
   *
   * @param {string} name 사용자 입력 이름
   * @param {function} handler 사용자 입력에 따라 실행할 함수
   */
  watch(name, handler) {
    this[`watch_${name}`](handler);
  }

  /**
   * 명령어에 해당하는 DOM 엘리먼트를 업데이트한다.
   *
   * @param {string} command 명령어 이름
   * @param {*} parameter DOM 엘리먼트를 업데이트하는 데 필요한 변수
   */
  render(command, parameter) {
    this[`render_${command}`](parameter);
  }
}
