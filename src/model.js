import Store from './store.js';

/**
 * @constructor
 * @param {Store} storage
 */
export default function Model(storage) {
  this.storage = storage;
}

/** 스토리지에서 원하는 값을 읽어들인다. */
Model.prototype.read = function () {
  return this.storage.get();
};

/** 스토리지에 항목을 추가한다. */
Model.prototype.create = function () {};

/** 스토리지의 값 하나를 수정한다. */
Model.prototype.update = function () {};

/** 스토리지의 항목 하나를 삭제한다. */
Model.prototype.delete = function () {};

/** 스토리지의 모든 항목을 수정한다. */
Model.prototype.updateAll = function () {};

/** 스토리지에서 특정 조건을 만족하는 모든 항목을 삭제한다. */
Model.prototype.removeAll = function () {};
