import Store from '../../storage.js';

/**
 * @constructor
 * @param {Store} storage
 */
export default function HomeModel(storage) {
  this.storage = storage;
}

/**
 * 스토리지에서 전체 유저를 읽어들인다.
 *
 * @param {function} callback 전체 유저를 읽어들인 후 실행할 콜백 함수
 */
HomeModel.prototype.read = function (callback) {
  var users = this.storage.get();
  callback(users);
};

/**
 * 스토리지에 유저를 한 명 추가한다.
 *
 * @param {string} username
 * @param {function} callback 유저 추가 후 실행할 콜백 함수
 */
HomeModel.prototype.create = function (username, callback) {
  var user = { id: Date.now(), name: username, items: [] };
  var users = this.storage.get();
  this.storage.set([...users, user]);

  callback(user);
};

/**
 * 스토리지의 유저를 한 명 삭제한다.
 *
 * @param {number} userId
 * @param {function} callback 유저 삭제 후 실행할 콜백 함수
 */
HomeModel.prototype.delete = function (userId, callback) {
  var users = this.storage.get();

  function filterCallback(user) {
    return user.id !== userId;
  }

  var nextUser = users.filter(filterCallback);
  this.storage.set(nextUser);

  callback(userId);
};

/**
 * 스토리지의 유저 한 명의 이름을 수정한다.
 *
 * @param {number} userId
 * @param {string} username
 * @param {function} callback 유저 이름 수정 후 실행할 콜백 함수
 */
HomeModel.prototype.update = function (userId, username, callback) {
  var users = this.storage.get();

  function findCallback(user) {
    return user.id === userId;
  }

  var user = users.find(findCallback);
  user.name = username;
  this.storage.set(users);

  callback(userId, username);
};
