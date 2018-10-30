/**
 * File to collect data for the build process.
 *
 * See Application Data docs and lib/build-data.js and lib/gulp-html.js
 */

// Dependencies
const _ = require('lodash');

// Build data configuration
function buildDataOptions() {
  return {
    // Supplement is some title and description updates and can
    // be embedded in the build for the client
    supplement: {
      source:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpUwASr5DqXVg-ehpvjPS47Q6F6pHhHzzDrcSg_n3WNs5MC1CVMd0a7OLPGBxGdt-vFoWHYETuVQrS/pub?gid=0&single=true&output=csv',
      type: 'csv',
      local: 'supplement.json',
      // Key by id
      postprocess: data => {
        return _.keyBy(data, 'id');
      }
    }
  };
}

// Buidl store data from the build data.  This is here more for
// convience then necesseity
function buildStoreOptions(buildData) {
  return {
    supplement: buildData.supplement
  };
}

// Export
module.exports = {
  buildDataOptions,
  buildStoreOptions
};
