Parse.Cloud.define('signup', async (req) => {
	//verificar se dados estão ok - validação de dados regras etc - no front end faz sentido
	//email e senha o própio parse server verifica
	if(req.params.email == null) throw "INVALID_EMAIL";
	if(req.params.name == null) throw "INVALID_NAME";
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


function formatUser(userJson) {
	return {
		id: userJson.objectId,
		fullname: userJson.fullname,
		nickname: userJson.nickname,
    email: userJson.email,
		token: userJson.sessionToken
	}
}