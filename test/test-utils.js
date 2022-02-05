export const createViewStub = () => {
  const eventRegistry = {};

  return {
    render: jasmine.createSpy('render'),
    watch: (event, handler) => {
      eventRegistry[event] = handler;
    },
    trigger: (event, ...rest) => {
      eventRegistry[event](...rest);
    },
  };
};

export const createStorageStub = (fakeDB, callback) => {
  const storage = jasmine.createSpyObj('storage', ['get', 'set']);

  storage.get.and.callFake(() => fakeDB);

  storage.set.and.callFake((value) => {
    callback(value);
  });

  return storage;
};

export const setUpMethod = (obj, name) => {
  spyOn(obj, name);
  obj[name].and.callThrough();
};
