/* eslint-disable no-console */

import Ora from 'ora'
import isString from 'lodash/isString'
import isInteractive from 'is-interactive'

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

export default Spinner
