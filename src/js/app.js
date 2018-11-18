// js
import $ from 'jquery';
import Simulator from './simulator.js';
// css
import '../scss/style.scss';
// html
import '../html/layouts/default.hbs';
import '../html/pages/index.hbs';
import '../html/partials/parameter.hbs';
import '../html/partials/result.hbs';

let simulator = new Simulator();
simulator.init();
