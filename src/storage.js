/**
 * 로컬 스토리지를 관리하는 클래스
 *
 * @param {string} key 로컬 스토리지에 있는 데이터의 Key
 */
export default class Store {
  constructor(key) {
    this.key = key;

    this.init();
  }

  /**
   * 최초 생성 시 로컬 스토리지에 this.key에 해당하는 Value가 없으면 빈 배열로 초깃값을 설정한다.
   */
  init() {
    const value = this.get();
    if (!value) {
      this.set([]);
    }
  }

  /**
   * 로컬 스토리지에서 값을 가져온다.
   *
   * @returns {null | User[]}
   */
  get() {
    return JSON.parse(localStorage.getItem(this.key));
  }

  /**
   * 로컬 스토리지에 값을 설정한다.
   *
   * @param {User[]} value value는 JSON 형태로 변환된다.
   */
  set(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }
}
