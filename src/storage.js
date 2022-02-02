/**
 * 로컬 스토리지를 관리하는 오브젝트
 *
 * @constructor
 * @param {string} key 로컬 스토리지에 있는 데이터의 Key
 */
export default function Store(key) {
  this.key = key;

  this.init();
}

/** 최초 생성 시 로컬 스토리지에 this.key에 해당하는 Value가 없으면 빈 배열로 초깃값을 설정한다. */
Store.prototype.init = function () {
  if (!this.get()) {
    this.set([]);
  }
};

/**
 * 로컬 스토리지에서 값을 가져온다.
 *
 * @returns {null | User[]}
 */
Store.prototype.get = function () {
  return JSON.parse(localStorage.getItem(this.key));
};

/**
 * 로컬 스토리지에 값을 설정한다.
 *
 * @param {User[]} value value는 JSON 형태로 변환된다.
 */
Store.prototype.set = function (value) {
  localStorage.setItem(this.key, JSON.stringify(value));
};
