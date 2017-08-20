'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = forgotPassword;

var _getUsernameFromEmail = require('./getUsernameFromEmail');

var _getUsernameFromEmail2 = _interopRequireDefault(_getUsernameFromEmail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param provider must implement forgotPassword(params, callback(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {forgotPassword}
 */
function forgotPassword(_ref) {
	var provider = _ref.provider,
	    clientId = _ref.clientId,
	    _ref$getUsernameFromE = _ref.getUsernameFromEmail,
	    getUsernameFromEmail = _ref$getUsernameFromE === undefined ? getUsernameFromEmail : _ref$getUsernameFromE;


	return function forgotPassword(_ref2) {
		var email = _ref2.email;


		return new Promise(function (resolve, reject) {

			var messages = [];

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.' });
			}

			if (messages.length) {
				return reject(messages);
			}

			var username = getUsernameFromEmail(email);

			var params = {
				ClientId: clientId, /* required */
				Username: username /* required */
				// SecretHash: 'STRING_VALUE'
			};

			provider.forgotPassword(params, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};
}