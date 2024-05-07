/* global WIKI */

const _ = require('lodash')
var OAuth2Strategy = require('passport-oauth2')


module.exports = {
    init(passport, conf) {
        passport.use('orcid',
            new OAuth2Strategy({
                authorizationURL: 'https://orcid.org/oauth/authorize',
                tokenURL: 'https://orcid.org/oauth/token',
                clientID: conf.clientId,
                clientSecret: conf.clientSecret,
                callbackURL: conf.callbackURL,
                passReqToCallback: true,
                scope: '/authenticate',
                state: true
            }, async (accessToken, refreshToken, params, profile, cb) => {
                try {
                    const user = await WIKI.models.users.processProfile({
                        profile: {
                            email: "not-really-an-email-" + params.orcid + "@fake.com",
                            displayName: params.name,
                            ...profile,
                        },
                        providerKey: 'orcid'
                    })
                    cb(null, user)
                } catch (err) {
                    cb(err, null)
                }
            })
        )
    }
}
