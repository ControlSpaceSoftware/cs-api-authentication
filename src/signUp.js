
import getUsernameFromEmail from './getUsernameFromEmail';

/**
 *
 * @param provider must implement signUp(params, function(err, data))
 * @param clientId
 * @param shortId
 * @param getUsernameFromEmail
 * @returns {signUp}
 */
export default function signUp({provider, clientId, shortId, getUsernameFromEmail = getUsernameFromEmail}) {

	return function signUp({name, email, phone, password}) {

		return new Promise((resolve, reject) => {

			const messages = [];

			if (!(name && typeof name === 'string')) {
				messages.push({code: 'InvalidRequest', message: 'Your email address is required.'});
			}

			if (!((email && typeof email === 'string') || (phone && typeof phone === 'string'))) {
				messages.push({code: 'InvalidRequest', message: 'Your account email address is required.'});
			}

			if (!(password && typeof password === 'string')) {
				messages.push({code: 'InvalidRequest', message: 'Your account password is required.'});
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
