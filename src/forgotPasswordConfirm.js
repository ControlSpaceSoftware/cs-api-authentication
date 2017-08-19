
import getUsernameFromEmail from './getUsernameFromEmail';

/**
 *
 * @param provider must implement confirmForgotPassword(params, function(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {confirmForgotPassword}
 */
export default function forgotPasswordConfirm({provider, clientId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function confirmForgotPassword({email, code, password}) {

		return new Promise((resolve, reject) => {

			const messages = [];

			// user input errors
			if (!(email && typeof email === 'string')) {
				messages.push({code: 'MissingRequiredAttribute', field: 'email', message: 'Your account email address is required.'});
			}

			if (!(code && typeof code === 'string')) {
				messages.push({code: 'MissingRequiredAttribute', field: 'code', message: 'Your confirmation code is required.'});
			}

			if (!(password && typeof password === 'string')) {
				messages.push({code: 'InvalidRequest', message: 'Your account password is required.'});
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
