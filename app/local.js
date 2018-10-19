/**
 * Main JS file for project.
 */

// Define globals that are added through the js.globals in
// the config.json file, here, mostly so linting won't get triggered
// and its a good queue of what is available:
// /* global _ */

// Dependencies
import utils from './shared/utils.js';
import Civix from './shared/civix.js';
import Content from '../templates/_local-content.svelte.html';

// Mark page with note about development or staging
utils.environmentNoting();

// Svelte template hook-up
const app = new Content({
  target: document.querySelector('.article-lcd-body-content'),
  data: {}
});
