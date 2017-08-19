
import getUsernameFromEmail from './getUsernameFromEmail';

/**
 *
 * @param provider must implement adminGetUser(params, function (err, data)) and confirmSignUp(params, function (err, data))
 * @param clientId
 * @param userPoolId
 * @param getUsernameFromEmail
 * @returns {confirmSignUp}
 */
export default function signUpConfirm({provider, clientId, userPoolId, getUsernameFromEmail = getUsernameFromEmail}) {

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
