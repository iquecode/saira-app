Parse.Cloud.define('signup', async (req) => {
	//verificar se dados estão ok - validação de dados regras etc - no front end faz sentido
	//email e senha o própio parse server verifica
	if(req.params.email == null) throw "INVALID_EMAIL";
	if(req.params.fullname == null) throw "INVALID_NAME";
	if(req.params.nickname == null) throw "INVALID_NICKNAME";
	const user = new Parse.User();
	user.set('username', req.params.email)
	user.set('email', req.params.email)
	user.set('password', req.params.password)
	user.set('fullname', req.params.fullname)
	user.set('nickname', req.params.nickname)
	try {
		const resultUser = await user.signUp(null, {useMasterKey: true})
		const userJson = resultUser.toJSON()
		return formatUser(userJson)
	} catch (e) {
		throw 'INVALID_DATA'
	}
	//return resultUser
})

Parse.Cloud.define('login', async (req) => {
	try {
		const user = await Parse.User.logIn(req.params.email, req.params.password)
		const userJson = user.toJSON();
		return formatUser(userJson)
	} catch (e) {
		throw e + 'INVALID_CREDENTIALS'
	}
})

Parse.Cloud.define('validate-token', async (req) => {
	try {
		return formatUser(req.user.toJSON())
	} catch (e) {
		throw 'INVALID_TOKEN'
	}
})

Parse.Cloud.define('change-password', async (req) => {
	if(req.user == null) throw 'INVALID_USER'
	const user = await Parse.User.logIn(req.params.email, req.params.currentPassword)
	if(user.id != req.user.id) throw "INVALID_USER"
	user.set('password', req.params.newPassword)
	await user.save(null, {useMasterKey: true})
})

Parse.Cloud.define('reset-password', async (req) => {
	await Parse.User.requestPasswordReset(req.params.email)
})


function formatUser(userJson) {
	return {
		id: userJson.objectId,
		fullname: userJson.fullname,
		nickname: userJson.nickname,
    email: userJson.email,
		token: userJson.sessionToken
	}
}