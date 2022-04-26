const express = require('express')
const router = express.Router();
const formidable = require('formidable')
const Orm = require('../models/DB').Orm

const orm = new Orm()

// $route   POST api/user/getUserInfo
// @desc    获取用户信息
// access   public
router.post('/getUserInfo', (req, res) => {
	const form = formidable({})
	form.parse(req, async (err, fields, files) => {
		// const result = await orm.table('user').orderByDesc('id').limit(1, 10).select()
		// const result = await orm.table('user').insert({'nickname': '赵志亮', 'role': 1, 'status': 1})
		const result = await orm.table('user').eq('id', 21).update({'nickname': 'liang', 'avatar': 'http://127.0.0.1:8887/server/public/images/avatar/1650434932765-test.jpg'})
		res.send(result)
	})
})

module.exports = router