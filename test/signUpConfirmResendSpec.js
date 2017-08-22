/*global describe, it, beforeEach*/

import chai from 'chai'
import sinonChai from 'sinon-chai'
import {signUpConfirmResend} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('signUpConfirmResend', () => {
	let provider, clientId, username, userInput;
	beforeEach(() => {
		userInput = {id: 'test user id', email: 'test email', code: 'test confirmation code'};
		clientId = 'testClientId';
		username = (email) => email;
		provider = {
			resendConfirmationCode(params, cb) {
				cb(null, params);
			}
		};
	});
	it('exits', () => {
		expect(signUpConfirmResend).to.be.a('function');
	});
	it('throws TypeError when provider is missing', () => {
		expect(signUpConfirmResend).to.throw(TypeError);
	});
	it('throws TypeError when provider.resendConfirmationCode(...) is missing', () => {
		provider.resendConfirmationCode = null;
		expect(signUpConfirmResend.bind(null, {provider})).to.throw(TypeError);
	});
	it('throws TypeError when clientId is missing', () => {
		expect(signUpConfirmResend.bind(null, {provider, clientId: null})).to.throw(TypeError);
	});
	it('throws TypeError when username is missing', () => {
		expect(signUpConfirmResend.bind(null, {provider, clientId, username: null})).to.throw(TypeError);
	});
	it('returns function when required params give', () => {
		expect(signUpConfirmResend.bind(null, {provider, clientId, username})).to.not.throw();
	});
	it('calls provider.resendConfirmationCode(...) function', () => {
		let count = 0;
		provider.resendConfirmationCode = () => count++;
		const wrapper = signUpConfirmResend({provider, clientId, username});
		wrapper(userInput).catch((err) => console.log(err));
		expect(count).to.equal(1);
	});
	it('calls resolve with event.body value', (done) => {
		provider.resendConfirmationCode = (params, callback) => {
			callback(null, params);
		};
		const wrapper = signUpConfirmResend({provider, clientId, username});
		wrapper(userInput).then((data) => {
			// console.log('then', JSON.stringify(data));
			expect(data).to.eql({ ClientId: 'testClientId', Username: 'test email' });
			done();
		}).catch(console.log);
	});
});


// export function signUpConfirmResend({provider, clientId, username = getUsernameFromEmail}) {
//
// 	if (!(provider && typeof provider.resendConfirmationCode === 'function')) {
// 		throw new TypeError('missing provider.resendConfirmationCode(params, function(err, data)) function');
// 	}
//
// 	if (!(clientId && typeof clientId === 'string')) {
// 		throw new TypeError('missing clientId');
// 	}
//
// 	if (!(username && ((typeof username === 'string') || (typeof username === 'function')))) {
// 		throw new TypeError('missing username String or username(email) function');
// 	}
//
// 	// supports a String or a function
// 	const getUsername = typeof username === 'string' ? () => username : username;
//
// 	return function signUpConfirmResend({email}) {
//
// 		return new Promise((resolve, reject) => {
//
// 			const messages = [];
//
// 			// user input errors
// 			if (!(email && typeof email === 'string')) {
// 				messages.push({code: 'MissingRequiredUserInput', field: 'email', message: 'Your account email address is required.'});
// 			}
//
// 			if (messages.length) {
// 				return reject(messages);
// 			}
//
// 			const username = getUsername(email);
//
// 			const params = {
// 				ClientId: clientId, /* required */
// 				Username: username, /* required */
// 				// SecretHash: 'STRING_VALUE'
// 			};
//
// 			provider.resendConfirmationCode(params, function(err, data) {
// 				if (err) {
// 					reject(err);
// 				} else {
// 					resolve(data);
// 				}
// 			});
//
// 		});
//
// 	}
//
// }
