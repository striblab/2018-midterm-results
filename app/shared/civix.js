/**
 * Class to access civix data
 * https://github.com/striblab/civix/
 */

// Main civix class
class Civix {
  constructor(resource, options = {}) {
    options.endpoint =
      options.endpoint || '//static.startribune.com/elections/civix-test/v2/';
    options.election = options.election || '2018-11-05';
    options.jitter =
      options.jitter === false || options.jitter === true
        ? options.jitter
        : true;
    options.polling = 30 + (options.jitter ? Math.random() * 5 : 0);
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
    return window
      .fetch(
        `${this.options.endpoint}/${this.options.election}/${this.resource}`
      )
      .then(response => {
        return response.json();
      })
      .then(parsed => {
        this.trigger('update', parsed);
      })
      .catch(e => {
        console.error(e);
        this.trigger('error', e);
      });
  }
}

module.exports = Civix;
