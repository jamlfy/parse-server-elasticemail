# parse-server-elasticemail

Allows your Parse Server app to send template-based emails through ElasticEmail. 

# Installation

	npm install --save parse-server-elasticemail

# Adapter configuration

```
var server = ParseServer({
	// Is to verify the users
	verifyUserEmails: true 
	emailAdapter: {
		module : 'parse-server-elasticemail',
		options : {
			// Your API KEY
			apiKey: '-- API --',
			// The templates
			templates : {
				// Only the name
				passwordResetEmail : 'reset_email',
				// A object
				verificationEmail : {
					// Name template (Required)
					name : 'verification_email',
					// Subject
					subject : 'Hey do a click!',
					// Form
					fromAddress : 'my@coolEmail.com'
				},
				// And more elements
				customEmailAlert : 'Othe alert'
			}
		}
	}
});
```