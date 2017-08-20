'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getUsernameFromEmail = function getUsernameFromEmail(email) {
  return email && email.replace(/@/, '+');
};

exports.default = getUsernameFromEmail;