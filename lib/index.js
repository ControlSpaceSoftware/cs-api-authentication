'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getUsernameFromEmail = getUsernameFromEmail;
exports.forgotPassword = forgotPassword;
exports.forgotPasswordConfirm = forgotPasswordConfirm;
exports.signUp = signUp;
exports.signUpConfirm = signUpConfirm;
exports.signUpConfirmResend = signUpConfirmResend;
function getUsernameFromEmail(email) {
	return email && email.replace(/@/, '+');
}

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

/**
 *
 * @param provider must implement confirmForgotPassword(params, function(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {confirmForgotPassword}
 */
function forgotPasswordConfirm(_ref3) {
	var provider = _ref3.provider,
	    clientId = _ref3.clientId,
	    _ref3$getUsernameFrom = _ref3.getUsernameFromEmail,
	    getUsernameFromEmail = _ref3$getUsernameFrom === undefined ? getUsernameFromEmail : _ref3$getUsernameFrom;


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

/**
 *
 * @param provider must implement signUp(params, function(err, data))
 * @param clientId
 * @param shortId
 * @param getUsernameFromEmail
 * @returns {signUp}
 */
function signUp(_ref5) {
	var provider = _ref5.provider,
	    clientId = _ref5.clientId,
	    shortId = _ref5.shortId,
	    _ref5$getUsernameFrom = _ref5.getUsernameFromEmail,
	    getUsernameFromEmail = _ref5$getUsernameFrom === undefined ? getUsernameFromEmail : _ref5$getUsernameFrom;


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

/**
 *
 * @param provider must implement adminGetUser(params, function (err, data)) and confirmSignUp(params, function (err, data))
 * @param clientId
 * @param userPoolId
 * @param getUsernameFromEmail
 * @returns {confirmSignUp}
 */
function signUpConfirm(_ref7) {
	var provider = _ref7.provider,
	    clientId = _ref7.clientId,
	    userPoolId = _ref7.userPoolId,
	    _ref7$getUsernameFrom = _ref7.getUsernameFromEmail,
	    getUsernameFromEmail = _ref7$getUsernameFrom === undefined ? getUsernameFromEmail : _ref7$getUsernameFrom;


	return function confirmSignUp(_ref8) {
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