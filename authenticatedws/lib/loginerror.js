'use strict';

class LoginError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = LoginError;