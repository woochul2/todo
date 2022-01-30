import HomeModel from './home-model.js';
import HomeView from './home-view.js';

/**
 * @constructor
 * @param {HomeModel} model
 * @param {HomeView} view
 */
export default function HomeController(model, view) {
  this.model = model;
  this.view = view;

  this.init();
}

/** 최초 생성 시 사용자 입력에 따라 어떤 함수를 실행할지 설정한다. */
HomeController.prototype.init = function () {
  this.view.watch('new-user', this.add.bind(this));
  this.view.watch('remove', this.remove.bind(this));
  this.view.watch('edit', this.edit.bind(this));
};

/** model의 데이터를 불러와 view를 초기화한다. */
HomeController.prototype.setView = function () {
  function callback(users) {
    this.view.render('all', users);
  }

  this.model.read(callback.bind(this));
};

/**
 * 유저를 추가한다.
 *
 * @param {string} username
 */
HomeController.prototype.add = function (username) {
  function callback(user) {
    this.view.render('add', user);
  }

  this.model.create(username, callback.bind(this));
};

/**
 * 유저 한 명을 삭제한다.
 *
 * @param {number} userId
 */
HomeController.prototype.remove = function (userId) {
  function callback(userId) {
    this.view.render('remove', userId);
  }

  this.model.delete(userId, callback.bind(this));
};

/**
 * 유저 한 명의 이름을 수정한다.
 *
 * @param {number} userId
 * @param {string | undefined} username
 */
HomeController.prototype.edit = function (userId, username) {
  function callback(userId, username) {
    this.view.render('edit', { userId, username });
  }

  this.model.update(userId, username, callback.bind(this));
};
