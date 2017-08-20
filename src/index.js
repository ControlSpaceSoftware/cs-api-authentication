
export function getUsernameFromEmail (email) {
	return email && email.replace(/@/, '+');
}

/**
 *
 * @param provider must implement forgotPassword(params, callback(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {forgotPassword}
 */
export function forgotPassword({provider, clientId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function forgotPassword({email}) {

		return new Promise((resolve, reject) => {

			console.log(JSON.stringify({email}, null, 4));

			const messages = [];

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'});
			}

			console.log(JSON.stringify({messages}, null, 4));
			if (messages.length) {
				return reject(messages);
			}

			const username = getUsernameFromEmail(email);
			console.log(JSON.stringify({username}, null, 4));

			const params = {
				ClientId: clientId, /* required */
				Username: username, /* required */
				// SecretHash: 'STRING_VALUE'
			};
			console.log(JSON.stringify({params}, null, 4));

			provider.forgotPassword(params, function(err, data) {
				if (err) {
					console.log(JSON.stringify({err}, null, 4));
					reject(err);
				} else {
					console.log(JSON.stringify({data}, null, 4));
					resolve(data);
				}
			});

		});

	}

}

/**
 *
 * @param provider must implement confirmForgotPassword(params, function(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {confirmForgotPassword}
 */
export function forgotPasswordConfirm({provider, clientId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function confirmForgotPassword({email, code, password}) {

		return new Promise((resolve, reject) => {

			const messages = [];

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'});
			}

			if (!(code && typeof code === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', field: 'code', message: 'Your confirmation code is required.'});
			}

			if (!(password && typeof password === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', message: 'Your account password is required.'});
			}

			if (messages.length) {
				return reject(messages);
			}

			const username = getUsernameFromEmail(email);

			const params = {
				ClientId: clientId, /* required */
				Username: username, /* required */
				ConfirmationCode: code, /* required */
				Password: password, /* required */
				// SecretHash: 'STRING_VALUE'
			};

			provider.confirmForgotPassword(params, function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});

		});

	}

}


/**
 *
 * @param provider must implement signUp(params, function(err, data))
 * @param clientId
 * @param shortId
 * @param getUsernameFromEmail
 * @returns {signUp}
 */
export function signUp({provider, clientId, shortId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function signUp({name, email, phone, password}) {

		return new Promise((resolve, reject) => {

			const messages = [];

			if (!(name && typeof name === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', message: 'Your email address is required.'});
			}

			if (!((email && typeof email === 'string') || (phone && typeof phone === 'string'))) {
				messages.push({code: 'MissingRequiredUserInput', message: 'Your account email address is required.'});
			}

			if (!(password && typeof password === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', message: 'Your account password is required.'});
			}

			if (messages.length) {
				return reject(messages);
			}

			const id = `cs${shortId.generate()}`;

			const attributeList = [];

			attributeList.push({
				Name : 'custom:id',
				Value : id
			});

			attributeList.push({
				Name : 'email',
				Value : email
			});

			if (name) {
				attributeList.push({
					Name : 'name',
					Value : name
				});
			}

			if (phone) {
				attributeList.push({
					Name : 'phone_number',
					Value : phone
				});
			}

			const username = getUsernameFromEmail(email);

			// todo learn how to use the secrete hash string

			const params = {
				ClientId: clientId, /* required */
				Username: username, /* required */
				Password: password, /* required */
				//SecretHash: 'STRING_VALUE',
				UserAttributes: attributeList,
				ValidationData: []
			};

			provider.signUp(params, function(err, data) {
				if (err) {
					reject(err);
				} else {
					const result = {};
					Object.assign(result, data, {id: id});
					resolve(result);
				}
			});

		});

	}

}


/**
 *
 * @param provider must implement adminGetUser(params, function (err, data)) and confirmSignUp(params, function (err, data))
 * @param clientId
 * @param userPoolId
 * @param getUsernameFromEmail
 * @returns {confirmSignUp}
 */
export function signUpConfirm({provider, clientId, userPoolId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function confirmSignUp({id, email, code}) {

		return new Promise((resolve, reject) => {

			const messages = [];

			// application errors
			if (!(id && typeof id === 'string')) {
				return reject({code: 'InvalidRequest', field: 'id', message: 'Missing account id.'});
			}

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'});
			}

			if (!(code && typeof code === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', field: 'code', message: 'Your confirmation code is required.'});
			}

			if (messages.length) {
				return reject(messages);
			}

			const username = getUsernameFromEmail(email);

			const confirmParams = {
				ClientId: clientId, /* required */
				ConfirmationCode: code, /* required */
				Username: username /* required */
				//ForceAliasCreation: true || false,
				//SecretHash: 'STRING_VALUE'
			};

			const userParams = {
				UserPoolId: userPoolId, /* required */
				Username: username /* required */
			};

			try {

				provider.adminGetUser(userParams, function(err, data) {

					if (err) {
						return reject(err);
					}

					const userId = data.UserAttributes.reduce((result, attr) => {

						if (result) {
							return result;
						}

						if (attr.Name === 'custom:id') {
							return attr.Value;
						}

					}, '');

					if (userId !== id) {
						return reject({code: 'InvalidRequest', message: 'Account id does not match given user.'});
					}

					provider.confirmSignUp(confirmParams, function(err, data) {

						if (err) {
							reject(err);
						} else {
							const result = {};
							Object.assign(result, data, {id: id});
							resolve(result);
						}

					});

				});

			} catch (error) {
				reject(error);
			}
		});

	}

}

/**
 *
 * @param provider must implement resendConfirmationCode(params, function (err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {forgotPassword}
 */
export function signUpConfirmResend({provider, clientId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function forgotPassword({email}) {

		return new Promise((resolve, reject) => {

			const messages = [];

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'});
			}

			if (messages.length) {
				return reject(messages);
			}

			const username = getUsernameFromEmail(email);

			const params = {
				ClientId: clientId, /* required */
				Username: username, /* required */
				// SecretHash: 'STRING_VALUE'
			};

			provider.resendConfirmationCode(params, function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});

		});

	}

}
