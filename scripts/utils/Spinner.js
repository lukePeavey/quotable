/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const Ora = require('ora')
const isString = require('lodash/isString')
const isInteractive = require('is-interactive')

/**
 * CLI spinners that fall back gracefully on non TTY environments like as CI.
 */
class Spinner {
  get isSpinning() {
    return this.isEnabled && this.spinner.isSpinning
  }

  constructor(input = {}) {
    const options = isString(input) ? { text: input } : input
    this.isEnabled =
      typeof options.isEnabled === 'boolean'
        ? options.isEnabled
        : isInteractive({ stream: options.stream })
    this.spinner = this.isEnabled ? new Ora(this.options) : null
  }

  stop() {
    if (this.spinner && this.spinner.isSpinning) {
      this.spinner.stop()
    }
  }

  start(text) {
    if (this.spinner) {
      this.spinner.start(text)
    } else if (text) {
      console.log(text)
    }
  }

  succeed(text) {
    if (this.spinner) {
      this.spinner.succeed(text)
    } else if (text) {
      console.log(text)
    }
  }

  warn(text) {
    if (this.spinner) {
      this.spinner.warn(text)
    } else if (text) {
      console.log(text)
    }
  }

  fail(text) {
    if (this.spinner) {
      this.spinner.fail(text)
    } else {
      console.log(text || 'Failed!')
    }
  }
}

module.exports = Spinner
