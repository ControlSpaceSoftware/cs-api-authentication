/*global describe, it, beforeEach*/

import chai from 'chai'
import sinonChai from 'sinon-chai'
import {signUp} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('signUp', () => {
	let provider, clientId, shortId, username, userInput;
	beforeEach(() => {
		shortId = {
			generate() {
				return 'test short id';
			}
		};
		userInput = {name: 'test name', email: 'test email', phone: 'test phone', password: 'test password'};
		provider = {
			signUp(params, cb) {
				cb(null, params);
			}
		};
		clientId = 'testClientId';
		username = (email) => email;
	});
	it('exits', () => {
		expect(signUp).to.be.a('function');
	});
	it('throws TypeError when provider is missing', () => {
		expect(signUp).to.throw(TypeError);
	});
	it('throws TypeError when clientId is missing', () => {
		expect(signUp.bind(null, {provider, clientId: null})).to.throw(TypeError);
	});
	it('throws TypeError when shortId is missing', () => {
		expect(signUp.bind(null, {provider, clientId, shortId: null})).to.throw(TypeError);
	});
	it('throws TypeError when username is missing', () => {
		expect(signUp.bind(null, {provider, clientId, shortId, username: null})).to.throw(TypeError);
	});
	it('returns function when required params give', () => {
		expect(signUp.bind(null, {provider, clientId, shortId, username})).to.not.throw();
	});
	it('calls provider.signUp(...) function', () => {
		let count = 0;
		provider.signUp = () => count++;
		const wrapper = signUp({provider, clientId, shortId, username});
		wrapper(userInput);
		expect(count).to.equal(1);
	});
	it('calls resolve with event.body value', (done) => {
		provider.signUp = (params, callback) => {
			callback(null, params);
		};
		const wrapper = signUp({provider, clientId, shortId, username});
		wrapper(userInput).then((data) => {
			// console.log('then', JSON.stringify(data));
			expect(data).to.eql({
				"ClientId": "testClientId",
				"Username": "test email",
				"Password": "test password",
				"UserAttributes": [{"Name": "custom:id", "Value": "cstest short id"}, {
					"Name": "email",
					"Value": "test email"
				}, {"Name": "name", "Value": "test name"}, {"Name": "phone_number", "Value": "test phone"}],
				"ValidationData": [],
				"id": "cstest short id"
			});
			done();
		});
	});
});

//
// export function signUp({provider, clientId, shortId, username = getUsernameFromEmail}) {
//
// 	if (!(provider && typeof provider.confirmForgotPassword === 'function')) {
// 		throw new TypeError('missing provider.confirmForgotPassword(params, function(err, data)) function');
// 	}
//
// 	if (!(clientId && typeof clientId === 'string')) {
// 		throw new TypeError('missing clientId');
// 	}
//
// 	if (!(shortId && typeof shortId.generate === 'function')) {
// 		throw new TypeError('missing shortId.generate() function. npm install shortid --save');
// 	}
//
// 	if (!(username && ((typeof username === 'string') || (typeof username === 'function')))) {
// 		throw new TypeError('missing username String or username(email) function');
// 	}
//
// 	// supports a String or a function
// 	const getUsername = typeof username === 'string' ? () => username : username;
//
// 	return function signUp({name, email, phone, password}) {
//
// 		return new Promise((resolve, reject) => {
//
// 			const messages = [];
//
// 			if (!(name && typeof name === 'string')) {
// 				messages.push({code: 'MissingRequiredUserInput', message: 'Your email address is required.'});
// 			}
//
// 			if (!((email && typeof email === 'string') || (phone && typeof phone === 'string'))) {
// 				messages.push({code: 'MissingRequiredUserInput', message: 'Your account email address is
// required.'}); }  if (!(password && typeof password === 'string')) { messages.push({code: 'MissingRequiredUserInput',
// message: 'Your account password is required.'}); }  if (messages.length) { return reject(messages); }  const id =
// `cs${shortId.generate()}`;  const attributeList = [];  attributeList.push({ Name : 'custom:id', Value : id });
// attributeList.push({ Name : 'email', Value : email });  if (name) { attributeList.push({ Name : 'name', Value : name
// }); }  if (phone) { attributeList.push({ Name : 'phone_number', Value : phone }); }  const username =
// getUsername(email);  // todo learn how to use the secrete hash string  const params = { ClientId: clientId, /*
// required */ Username: username, /* required */ Password: password, /* required */ //SecretHash: 'STRING_VALUE',
// UserAttributes: attributeList, ValidationData: [] };  provider.signUp(params, function(err, data) { if (err) {
// reject(err); } else { const result = {}; Object.assign(result, data, {id: id}); resolve(result); } });  });  }  }
