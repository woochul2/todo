export default class HomeController {
  /**
   * @param {import('./home-model').default} model
   * @param {import('./home-view').default} view
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  /**
   * 최초 생성 시 사용자 입력에 따라 어떤 함수를 실행할지 설정한다.
   */
  init() {
    this.view.watch('newUser', this.add.bind(this));
    this.view.watch('remove', this.remove.bind(this));
    this.view.watch('edit', this.edit.bind(this));
  }

  /**
   * model의 데이터를 불러와 view를 초기화한다.
   */
  setView() {
    this.model.read((users) => {
      this.view.render('all', users);
    });
  }

  /**
   * 유저를 추가한다.
   *
   * @param {string} username
   */
  add(username) {
    this.model.create(username, (user) => {
      this.view.render('add', user);
    });
  }

  /**
   * 유저 한 명을 삭제한다.
   *
   * @param {number} userId
   */
  remove(userId) {
    this.model.delete(userId, (id) => {
      this.view.render('remove', id);
    });
  }

  /**
   * 유저 한 명의 이름을 수정한다.
   *
   * @param {number} userId
   * @param {string | undefined} username
   */
  edit(userId, username) {
    this.model.update(userId, username, (id, name) => {
      this.view.render('edit', { userId: id, username: name });
    });
  }
}
