import Controller from './controller.js';
import Model from './model.js';
import Store from './store.js';
import Template from './template.js';
import View from './view.js';

export default function app(name) {
  var storage = new Store(name);
  var model = new Model(storage);
  var template = new Template();
  var view = new View(template);
  var controller = new Controller(model, view);

  controller.setView();
}
