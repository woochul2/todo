export default class ItemsController {
  /**
   * @param {import('./items-model').default} model
   * @param {import('./items-view').default} view
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
    this.view.watch('newItem', this.add.bind(this));
    this.view.watch('remove', this.remove.bind(this));
    this.view.watch('editStart', this.editStart.bind(this));
    this.view.watch('edit', this.edit.bind(this));
    this.view.watch('toggle', this.toggle.bind(this));
  }

  /**
   * URL hash에 따라 View를 초기화한다.
   * 전체 항목, 작업 중인 항목, 완료한 항목 중 무엇을 출력할지 결정한다.
   *
   * @param {string} hash
   */
  setView(hash) {
    this.model.read((username, items) => {
      this.view.render('all', { username, items, hash });
    });
  }

  /**
   * 항목을 추가한다.
   *
   * @param {string} title
   */
  add(title) {
    this.model.create(title, (item) => {
      this.view.render('add', item);
    });
  }

  /**
   * 항목 하나를 삭제한다.
   *
   * @param {number} itemId
   */
  remove(itemId) {
    this.model.delete(itemId, (id) => {
      this.view.render('remove', id);
    });
  }

  /**
   * 항목 내용 수정을 시작할 수 있도록 상태를 변경한다.
   *
   * @param {number} itemId
   */
  editStart(itemId) {
    this.view.render('editStart', itemId);
  }

  /**
   * 항목의 내용을 수정한다.
   *
   * @param {number} itemId
   * @param {string | undefined} title
   */
  edit(itemId, title) {
    const callback = (id, name) => {
      this.view.render('edit', { itemId: id, title: name });
    };

    if (!title) callback(itemId, title);
    else this.model.updateTitle(itemId, title, callback);
  }

  /**
   * 항목의 완료 상태를 토글한다.
   *
   * @param {number} itemId
   */
  toggle(itemId) {
    this.model.updateCompletion(itemId, (id) => {
      this.view.render('toggle', id);
    });
  }
}
