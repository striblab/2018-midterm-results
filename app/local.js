/**
 * Main JS file for project.
 */

// Define globals that are added through the js.globals in
// the config.json file, here, mostly so linting won't get triggered
// and its a good queue of what is available:
/* global $ */

// Dependencies
import utils from './shared/utils.js';
import Content from '../templates/_local-content.svelte.html';
import store from './shared/store.js';
import initializeData from './shared/initialize.js';
import appConfig from './shared/config.js';

// Mark page with note about development or staging
utils.environmentNoting();

// Main function
function main() {
  // Allow to turn off result loading
  if (!appConfig.clientResults) {
    console.error('Client results off');
    return;
  }

  // Initialize data
  initializeData([
    'contests/by-office/usa-county-27053-sheriff',
    'contests/by-office/usa-county-27053-attorney',
    'contests/by-office/usa-mn-county-commissioner-27053-04',
    'contests/contests/20181106-usa-mn-local-2743000-city-question-1-1131'
  ]).then(initData => {
    store.set(initData);

    // Hacky way to get the share parts to show up
    let $share = $('.share-placeholder').size()
      ? $('.share-placeholder')
        .children()
        .detach()
      : undefined;
    let attachShare = !$share
      ? undefined
      : () => {
        $('.share-placeholder').append($share);
      };

    // Svelte template hook-up
    const app = new Content({
      target: document.querySelector('.article-lcd-body-content'),
      data: {
        attachShare
      },
      store
    });
    window.__app = app;
  });
}

main();
