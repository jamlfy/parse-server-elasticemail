const ElasticEmail = require("elastic-email-client");

const ERRORS = {
	bad_template_config : 'ElasticEmailAdapter templates are not properly configured.',
	missing_api_key : 'ElasticEmailAdapter requires valid API Key.',
	bad_recipient : 'ElasticEmailAdapter messing recipient in the template '
};


class MailAdapter {
	constructor(options){

		if (!options.apiKey) {
			throw new Error(ERRORS.missing_api_key);
		}

		if (!options.templates || Object.keys(options.templates).length === 0) {
			throw new Error(ERRORS.bad_template_config);
		}

		for (let name in options.templates) {
			if ( typeof options.templates[name] != 'string'
				&& typeof options.templates[name] != 'object' ){
				throw new Error(ERRORS.bad_template_config);
			}
		}

		this.config = options;
		this.elastic = new ElasticEmail(options.apiKey);
	}

	sendMail(opts, isDirect){
		var mesg = { template : opts.template };

		if(isDirect){
			const { subject, fromAddress, recipient, variables, extra } = options;

			if (!recipient) {
				throw new Error(ERRORS.bad_recipient + mesg.template);
			}

			mesg.from = options.fromAddress || (this.config.template[mesg.template] && this.config.template[mesg.template].subject) || this.config.fromAddress;
			mesg.to = recipient;
			mesg.subject = subject || (this.config.template[mesg.template] && this.config.template[mesg.template].subject);

			mesg = Object.assign(mesg, extra || {});
		} else {
			mesg.from = (this.config.template[mesg.template] && this.config.template[mesg.template].subject) || this.config.fromAddress;
			mesg.to = options.user.get('email');
			mesg.subject = (this.config.template[mesg.template] && this.config.template[mesg.template].subject);
			mesg.merge_app_link = options.link;
			mesg.merge_app_mame = options.appName;
			mesg.merge_app_user = options.user;
		}

		if(opts.variables){
			for (var i in opts.variables ) {
				mesg['merge_' + i ] = opts.variables[i];
			}
		}

		// Clean
		for (var i in mesg) {
			if(!mesg[i]){
				delete mesg[i];
			}
		}

		return this.elastic.Email.Send(mesg);
	}

	sendPasswordResetEmail(variables) {
		let template = ( this.config.templates.passwordResetEmail && this.config.templates.passwordResetEmail.template ) || this.config.templates.passwordResetEmail || 'passwordResetEmail'
		return this.sendMail({ template, variables });
	}

	sendPasswordResetEmail(variables) {
		let template = ( this.config.templates.verificationEmail && this.config.templates.verificationEmail.template ) || this.config.templates.verificationEmail || 'passwordResetEmail'
		return this.sendMail({ template, variables });
	}

	send({ template, subject, fromAddress, recipient, variables, extra }) {
		return this.sendMail({ template, subject, fromAddress, recipient, variables, extra }, true);
	}

	validateAdapter(){
		this.elastic.Account.Load();
	}
}

module.exports = MailAdapter;