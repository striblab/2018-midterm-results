/**
 * Class to access civix data
 * https://github.com/striblab/civix/
 */

// Dependencies
let appConfig = require('./config.js');

// Main civix class
class Civix {
  constructor(resource, options = {}) {
    // The default is helpful to change as a state
    options.environment = options.environment || appConfig.environment;
    // If on startribune.com, always use prod
    if (
      window &&
      window.location &&
      window.location.hostname &&
      window.location.hostname.match(/startribune.com/i)
    ) {
      options.environment = 'prod';
    }
    // Allow to manuall switch with query
    if (
      window &&
      window.location &&
      window.location.search &&
      window.location.search.match(/civix=prod/i)
    ) {
      options.environment = 'prod';
    }

    options.endpoint =
      options.endpoint ||
      `//static.startribune.com/elections/${
        options.environment === 'test' ? 'civix-test' : 'civix'
      }/v2/`;
    options.election = options.election || '2018-11-06';
    options.jitter =
      options.jitter === false || options.jitter === true
        ? options.jitter
        : true;
    options.polling =
      options.polling || 30 + (options.jitter ? Math.random() * 5 : 0);
    options.autostart =
      options.autostart === false || options.autostart === true
        ? options.autostart
        : false;
    this.options = options;
    this.resource = resource;

    if (!this.resource) {
      throw new Error('Resource not provided to Civix api class.');
    }

    // Make sure we know what the formatting of the URl is
    this.options.endpoint = this.options.endpoint.replace(/\/+$/, '');
    this.resource = `${this.resource
      .replace(/^\/+/, '')
      .replace(/.json$/i, '')}.json`;

    // Initialize events
    this.events = {};

    // Allow to not automatically start
    if (this.options.autostart) {
      return this.poll();
    }

    return this;
  }

  // On
  on(event, action) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(action);
    return this;
  }

  // Trigger
  trigger(event, ...args) {
    if (this.events[event] && this.events[event].length) {
      this.events[event].forEach(action => {
        action(...args.concat(this));
      });
    }
  }

  // Poll
  poll() {
    this.fetch();

    // Don't make another interval
    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        this.fetch();
      }, this.options.polling * 1000);
    }

    return this;
  }

  // Stop
  cancel() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    return this;
  }

  // Do api fetch
  fetch() {
    let cacher = Math.round(Date.now() / 1000 / 30) * 30;

    // Don't do anything if client results off
    if (!appConfig.clientResults) {
      return new Promise(resolve => resolve());
    }

    return window
      .fetch(
        `${this.options.endpoint}/${this.options.election}/${
          this.resource
        }?_t=${cacher}`
      )
      .then(response => {
        return response.json();
      })
      .then(parsed => {
        this.trigger('update', parsed);
        return parsed;
      })
      .catch(e => {
        console.error(e);
        this.trigger('error', e);
      });
  }
}

module.exports = Civix;
