/*global describe, it, beforeEach*/

import chai from 'chai'
import sinonChai from 'sinon-chai'
import {signUpConfirm} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('signUpConfirm', () => {
	let provider, clientId, userPoolId, username, userInput;
	beforeEach(() => {
		userPoolId = 'test userPoolId';
		userInput = {id: 'test user id', email: 'test email', code: 'test confirmation code'};
		clientId = 'testClientId';
		username = (email) => email;
		provider = {
			adminGetUser(params, cb) {
				cb(null, {
					UserAttributes: [
						{Name: 'custom:id', Value: 'test user id'}
					]
				});
			},
			confirmSignUp(params, cb) {
				cb(null, params);
			}
		};
	});
	it('exits', () => {
		expect(signUpConfirm).to.be.a('function');
	});
	it('throws TypeError when provider is missing', () => {
		expect(signUpConfirm).to.throw(TypeError);
	});
	it('throws TypeError when provider.adminGetUser(...) is missing', () => {
		provider.adminGetUser = null;
		expect(signUpConfirm.bind(null, {provider})).to.throw(TypeError);
	});
	it('throws TypeError when provider.confirmSignUp(..) is missing', () => {
		provider.confirmSignUp = null;
		expect(signUpConfirm.bind(null, {provider})).to.throw(TypeError);
	});
	it('throws TypeError when clientId is missing', () => {
		expect(signUpConfirm.bind(null, {provider, clientId: null})).to.throw(TypeError);
	});
	it('throws TypeError when shortId is missing', () => {
		expect(signUpConfirm.bind(null, {provider, clientId, userPoolId: null})).to.throw(TypeError);
	});
	it('throws TypeError when username is missing', () => {
		expect(signUpConfirm.bind(null, {provider, clientId, userPoolId, username: null})).to.throw(TypeError);
	});
	it('returns function when required params give', () => {
		expect(signUpConfirm.bind(null, {provider, clientId, userPoolId, username})).to.not.throw();
	});
	it('calls provider.confirmSignUp(...) function', () => {
		let count = 0;
		provider.confirmSignUp = () => count++;
		const wrapper = signUpConfirm({provider, clientId, userPoolId, username});
		wrapper(userInput).catch((err) => console.log(err));
		expect(count).to.equal(1);
	});
	it('calls resolve with event.body value', (done) => {
		provider.confirmSignUp = (params, callback) => {
			callback(null, params);
		};
		const wrapper = signUpConfirm({provider, clientId, userPoolId, username});
		wrapper(userInput).then((data) => {
			// console.log('then', JSON.stringify(data));
			expect(data).to.eql({ ClientId: 'testClientId',
				ConfirmationCode: 'test confirmation code',
				Username: 'test email',
				id: 'test user id' });
			done();
		}).catch(console.log);
	});
});

// export function signUpConfirm({provider, clientId, userPoolId, username = getUsernameFromEmail}) {
//
// 	if (!(provider && typeof provider.adminGetUser === 'function')) {
// 		throw new TypeError('missing provider.adminGetUser(params, function(err, data)) function');
// 	}
//
// 	if (!(provider && typeof provider.confirmSignUp === 'function')) {
// 		throw new TypeError('missing provider.confirmSignUp(params, function(err, data)) function');
// 	}
//
// 	if (!(clientId && typeof clientId === 'string')) {
// 		throw new TypeError('missing clientId');
// 	}
//
// 	if (!(userPoolId && typeof userPoolId === 'string')) {
// 		throw new TypeError('missing userPoolId');
// 	}
//
// 	if (!(username && ((typeof username === 'string') || (typeof username === 'function')))) {
// 		throw new TypeError('missing username String or username(email) function');
// 	}
//
// 	// supports a String or a function
// 	const getUsername = typeof username === 'string' ? () => username : username;
//
// 	return function signUpConfirm({id, email, code}) {
//
// 		return new Promise((resolve, reject) => {
//
// 			const messages = [];
//
// 			// application errors
// 			if (!(id && typeof id === 'string')) {
// 				return reject({code: 'InvalidRequest', field: 'id', message: 'Missing account id.'});
// 			}
//
// 			// user input errors
// 			if (!(email && typeof email === 'string')) {
// 				messages.push({code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'});
// 			}
//
// 			if (!(code && typeof code === 'string')) {
// 				messages.push({code: 'MissingRequiredUserInput', field: 'code', message: 'Your confirmation code is required.'});
// 			}
//
// 			if (messages.length) {
// 				return reject(messages);
// 			}
//
// 			const username = getUsername(email);
//
// 			const confirmParams = {
// 				ClientId: clientId, /* required */
// 				ConfirmationCode: code, /* required */
// 				Username: username /* required */
// 				//ForceAliasCreation: true || false,
// 				//SecretHash: 'STRING_VALUE'
// 			};
//
// 			const userParams = {
// 				UserPoolId: userPoolId, /* required */
// 				Username: username /* required */
// 			};
//
// 			try {
//
// 				provider.adminGetUser(userParams, function(err, data) {
//
// 					if (err) {
// 						return reject(err);
// 					}
//
// 					const userId = data.UserAttributes.reduce((result, attr) => {
//
// 						if (result) {
// 							return result;
// 						}
//
// 						if (attr.Name === 'custom:id') {
// 							return attr.Value;
// 						}
//
// 					}, '');
//
// 					if (userId !== id) {
// 						return reject({code: 'InvalidRequest', message: 'Account id does not match given user.'});
// 					}
//
// 					provider.confirmSignUp(confirmParams, function(err, data) {
//
// 						if (err) {
// 							reject(err);
// 						} else {
// 							const result = {};
// 							Object.assign(result, data, {id: id});
// 							resolve(result);
// 						}
//
// 					});
//
// 				});
//
// 			} catch (error) {
// 				reject(error);
// 			}
// 		});
//
// 	}
//
// }
