const express = require('express');
const axios = require('axios'); 

const SF_CLIENT_KEY = process.env.SF_CLIENT_KEY;
const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;

const authRouter = express.Router();

authRouter.get('/', async (req, res) => {

	try {

		const { query } = req;

		const grant_type = 'authorization_code'; 

		const redirect_uri = 'https://clarity-api-auth.herokuapp.com/auth';

		console.log('query::', query.code); 

		const { data } = await axios.post(`https://test.salesforce.com/services/oauth2/token?code=${query.code}&grant_type=${grant_type}&client_id=${SF_CLIENT_KEY}&client_secret=${SF_CLIENT_SECRET}&redirect_uri=${redirect_uri}`);

		console.log('data', data); 

		//make request to salesforce and get token
		//then make request to my instance and save there what we need

		res.render('pages/auth');

	} catch(err) {
		console.log('what the', err); 
	}

});

module.exports = authRouter;