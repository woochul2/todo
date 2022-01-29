import Store from './store.js';

/**
 * @constructor
 * @param {Store} storage
 */
export default function Model(storage) {
  this.storage = storage;
}

/**
 * 스토리지에서 원하는 값을 읽어들인다.
 *
 * @param {function} callback 값을 읽어들인 후 실행할 콜백 함수
 */
Model.prototype.read = function (callback) {
  var data = this.storage.get();
  callback(data);
};

/**
 * 스토리지에 항목을 추가한다.
 *
 * @param {string} title
 * @param {function} callback 항목 추가 후 실행할 콜백 함수
 */
Model.prototype.create = function (title, callback) {
  var item = { id: Date.now(), title, completed: false };
  var data = this.storage.get();
  var nextData = [...data, item];
  this.storage.set(nextData);

  callback(item);
};

/**
 * 스토리지의 항목 하나를 삭제한다.
 *
 * @param {string | number} id
 * @param {function} callback 항목 삭제 후 실행할 콜백 함수
 */
Model.prototype.delete = function (id, callback) {
  var data = this.storage.get();

  function filterCallback(el) {
    return el.id != id;
  }

  var nextData = data.filter(filterCallback);
  this.storage.set(nextData);

  callback(id);
};

/**
 * 스토리지의 항목 하나를 수정한다.
 *
 * @param {string | number} id
 * @param {string} title
 * @param {function} callback 항목 수정 후 실행할 콜백 함수
 */
Model.prototype.update = function (id, title, callback) {
  var data = this.storage.get();

  function findCallback(el) {
    return el.id == id;
  }

  var item = data.find(findCallback);
  item.title = title;
  this.storage.set(data);

  callback(id, title);
};

/** 스토리지의 모든 항목을 수정한다. */
Model.prototype.updateAll = function () {};

/** 스토리지에서 특정 조건을 만족하는 모든 항목을 삭제한다. */
Model.prototype.removeAll = function () {};
