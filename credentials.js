const jwt = require('jsonwebtoken');
const express = require('express')

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

const credentialsRouter = express.Router();

credentialsRouter.post('/', async (req, res) => {

	try {

		const { body } = req;

		let decoded = jwt.verify(body.idToken, AUTH0_CLIENT_PUBLIC_KEY);

		let AuthenticationClient = require('auth0').AuthenticationClient;

		let auth0 = new AuthenticationClient({
			domain: `${AUTH0_DOMAIN}.auth0.com`,
			clientId: AUTH0_CLIENT_ID,
			clientSecret: AUTH0_CLIENT_SECRET,
			scope: 'offline_access'
		});

		let credentialsGrant = await auth0.clientCredentialsGrant({
			audience: `https://${AUTH0_DOMAIN}.auth0.com/api/v2/`, 
			scope: 'read:users'
		});

		let ManagementClient = require('auth0').ManagementClient;
	
		let management = new ManagementClient({
			token: credentialsGrant.access_token,
			domain: `${AUTH0_DOMAIN}.auth0.com`
		});

		let users = await management.getUser({ id: decoded.sub });

		let data = {
			access_token:	users.identities[0].access_token,
			refresh_token: '',
			user_id: users.user_id,
			url: users.urls.custom_domain,
			organization_id: users.organization_id
		};
		console.log('credentials', data); 
		res.status(201).send(JSON.stringify(data));

	} catch(err) {
		console.log('what the', err); 
		res.status(401).send(JSON.stringify({ error: err }));

	}

});

module.exports = credentialsRouter;