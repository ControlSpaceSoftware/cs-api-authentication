'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = forgotPasswordConfirm;

var _getUsernameFromEmail = require('./getUsernameFromEmail');

var _getUsernameFromEmail2 = _interopRequireDefault(_getUsernameFromEmail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param provider must implement confirmForgotPassword(params, function(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {confirmForgotPassword}
 */
function forgotPasswordConfirm(_ref) {
	var provider = _ref.provider,
	    clientId = _ref.clientId,
	    _ref$getUsernameFromE = _ref.getUsernameFromEmail,
	    getUsernameFromEmail = _ref$getUsernameFromE === undefined ? getUsernameFromEmail : _ref$getUsernameFromE;


	return function confirmForgotPassword(_ref2) {
		var email = _ref2.email,
		    code = _ref2.code,
		    password = _ref2.password;


		return new Promise(function (resolve, reject) {

			var messages = [];

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.' });
			}

			if (!(code && typeof code === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', field: 'code', message: 'Your confirmation code is required.' });
			}

			if (!(password && typeof password === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', message: 'Your account password is required.' });
			}

			if (messages.length) {
				return reject(messages);
			}

			var username = getUsernameFromEmail(email);

			var params = {
				ClientId: clientId, /* required */
				Username: username, /* required */
				ConfirmationCode: code, /* required */
				Password: password /* required */
				// SecretHash: 'STRING_VALUE'
			};

			provider.confirmForgotPassword(params, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};
}