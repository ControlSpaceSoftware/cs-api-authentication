'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = signUpConfirm;

var _getUsernameFromEmail = require('./getUsernameFromEmail');

var _getUsernameFromEmail2 = _interopRequireDefault(_getUsernameFromEmail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param provider must implement adminGetUser(params, function (err, data)) and confirmSignUp(params, function (err, data))
 * @param clientId
 * @param userPoolId
 * @param getUsernameFromEmail
 * @returns {confirmSignUp}
 */
function signUpConfirm(_ref) {
	var provider = _ref.provider,
	    clientId = _ref.clientId,
	    userPoolId = _ref.userPoolId,
	    _ref$getUsernameFromE = _ref.getUsernameFromEmail,
	    getUsernameFromEmail = _ref$getUsernameFromE === undefined ? getUsernameFromEmail : _ref$getUsernameFromE;


	return function confirmSignUp(_ref2) {
		var id = _ref2.id,
		    email = _ref2.email,
		    code = _ref2.code;


		return new Promise(function (resolve, reject) {

			var messages = [];

			// application errors
			if (!(id && typeof id === 'string')) {
				return reject({ code: 'InvalidRequest', field: 'id', message: 'Missing account id.' });
			}

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.' });
			}

			if (!(code && typeof code === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', field: 'code', message: 'Your confirmation code is required.' });
			}

			if (messages.length) {
				return reject(messages);
			}

			var username = getUsernameFromEmail(email);

			var confirmParams = {
				ClientId: clientId, /* required */
				ConfirmationCode: code, /* required */
				Username: username /* required */
				//ForceAliasCreation: true || false,
				//SecretHash: 'STRING_VALUE'
			};

			var userParams = {
				UserPoolId: userPoolId, /* required */
				Username: username /* required */
			};

			try {

				provider.adminGetUser(userParams, function (err, data) {

					if (err) {
						return reject(err);
					}

					var userId = data.UserAttributes.reduce(function (result, attr) {

						if (result) {
							return result;
						}

						if (attr.Name === 'custom:id') {
							return attr.Value;
						}
					}, '');

					if (userId !== id) {
						return reject({ code: 'InvalidRequest', message: 'Account id does not match given user.' });
					}

					provider.confirmSignUp(confirmParams, function (err, data) {

						if (err) {
							reject(err);
						} else {
							var result = {};
							Object.assign(result, data, { id: id });
							resolve(result);
						}
					});
				});
			} catch (error) {
				reject(error);
			}
		});
	};
}