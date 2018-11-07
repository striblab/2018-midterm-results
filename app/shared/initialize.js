/**
 * We don't want to load the client components
 * until we have data, otherwise the DOM will
 * disappear.  This provides a method to get that
 */

// Dependencies
import Civix from './civix.js';
import { camelCase } from 'lodash';

// Main method
function initializeData(endpoints) {
  let data = {};
  let promises = [];

  for (let ei in endpoints) {
    let e = endpoints[ei];
    let c = new Civix(e, { autostart: false, cacheBuster: true });
    promises.push(
      c.fetch().then(d => {
        data[camelCase(`civix-${e}`)] = d;
      })
    );
  }

  return Promise.all(promises).then(() => {
    return data;
  });
}

// Export
export default initializeData;
