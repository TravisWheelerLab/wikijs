/* global WIKI */

const _ = require('lodash')
var OAuth2Strategy = require('passport-oauth2')

function OrcidStrategy(options, verify) {
    options.scope = options.scope || '/authenticate'
    if (options.sandbox) {
        options.authorizationURL = 'https://sandbox.orcid.org/oauth/authorize'
        options.tokenURL = 'https://sandbox.orcid.org/oauth/token'
    } else {
        options.authorizationURL = 'https://orcid.org/oauth/authorize'
        options.tokenURL = 'https://orcid.org/oauth/token'
    }
    delete options.sandbox
    OAuth2Strategy.call(this, options, verify)
    this.name = 'orcid'
}

module.exports = {
    init(passport, conf) {
        passport.use('orcid',
            new OrcidStrategy({
                // sandbox: process.env.NODE_ENV !== 'production',
                sandbox: false,
                clientID: conf.clientId,
                clientSecret: conf.clientSecret,
                callbackURL: conf.callbackURL
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