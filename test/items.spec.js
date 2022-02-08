import Controller from '../src/pages/items/items-controller.js';
import Model from '../src/pages/items/items-model.js';
import {
  createStorageStub,
  createViewStub,
  setUpMethod,
} from './test-utils.js';

describe('Items controller', () => {
  // eslint-disable-next-line one-var, one-var-declaration-per-line
  let initialItem, fakeDB, storage, model, view, controller;

  beforeEach(() => {
    initialItem = { id: 123, title: '첫 번째 항목', completed: false };
    fakeDB = [{ id: 1, name: '이름', items: [{ ...initialItem }] }];

    storage = createStorageStub(fakeDB, (value) => {
      fakeDB = value;
    });
    model = new Model(storage, fakeDB[0].id);
    view = createViewStub();
    controller = new Controller(model, view);
  });

  it('setView()', () => {
    setUpMethod(model, 'read');

    controller.setView();

    expect(model.read).toHaveBeenCalledWith(jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('all', {
      username: fakeDB[0].name,
      items: [initialItem],
    });
  });

  it('new item', () => {
    setUpMethod(model, 'create');

    const title = '새로운 항목';
    const item = { id: jasmine.any(Number), title, completed: false };

    view.trigger('newItem', title);

    expect(model.create).toHaveBeenCalledWith(title, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('add', item);
    expect(fakeDB[0].items).toEqual([initialItem, item]);
  });

  it('remove', () => {
    setUpMethod(model, 'delete');

    const { id } = initialItem;

    view.trigger('remove', id);

    expect(model.delete).toHaveBeenCalledWith(id, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('remove', id);
    expect(fakeDB[0].items).toEqual([]);
  });

  it('start editing', () => {
    const { id } = initialItem;

    view.trigger('editStart', id);

    expect(view.render).toHaveBeenCalledWith('editStart', id);
  });

  it('edit', () => {
    setUpMethod(model, 'updateTitle');

    const itemId = initialItem.id;
    const title = '수정할 이름';

    view.trigger('edit', itemId, title);

    const modelParams = [itemId, title, jasmine.any(Function)];
    expect(model.updateTitle).toHaveBeenCalledWith(...modelParams);
    expect(view.render).toHaveBeenCalledWith('edit', { itemId, title });
    expect(fakeDB[0].items).toEqual([{ ...initialItem, title }]);
  });

  it('cancel editing', () => {
    const itemId = initialItem.id;
    const title = '';

    view.trigger('edit', itemId, title);

    expect(view.render).toHaveBeenCalledWith('edit', { itemId, title });
    expect(fakeDB[0].items).toEqual([initialItem]);
  });

  it('toggle', () => {
    setUpMethod(model, 'updateCompletion');

    const { id } = initialItem;

    view.trigger('toggle', id);

    const modelParams = [id, jasmine.any(Function)];
    expect(model.updateCompletion).toHaveBeenCalledWith(...modelParams);
    expect(view.render).toHaveBeenCalledWith('toggle', id);
  });
});
