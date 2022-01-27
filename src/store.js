/**
 * 로컬 스토리지를 관리하는 오브젝트
 *
 * @constructor
 * @param {string} key 로컬 스토리지의 Key
 */
export default function Store(key) {
  this.key = key;

  this.init();
}

/** 최초 생성 시 로컬 스토리지에 this.key에 해당하는 Value가 없으면 빈 초깃값을 설정한다. */
Store.prototype.init = function () {
  if (!this.get()) {
    localStorage.setItem(this.key, JSON.stringify([]));
  }
};

/** 로컬 스토리지에서 값을 가져온다. */
Store.prototype.get = function () {
  return JSON.parse(localStorage.getItem(this.key));
};

/** 로컬 스토리지의 값을 수정한다. */
Store.prototype.update = function () {};
