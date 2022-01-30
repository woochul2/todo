import HomeController from './home-controller.js';
import HomeModel from './home-model.js';
import HomeTemplate from './home-template.js';
import HomeView from './home-view.js';

/**
 * @constructor
 */
export default function Home() {
  this.model = new HomeModel();
  this.template = new HomeTemplate();
  this.view = new HomeView(this.template);
  this.controller = new HomeController(this.model, this.view);

  this.controller.setView();
}
