/**
 * Main JS file for project.
 */

// Define globals that are added through the js.globals in
// the config.json file, here, mostly so linting won't get triggered
// and its a good queue of what is available:
/* global $ */

// Dependencies
import utils from './shared/utils.js';
import Content from '../templates/_state-mn-content.svelte.html';
import store from './shared/store.js';
import initializeData from './shared/initialize.js';

// Mark page with note about development or staging
utils.environmentNoting();

// Initialize data
initializeData([
  'contests/by-office/usa-mn-governor',
  'contests/by-office/usa-mn-attorney-general',
  'contests/by-office/usa-mn-auditor',
  'contests/by-office/usa-mn-secretary-state',
  'contests/by-body/usa-mn-supreme-court',
  'contests/by-body/usa-mn-appeals-court',
  'contests/by-body/usa-mn-district-court'
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
