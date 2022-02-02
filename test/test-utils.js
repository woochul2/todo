export function createViewStub() {
  var eventRegistry = {};

  return {
    render: jasmine.createSpy('render'),
    watch: function (event, handler) {
      eventRegistry[event] = handler;
    },
    trigger: function (event, ...rest) {
      eventRegistry[event](...rest);
    },
  };
}

export function createStorageStub(fakeDB, callback) {
  var storage = jasmine.createSpyObj('storage', ['get', 'set']);

  storage.get.and.callFake(function () {
    return fakeDB;
  });

  storage.set.and.callFake(function (value) {
    callback(value);
  });

  return storage;
}

export function setUpMethod(obj, name) {
  spyOn(obj, name);
  obj[name].and.callThrough();
}
