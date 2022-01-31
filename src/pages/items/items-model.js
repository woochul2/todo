import Storage from '../../storage.js';

/**
 * @constructor
 * @param {number} userId
 */
export default function ItemsModel(userId) {
  this.userId = userId;

  this.init();
}

/** this.userId에 해당하는 유저가 없으면 홈으로 이동한다. */
ItemsModel.prototype.init = function () {
  var user = this.getUser();
  if (!user) {
    window.location.href = '/';
  }
};

/**
 * this.userId에 해당하는 유저의 인덱스를 반환한다.
 *
 * @returns {number}
 */
ItemsModel.prototype.getUserIndex = function () {
  var users = Storage.get();

  function callback(user) {
    return user.id === this.userId;
  }

  var index = users.findIndex(callback, this);
  return index;
};

/**
 * this.userId에 해당하는 유저를 반환한다.
 *
 * @returns {User}
 */
ItemsModel.prototype.getUser = function () {
  var users = Storage.get();

  function callback(user) {
    return user.id === this.userId;
  }

  var user = users.find(callback, this);
  return user;
};

/**
 * 스토리지에서 유저의 항목들을 읽어들인다.
 *
 * @param {function} callback 항목들을 읽어들인 후 실행할 콜백 함수
 */
ItemsModel.prototype.read = function (callback) {
  var user = this.getUser();
  callback(user.name, user.items);
};

/**
 * 스토리지에 유저의 항목을 하나 추가한다.
 *
 * @param {string} title
 * @param {function} callback 항목 추가 후 실행할 콜백 함수
 */
ItemsModel.prototype.create = function (title, callback) {
  var item = { id: Date.now(), title, completed: false };
  var users = Storage.get();
  var index = this.getUserIndex();
  var user = users[index];
  user.items = [...user.items, item];
  Storage.set(users);

  callback(item);
};

/**
 * 스토리지의 유저의 항목 하나를 삭제한다.
 *
 * @param {number} itemId
 * @param {function} callback 항목 삭제 후 실행할 콜백 함수
 */
ItemsModel.prototype.delete = function (itemId, callback) {
  var users = Storage.get();
  var userIndex = this.getUserIndex();
  var user = users[userIndex];

  function findIndexCallback(item) {
    return item.id === itemId;
  }

  var itemIndex = user.items.findIndex(findIndexCallback);
  user.items.splice(itemIndex, 1);
  Storage.set(users);

  callback(itemId);
};

/**
 * 스토리지의 유저의 항목 하나를 수정한다.
 *
 * @param {number} itemId
 * @param {string} title
 * @param {function} callback 항목 수정 후 실행할 콜백 함수
 */
ItemsModel.prototype.update = function (itemId, title, callback) {
  var users = Storage.get();
  var userIndex = this.getUserIndex();
  var user = users[userIndex];

  function findCallback(item) {
    return item.id === itemId;
  }

  var item = user.items.find(findCallback);
  item.title = title;
  Storage.set(users);

  callback(itemId, title);
};

/** 스토리지의 모든 항목을 수정한다. */
ItemsModel.prototype.updateAll = function () {};

/** 스토리지에서 특정 조건을 만족하는 모든 항목을 삭제한다. */
ItemsModel.prototype.removeAll = function () {};
