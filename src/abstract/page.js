/**
 * @abstract
 */
export default class Page {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    this.root = root;

    this.setRoot();
  }

  /**
   * 최초 생성 시 root 엘리먼트의 내용을 초기화한다.
   *
   * @abstract
   */
  setRoot(html) {
    this.root.innerHTML = html;
  }

  /**
   * 페이지가 바뀔 때 글로벌 이벤트 리스너를 제거하는 메소드
   */
  removeEventListener() {
    if (!this.view) return;

    this.view.removeEventListener();
  }
}
