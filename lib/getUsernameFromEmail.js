'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = getUsernameFromEmail = function getUsernameFromEmail(email) {
  return email && email.replace(/@/, '+');
};