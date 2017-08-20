
import getUsernameFromEmail from './getUsernameFromEmail';

/**
 *
 * @param provider must implement forgotPassword(params, callback(err, data))
 * @param clientId
 * @param getUsernameFromEmail
 * @returns {forgotPassword}
 */
function forgotPassword({provider, clientId, getUsernameFromEmail = getUsernameFromEmail}) {

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

			provider.forgotPassword(params, function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});

		});

	}

}

export default forgotPassword;
