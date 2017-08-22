'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.forgotPassword = forgotPassword;
exports.forgotPasswordConfirm = forgotPasswordConfirm;
exports.signUp = signUp;
exports.signUpConfirm = signUpConfirm;
exports.signUpConfirmResend = signUpConfirmResend;
var getUsernameFromEmail = exports.getUsernameFromEmail = function getUsernameFromEmail(email) {
	return email && email.replace(/@/, '+');
};

/**
 *
 * @param provider must implement forgotPassword(params, callback(err, data))
 * @param clientId
 * @param username
 * @returns {forgotPassword}
 * @throws TypeError
 */
function forgotPassword(_ref) {
	var provider = _ref.provider,
	    clientId = _ref.clientId,
	    _ref$username = _ref.username,
	    username = _ref$username === undefined ? getUsernameFromEmail : _ref$username;


	if (!(provider && typeof provider.forgotPassword === 'function')) {
		throw new TypeError('provider missing forgotPassword(params, function(err,data)) function');
	}

	if (!(clientId && typeof clientId === 'string')) {
		throw new TypeError('missing clientId');
	}

	if (!(username && (typeof username === 'string' || typeof username === 'function'))) {
		throw new TypeError('missing username String or username(email) function');
	}

	// supports a String or a function
	var getUsername = typeof username === 'string' ? function () {
		return username;
	} : username;

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

			var username = getUsername(email);

			var params = {
				ClientId: clientId, /* required */
				Username: username /* required */
				// SecretHash: 'STRING_VALUE'
			};

			provider.forgotPassword(params, function (err, data) {
				if (err) {
					console.log(JSON.stringify({ err: err }, null, 4));
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};
}

/**
 *
 * @param provider must implement confirmForgotPassword(params, function(err, data))
 * @param clientId
 * @param username
 * @returns {confirmForgotPassword}
 */
function forgotPasswordConfirm(_ref3) {
	var provider = _ref3.provider,
	    clientId = _ref3.clientId,
	    _ref3$username = _ref3.username,
	    username = _ref3$username === undefined ? getUsernameFromEmail : _ref3$username;


	if (!(provider && typeof provider.confirmForgotPassword === 'function')) {
		throw new TypeError('missing provider.confirmForgotPassword(params, function(err, data)) function');
	}

	if (!(clientId && typeof clientId === 'string')) {
		throw new TypeError('missing clientId');
	}

	if (!(username && (typeof username === 'string' || typeof username === 'function'))) {
		throw new TypeError('missing username String or username(email) function');
	}

	// supports a String or a function
	var getUsername = typeof username === 'string' ? function () {
		return username;
	} : username;

	return function confirmForgotPassword(_ref4) {
		var email = _ref4.email,
		    code = _ref4.code,
		    password = _ref4.password;


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

			var username = getUsername(email);

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

/**
 *
 * @param provider must implement signUp(params, function(err, data))
 * @param clientId
 * @param shortId
 * @param username
 * @returns {signUp}
 */
function signUp(_ref5) {
	var provider = _ref5.provider,
	    clientId = _ref5.clientId,
	    shortId = _ref5.shortId,
	    _ref5$username = _ref5.username,
	    username = _ref5$username === undefined ? getUsernameFromEmail : _ref5$username;


	if (!(provider && typeof provider.signUp === 'function')) {
		throw new TypeError('missing provider.signUp(params, function(err, data)) function');
	}

	if (!(clientId && typeof clientId === 'string')) {
		throw new TypeError('missing clientId');
	}

	if (!(shortId && typeof shortId.generate === 'function')) {
		throw new TypeError('missing shortId.generate() function. npm install shortid --save');
	}

	if (!(username && (typeof username === 'string' || typeof username === 'function'))) {
		throw new TypeError('missing username String or username(email) function');
	}

	// supports a String or a function
	var getUsername = typeof username === 'string' ? function () {
		return username;
	} : username;

	return function signUp(_ref6) {
		var name = _ref6.name,
		    email = _ref6.email,
		    phone = _ref6.phone,
		    password = _ref6.password;


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

			var username = getUsername(email);

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

/**
 *
 * @param provider must implement adminGetUser(params, function (err, data)) and confirmSignUp(params, function (err, data))
 * @param clientId
 * @param userPoolId
 * @param username
 * @returns {confirmSignUp}
 */
function signUpConfirm(_ref7) {
	var provider = _ref7.provider,
	    clientId = _ref7.clientId,
	    userPoolId = _ref7.userPoolId,
	    _ref7$username = _ref7.username,
	    username = _ref7$username === undefined ? getUsernameFromEmail : _ref7$username;


	if (!(provider && typeof provider.adminGetUser === 'function')) {
		throw new TypeError('missing provider.adminGetUser(params, function(err, data)) function');
	}

	if (!(provider && typeof provider.confirmSignUp === 'function')) {
		throw new TypeError('missing provider.confirmSignUp(params, function(err, data)) function');
	}

	if (!(clientId && typeof clientId === 'string')) {
		throw new TypeError('missing clientId');
	}

	if (!(userPoolId && typeof userPoolId === 'string')) {
		throw new TypeError('missing userPoolId');
	}

	if (!(username && (typeof username === 'string' || typeof username === 'function'))) {
		throw new TypeError('missing username String or username(email) function');
	}

	// supports a String or a function
	var getUsername = typeof username === 'string' ? function () {
		return username;
	} : username;

	return function signUpConfirm(_ref8) {
		var id = _ref8.id,
		    email = _ref8.email,
		    code = _ref8.code;


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

			var username = getUsername(email);

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

/**
 *
 * @param provider must implement resendConfirmationCode(params, function (err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {forgotPassword}
 */
function signUpConfirmResend(_ref9) {
	var provider = _ref9.provider,
	    clientId = _ref9.clientId,
	    _ref9$getUsernameFrom = _ref9.getUsernameFromEmail,
	    getUsernameFromEmail = _ref9$getUsernameFrom === undefined ? getUsernameFromEmail : _ref9$getUsernameFrom;


	return function forgotPassword(_ref10) {
		var email = _ref10.email;


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

			provider.resendConfirmationCode(params, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};
}