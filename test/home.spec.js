import Controller from '../src/pages/home/home-controller.js';
import Model from '../src/pages/home/home-model.js';
import {
  createStorageStub,
  createViewStub,
  setUpMethod,
} from './test-utils.js';

describe('Home controller', () => {
  // eslint-disable-next-line one-var, one-var-declaration-per-line
  let initialUser, fakeDB, storage, model, view, controller;

  beforeEach(() => {
    initialUser = { id: 1, name: '이름', items: [] };
    fakeDB = [{ ...initialUser }];

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

    const username = '새로운 유저 이름';
    const user = { id: jasmine.any(Number), name: username, items: [] };

    view.trigger('newUser', username);

    expect(model.create).toHaveBeenCalledWith(username, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('add', user);
    expect(fakeDB).toEqual([initialUser, user]);
  });

  it('remove', () => {
    setUpMethod(model, 'delete');

    const { id } = initialUser;

    view.trigger('remove', id);

    expect(model.delete).toHaveBeenCalledWith(id, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('remove', id);
    expect(fakeDB).toEqual([]);
  });

  it('edit', () => {
    setUpMethod(model, 'update');

    const userId = initialUser.id;
    const username = '하이';

    view.trigger('edit', userId, username);

    const modelParams = [userId, username, jasmine.any(Function)];
    expect(model.update).toHaveBeenCalledWith(...modelParams);
    expect(view.render).toHaveBeenCalledWith('edit', { userId, username });
    expect(fakeDB).toEqual([{ ...initialUser, name: username }]);
  });
});
