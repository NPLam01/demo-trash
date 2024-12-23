const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const generalAccessToken = (payload) => {
    console.log('Generating access token for payload:', payload); // Debug log
    const accessToken = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN || 'access_token_secret', {expiresIn : '1h'})
    return accessToken;
}

const generalRefreshToken = (payload) => {
    console.log('Generating refresh token for payload:', payload); // Debug log
    const refreshToken = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN || 'refresh_token_secret', {expiresIn : '365d'})
    return refreshToken;
}

module.exports = {
    generalAccessToken,
    generalRefreshToken
}