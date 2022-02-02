import Controller from '../src/pages/home/home-controller.js';
import Model from '../src/pages/home/home-model.js';
import { createStorageStub, createViewStub, setUpMethod } from './test-utils.js';

describe('Home controller', () => {
  var initialUser, fakeDB, storage, model, view, controller;

  beforeEach(() => {
    initialUser = { id: 1, name: '이름', items: [] };
    fakeDB = [Object.assign({}, initialUser)];

    storage = createStorageStub(fakeDB, (value) => {
      fakeDB = value;
    });
    model = new Model(storage);
    view = createViewStub();
    controller = new Controller(model, view);
  });

  it('setView()', () => {
    setUpMethod(model, 'read');

    controller.setView();

    expect(model.read).toHaveBeenCalledWith(jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('all', fakeDB);
  });

  it('new user', () => {
    setUpMethod(model, 'create');

    var username = '새로운 유저 이름';
    var user = { id: jasmine.any(Number), name: username, items: [] };

    view.trigger('new-user', username);

    expect(model.create).toHaveBeenCalledWith(username, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('add', user);
    expect(fakeDB).toEqual([initialUser, user]);
  });

  it('remove', () => {
    setUpMethod(model, 'delete');

    var { id } = initialUser;

    view.trigger('remove', id);

    expect(model.delete).toHaveBeenCalledWith(id, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('remove', id);
    expect(fakeDB).toEqual([]);
  });

  it('edit', () => {
    setUpMethod(model, 'update');

    var userId = initialUser.id;
    var username = '하이';

    view.trigger('edit', userId, username);

    expect(model.update).toHaveBeenCalledWith(userId, username, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('edit', { userId, username });
    expect(fakeDB).toEqual([{ ...initialUser, name: username }]);
  });
});
