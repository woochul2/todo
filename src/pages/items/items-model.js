export default class ItemsModel {
  /**
   * @param {import('../../storage').default} storage
   * @param {number} userId
   */
  constructor(storage, userId) {
    this.storage = storage;
    this.userId = userId;
  }

  /**
   * this.userId에 해당하는 유저의 인덱스를 반환한다.
   *
   * @returns {number}
   */
  getUserIndex() {
    const users = this.storage.get();
    const index = users.findIndex((user) => user.id === this.userId);
    return index;
  }

  /**
   * this.userId에 해당하는 유저를 반환한다.
   *
   * @returns {User}
   */
  getUser() {
    const users = this.storage.get();
    const user = users.find(({ id }) => id === this.userId);
    return user;
  }

  /**
   * 스토리지에서 유저의 항목들을 읽어들인다.
   *
   * @param {function} callback 항목들을 읽어들인 후 실행할 콜백 함수
   */
  read(callback) {
    const user = this.getUser();

    callback(user.name, user.items);
  }

  /**
   * 스토리지에 유저의 항목을 하나 추가한다.
   *
   * @param {string} title
   * @param {function} callback 항목 추가 후 실행할 콜백 함수
   */
  create(title, callback) {
    const item = { id: Date.now(), title, completed: false };
    const users = this.storage.get();
    const index = this.getUserIndex();
    const user = users[index];
    user.items = [...user.items, item];
    this.storage.set(users);

    callback(item);
  }

  /**
   * 스토리지의 유저의 항목 하나를 삭제한다.
   *
   * @param {number} itemId
   * @param {function} callback 항목 삭제 후 실행할 콜백 함수
   */
  delete(itemId, callback) {
    const users = this.storage.get();
    const userIndex = this.getUserIndex();
    const user = users[userIndex];
    const itemIndex = user.items.findIndex((item) => item.id === itemId);
    user.items.splice(itemIndex, 1);
    this.storage.set(users);

    callback(itemId);
  }

  /**
   * 스토리지의 유저의 항목 제목을 수정한다.
   *
   * @param {number} itemId
   * @param {string} title
   * @param {function} callback 항목 제목 수정 후 실행할 콜백 함수
   */
  updateTitle(itemId, title, callback) {
    const users = this.storage.get();
    const userIndex = this.getUserIndex();
    const user = users[userIndex];
    const item = user.items.find(({ id }) => id === itemId);
    item.title = title;
    this.storage.set(users);

    callback(itemId, title);
  }

  /**
   * 스토리지의 유저의 완료 상태를 수정한다.
   *
   * @param {number} itemId
   * @param {function} callback 항목 완료 상태 수정 후 실행할 콜백 함수
   */
  updateCompletion(itemId, callback) {
    const users = this.storage.get();
    const userIndex = this.getUserIndex();
    const user = users[userIndex];
    const item = user.items.find(({ id }) => id === itemId);
    item.completed = !item.completed;
    this.storage.set(users);

    callback(itemId);
  }
}
