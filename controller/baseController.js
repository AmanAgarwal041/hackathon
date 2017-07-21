const crypto = require('crypto');
const sessionManager = require('../logics/sessionManager');
const responseManager = require('../logics/responseManager');
const strings = require('../classes/strings');
const constants = require('../classes/constants');
const SessionModelManager = require('../modelManager/sessionModelManager');
const utilHelper = require('../helpers/utilHelper');
const UserModelManager = require('../modelManager/userModelManager');

function baseController(req, res) {
	this.req = req;
	this.res = res;
}

baseController.prototype.run = function () {};

baseController.prototype.CMSFilter = function () {
  // Global CMS Filter : Applies to controllers only specific to ogma
	const that = this;
	const req = this.req;
	const res = this.res;

	this.checkSession(req, hasActiveSession => {
		if (!hasActiveSession) {
			return responseManager.sendJSONResponse(res, { error: strings.invalidSession });
		}

		if (!req.session.isCMS) {
			return responseManager.sendJSONResponse(res, { error: 'Unauthorised ! Not a valid Ogma User !' });
		}

		that.run();
	});
};

baseController.prototype.sessionfilter = function () {
	const that = this;
	const req = this.req;
	const res = this.res;
	const apiMobileType = req.headers.ismobile || false;

	this.checkSession(req, ifInSession => {
		if (ifInSession) {
			that.run();
			return;
		}

		if (apiMobileType) {
			sessionManager.invalidSessionResponse(res);
			return;
		}

		responseManager.setFlashMessage(req, 'error', strings.invalidSession, true);
		const requestedURL = new Buffer(req.originalUrl, 'utf-8').toString('base64');
		res.redirect('/?rq=' + requestedURL);
		return;
	});
};

baseController.prototype.checkIfUserAllowed = function (email) {
	const that = this;
	if (!email) {
		const blockMsg = 'You are blocked.Please contact administrator to unblock.';
		console.log(blockMsg);
		return that.res.send(JSON.stringify({ error: blockMsg, errorCode: 203 }));
	}

	const userModelManagerObj = new UserModelManager();
	userModelManagerObj.checkIfUserTimedBlock(email, data => {
		if (!data.isblocked) {
			return that.sessionfilter();
		}

		const currTime = new Date().getTime();
		const remainingTime = (data.blockedfor * 1000) - (currTime - data.blockedon);
		if (remainingTime > 0) {
			const blockMsg = 'You are blocked for ' + (remainingTime / 1000) + ' more seconds';
			console.log(blockMsg);
			that.res.send(JSON.stringify({ error: blockMsg, errorCode: 203, remainingTime }));
		} else {
			that.sessionfilter();
		}
	});
};

baseController.prototype.saltfilter = function () {
	const that = this;
	const req = this.req;
	const res = this.res;

	const hashSum = req.headers.hashsum;
	const param = req.headers.secureparam;
	let hashMd5 = crypto.createHash('md5').update(param + constants.ogmaSalt).digest('hex');
  // removing trailing 0 in hashMd5
	hashMd5 = hashMd5.replace(/^0*/, '');

	console.log(hashSum + "----" + param + "---" + hashMd5);
	if (hashSum === hashMd5) {
		this.securedParams = utilHelper.jsonParser(param);
		return that.run();
	}

	if (hashSum.indexOf(hashMd5) >= 0 && hashMd5.length > 5 && hashSum.length > 5) {
		console.log('Substring found in salt filter! Diagnose ! Allowing request for now !');
		this.securedParams = utilHelper.jsonParser(param);
		return that.run();
	}

	responseManager.setFlashMessage(req, 'error', strings.invalidSession, true);
	const requestedURL = new Buffer(req.originalUrl, 'utf-8').toString('base64');
	return res.redirect('/?rq=' + requestedURL);
};

baseController.prototype.checkSession = function (req, callback) {
  // console.log("sessionId: " + req.sessionID + '---' + req.session.userId);
	const email = req.session.email;
	if (!email) {
		return callback(false);
	}

	if (req.session.userType === 'CMS' && req.session.deviceType === 'cms') {
		// For CMS users do not check if user is blocked
		(new SessionModelManager()).validateSessionFromServer(req.sessionID, email, 0, result => {
			if (!result) {
				return callback(false);
			}

			sessionManager.checkSession(req, (clientSession, session) => {
				return callback(clientSession, session);
			});
		});
		return;
	}

	const userModelManagerObj = new UserModelManager();
	userModelManagerObj.checkIfUserActive(email, isActive => {
		if (!isActive) {
			return callback(false);
		}

		(new SessionModelManager()).validateSessionFromServer(req.sessionID, email, 0, result => {
			if (!result) {
				return callback(false);
			}

			sessionManager.checkSession(req, (clientSession, session) => {
				return callback(clientSession, session);
			});
		});
	});
};

baseController.prototype.destroySessionFromServerSide = function (sid, email, callback) {
	(new SessionModelManager()).destroySessionFromServerSide(sid, email, result => {
		callback(result);
	});
};

module.exports = baseController;
