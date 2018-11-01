/**
 * File to collect data for the build process.
 *
 * See Application Data docs and lib/build-data.js and lib/gulp-html.js
 */

// Dependencies
const _ = require('lodash');
const { feature: topojsonFeature } = require('topojson');

// Build data configuration
function buildDataOptions() {
  // These have to manually maintained
  let civixEndPoints = [
    'contests/by-office/usa-mn-governor',
    'contests/by-office/usa-mn-attorney-general',
    'trends/by-body/usa-congress-senate',
    'trends/by-body/usa-congress-house',
    'contests/by-body/usa-congress-senate',
    'contests/by-body/usa-congress-house',
    'contests/by-office/usa-mn-auditor',
    'contests/by-office/usa-mn-secretary-state',
    'contests/by-body/usa-mn-supreme-court',
    'contests/by-body/usa-mn-appeals-court',
    'contests/by-body/usa-mn-district-court',
    'contests/by-office/usa-mn-state-upper-2713',
    'contests/by-office/usa-mn-state-lower-2704b',
    'contests/by-office/usa-mn-state-lower-2719a',
    'contests/by-office/usa-mn-state-lower-2737a',
    'contests/by-office/usa-mn-state-lower-2744a',
    'contests/by-office/usa-mn-state-lower-2749b',
    'contests/by-office/usa-mn-state-lower-2752b',
    'contests/by-office/usa-mn-state-lower-2757a',
    'trends/by-body/usa-mn-state-upper',
    'trends/by-body/usa-mn-state-lower',
    'contests/by-body/usa-mn-state-lower',
    'contests/by-office/usa-county-27053-sheriff',
    'contests/by-office/usa-county-27053-attorney',
    'contests/by-office/usa-mn-county-commissioner-27053-04',
    'contests/contests/20181106-usa-mn-local-2743000-city-question-1-1131'
  ];
  civixEndPoints = _.map(civixEndPoints, e => {
    return {
      id: _.camelCase(`civix/${e}`),
      url: `http://static.startribune.com/elections/civix/v2/2018-11-06/${e}.json`
    };
  });

  civixEndPoints = _.mapValues(_.keyBy(civixEndPoints, 'id'), e => {
    return {
      source: e.url,
      type: 'json',
      ttl: 1000 * 60 * 60 * 8
    };
  });

  return _.extend(
    {
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
      },
      mnCounties: {
        source: './assets/data/mncounties.json'
      }
    },
    civixEndPoints
  );
}

// Buidl store data from the build data.  This is here more for
// convience then necesseity
function buildStoreOptions(buildData) {
  let store = {
    supplement: buildData.supplement,
    browser: !(typeof window === 'undefined'),
    server: !!(typeof window === 'undefined')
  };

  // Get civix
  _.each(buildData, (d, di) => {
    if (di.match(/civix/)) {
      store[di] = d;
    }
  });

  // Make parts fo counties
  if (buildData.mnCounties) {
    (store.mnStateGeo = topojsonFeature(
      buildData.mnCounties,
      buildData.mnCounties.objects.state
    ).features),
    (store.mnCountiesGeo = topojsonFeature(
      buildData.mnCounties,
      buildData.mnCounties.objects.counties
    ).features),
    (store.mnCitiesGeo = topojsonFeature(
      buildData.mnCounties,
      buildData.mnCounties.objects.cities
    ).features),
    (store.mnRoadsGeo = topojsonFeature(
      buildData.mnCounties,
      buildData.mnCounties.objects.roads
    ).features);
  }

  console.log(_.keys(store));
  return store;
}

// Export
module.exports = {
  buildDataOptions,
  buildStoreOptions
};
