'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = signUp;

var _getUsernameFromEmail = require('./getUsernameFromEmail');

var _getUsernameFromEmail2 = _interopRequireDefault(_getUsernameFromEmail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param provider must implement signUp(params, function(err, data))
 * @param clientId
 * @param shortId
 * @param getUsernameFromEmail
 * @returns {signUp}
 */
function signUp(_ref) {
	var provider = _ref.provider,
	    clientId = _ref.clientId,
	    shortId = _ref.shortId,
	    _ref$getUsernameFromE = _ref.getUsernameFromEmail,
	    getUsernameFromEmail = _ref$getUsernameFromE === undefined ? getUsernameFromEmail : _ref$getUsernameFromE;


	return function signUp(_ref2) {
		var name = _ref2.name,
		    email = _ref2.email,
		    phone = _ref2.phone,
		    password = _ref2.password;


		return new Promise(function (resolve, reject) {

			var messages = [];

			if (!(name && typeof name === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', message: 'Your email address is required.' });
			}

			if (!(email && typeof email === 'string' || phone && typeof phone === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', message: 'Your account email address is required.' });
			}

			if (!(password && typeof password === 'string')) {
				messages.push({ code: 'MissingRequiredUserInput', message: 'Your account password is required.' });
			}

			if (messages.length) {
				return reject(messages);
			}

			var id = 'cs' + shortId.generate();

			var attributeList = [];

			attributeList.push({
				Name: 'custom:id',
				Value: id
			});

			attributeList.push({
				Name: 'email',
				Value: email
			});

			if (name) {
				attributeList.push({
					Name: 'name',
					Value: name
				});
			}

			if (phone) {
				attributeList.push({
					Name: 'phone_number',
					Value: phone
				});
			}

			var username = getUsernameFromEmail(email);

			// todo learn how to use the secrete hash string

			var params = {
				ClientId: clientId, /* required */
				Username: username, /* required */
				Password: password, /* required */
				//SecretHash: 'STRING_VALUE',
				UserAttributes: attributeList,
				ValidationData: []
			};

			provider.signUp(params, function (err, data) {
				if (err) {
					reject(err);
				} else {
					var result = {};
					Object.assign(result, data, { id: id });
					resolve(result);
				}
			});
		});
	};
}