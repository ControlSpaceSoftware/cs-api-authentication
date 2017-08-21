/*global describe, it, beforeEach*/

import chai from 'chai'
import {forgotPassword} from '../src'

const expect = chai.expect;

describe('forgotPassword', () => {
	let provider, clientId, username;
	beforeEach(() => {
		provider = {
			forgotPassword(params, cb) {
				cb(null, params);
			}
		};
		clientId = 'testClientId';
		username = (email) => email;
	});
	it('exits', () => {
		expect(forgotPassword).to.be.a('function');
	});
	it('throws TypeError when provider is missing', () => {
		expect(forgotPassword).to.throw(TypeError);
	});
	it('throws TypeError when clientId is missing', () => {
		expect(forgotPassword.bind(null, {provider})).to.throw(TypeError);
	});
	it('throws TypeError when username is missing', () => {
		expect(forgotPassword.bind(null, {provider, clientId, username: ''})).to.throw(TypeError);
	});
	it('returns function when required params give', () => {
		expect(forgotPassword.bind(null, {provider, clientId, username})).to.be.a('function');
	});
	it('calls provider.forgotPassword(...) function', () => {
		let count = 0;
		provider.forgotPassword = () => count++;
		const wrapper = forgotPassword({provider, clientId, username});
		wrapper({email: 'test'});
		expect(count).to.equal(1);
	});
});