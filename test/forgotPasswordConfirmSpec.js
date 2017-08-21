/*global describe, it, beforeEach*/

import chai from 'chai'
import sinonChai from 'sinon-chai'
import {forgotPasswordConfirm} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('forgotPasswordConfirm', () => {
	let provider, clientId, username, userInput;
	beforeEach(() => {
		userInput = {
			email: 'test email',
			code: 'test code',
			password: 'test password'
		};
		provider = {
			confirmForgotPassword(params, cb) {
				cb(null, userInput);
			}
		};
		clientId = 'testClientId';
		username = (email) => email;
	});
	it('exits', () => {
		expect(forgotPasswordConfirm).to.be.a('function');
	});
	it('throws TypeError when provider is missing', () => {
		expect(forgotPasswordConfirm).to.throw(TypeError);
	});
	it('throws TypeError when clientId is missing', () => {
		expect(forgotPasswordConfirm.bind(null, {provider})).to.throw(TypeError);
	});
	it('throws TypeError when username is missing', () => {
		expect(forgotPasswordConfirm.bind(null, {provider, clientId, username: ''})).to.throw(TypeError);
	});
	it('returns function when required params are given', () => {
		expect(forgotPasswordConfirm.bind(null, {provider, clientId, username})).to.be.a('function');
	});
	it('calls provider.forgotPassword(...) function when required params are given', () => {
		let count = 0;
		provider.confirmForgotPassword = () => count++;
		const wrapper = forgotPasswordConfirm({provider, clientId, username});
		wrapper({email: 'test', code: 'test code', password: 'test password'});
		expect(count).to.equal(1);
	});
	it('calls resolve with event.body value', (done) => {
		provider.confirmForgotPassword = (params, callback) => {
			callback(null, params);
		};
		const wrapper = forgotPasswordConfirm({provider, clientId, username});
		wrapper(userInput).then((data) => {
			expect(data).to.eql({"ClientId":"testClientId","Username":"test email","ConfirmationCode":"test code","Password":"test password"});
			done();
		});
	});

});

// export function forgotPasswordConfirm({provider, clientId, getUsernameFromEmail = getUsernameFromEmail}) {
//
// 	return function confirmForgotPassword({email, code, password}) {
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
// 			if (!(code && typeof code === 'string')) {
// 				messages.push({code: 'MissingRequiredUserInput', field: 'code', message: 'Your confirmation code is required.'});
// 			}
//
// 			if (!(password && typeof password === 'string')) {
// 				messages.push({code: 'MissingRequiredUserInput', message: 'Your account password is required.'});
// 			}
//
// 			if (messages.length) {
// 				return reject(messages);
// 			}
//
// 			const username = getUsernameFromEmail(email);
//
// 			const params = {
// 				ClientId: clientId, /* required */
// 				Username: username, /* required */
// 				ConfirmationCode: code, /* required */
// 				Password: password, /* required */
// 				// SecretHash: 'STRING_VALUE'
// 			};
//
// 			provider.confirmForgotPassword(params, function(err, data) {
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
//
