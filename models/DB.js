const mysql = require('mysql')
const dbConfig = require('./dbConfig')
const pool = mysql.createPool(dbConfig.mysql)

class Orm {
	constructor(debug = 1) {
		this.sql = '',
		this._table = '',
		this.filter = '',
		this.connection = 'AND',
		this.debug = debug
	}
	table(table) {
		this._table = table
		return this
	}

	async count() {
    let result = await this.select()
    return new Promise((resolve, reject) => {
        resolve(result.length)
    })
	}

	find() {

	}
	
	select(..._cols) {
    let cols = [..._cols]
    if (cols.length != 0) {
        let c = ''
        for (let i = 0; i < cols.length; i++) {
            let char = cols[i]
            if (i != cols.length - 1) {
                c += `${char},`
            } else {
                c += `${char}`
            }
        }
        this.sql = `SELECT ${c} FROM ${this._table} ${this.filter}`
    } else {
        this.sql = `SELECT * FROM ${this._table} ${this.filter}`
    }
    //run 方法则为真正去跟数据库交互的方法
    return this.run()
	}

	insert(obj) {
    let keys = '',
        values = ''
    let objArr = Object.keys(obj)
    for (let i = 0; i < objArr.length; i++) {
        let key = objArr[i]
        let val = obj[key]
        if (i != objArr.length - 1) {
            keys += `${key},`
            //注意 value最好用''括起来
            values += `'${val}',`
        } else {
            keys += `${key}`
            values += `'${val}'`
        }
    }
    this.sql = `INSERT INTO ${this._table} (${keys}) VALUES (${values}) ${this.filter}`
    return this.run()
	}

	delete() {
		
	}

	update(obj) {
		let c = ''
		let objArr = Object.keys(obj)
		for (let i = 0; i < objArr.length; i++) {
				let key = objArr[i]
				let val = obj[key]
				if (i != objArr.length - 1) {
						//注意 value最好用''括起来
						c += `${key}='${val}',`
				} else {
						c += `${key}='${val}'`
				}
		}
		this.sql = `UPDATE ${this._table} SET ${c} ${this.filter}`
		return this.run()
	}

	// 相等 数组 => eq('name', 'liang')
	eq(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
				value = arr[1] || null,
				op = '='
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}'`
		}
		this.connection = 'AND'
		return this
	}

	// 不相等 数组 => ne('name', 'liang')
	ne(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
				value = arr[1] || null,
				op = '<>'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}'`
		}
		this.connection = 'AND'
		return this
	}

	// 大于 数组 => gt('age', 18)
	gt(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
				value = arr[1] || null,
				op = '>'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}'`
		}
		this.connection = 'AND'
		return this
	}

	// 大于等于 数组 => ge('age', 18)
	ge(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
				value = arr[1] || null,
				op = '>='
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}'`
		}
		this.connection = 'AND'
		return this
	}

	// 小于 数组 => lt('age', 18)
	lt(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
				value = arr[1] || null,
				op = '<'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}'`
		}
		this.connection = 'AND'
		return this
	}

	// 小于等于 数组 => le('age', 18)
	le(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
				value = arr[1] || null,
				op = '<='
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}'`
		}
		this.connection = 'AND'
		return this
	}

	// between 数组 => between('age', 18, 30)
	between(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
        value1 = arr[1] || null,
        value2 = arr[2] || null
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} BETWEEN '${value1}' AND '${value2}'`
		} else {
				this.filter = `WHERE ${column} BETWEEN '${value1}' AND '${value2}'`
		}
		this.connection = 'AND'
		return this
	}

	// notBetween 数组 => notBetween('age', 18, 30)
	notBetween(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
        value1 = arr[1] || null,
        value2 = arr[2] || null
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} NOT BETWEEN '${value1}' AND '${value2}'`
		} else {
				this.filter = `WHERE ${column} NOT BETWEEN '${value1}' AND '${value2}'`
		}
		this.connection = 'AND'
		return this
	}

	// like 数组 => like('name', 'liang')
	like(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
        value = arr[1] || null,
				op = 'LIKE'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '%${value}%'`
		} else {
				this.filter = `WHERE ${column} ${op} '%${value}%'`
		}
		this.connection = 'AND'
    return this
	}

	// like 数组 => notLike('name', 'liang')
	notLike(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
        value = arr[1] || null,
				op = 'NOT LIKE'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '%${value}%'`
		} else {
				this.filter = `WHERE ${column} ${op} '%${value}%'`
		}
		this.connection = 'AND'
    return this
	}

	// likeLeft 数组 => likeLeft('name', 'liang')
	likeLeft(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
        value = arr[1] || null,
				op = 'LIKE'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '%${value}'`
		} else {
				this.filter = `WHERE ${column} ${op} '%${value}'`
		}
		this.connection = 'AND'
    return this
	}

	// likeRight 数组 => likeRight('name', 'liang')
	likeRight(...arg) {
		let arr = [...arg]
		let column = arr[0] || null,
        value = arr[1] || null,
				op = 'LIKE'
		if (this.filter) {
			this.filter += ` ${this.connection} ${column} ${op} '${value}%'`
		} else {
				this.filter = `WHERE ${column} ${op} '${value}%'`
		}
		this.connection = 'AND'
    return this
	}

	// 为空 多个参数 数组 => isNull('avatar')
	isNull(...arg) {
		let arr = [...arg], op = 'IS NULL'
		arr.forEach(item => {
			if (this.filter) {
        this.filter += ` ${this.connection} ${item} ${op}`
			} else {
					this.filter = `WHERE ${item} ${op}`
			}
		})
		this.connection = 'AND'
		return this
	}

	// 不为空 多个参数 数组 => isNotNull('avatar')
	isNotNull(...arg) {
		let arr = [...arg], op = 'IS NOT NULL'
		arr.forEach(item => {
			if (this.filter) {
        this.filter += ` ${this.connection} ${item} ${op}`
			} else {
					this.filter = `WHERE ${item} ${op}`
			}
		})
		this.connection = 'AND'
		return this
	}

	or() {
		this.connection = 'OR'
		return this
	}

	inSql() {

	}

	notInSql() {

	}

	// 分组 多个参数 数组
	groupBy(...arg) {
		let arr = [...arg], c = ''
		this.filter = ` GROUP BY `
		for(let i = 0; i < arr.length; i++) {
			let char = arr[i]
			if (i != arr.length -1) {
				c += `${char},`
			} else {
				c += `${char}`
			}
		}
		this.filter += c
		return this
	}

	// 升序 多个参数 数组
	orderByAsc(...arg) {
		let arr = [...arg], op = 'ASC', c = ''
		this.filter = ` ORDER BY `
		for(let i = 0; i < arr.length; i++) {
			let char = arr[i]
			if (i != arr.length - 1) {
				c += `${char} ${op},`
			} else {
				c += `${char} ${op}`
			}
		}
		this.filter += c
		return this
	}

	// 降序 多个参数 数组
	orderByDesc(...arg) {
		let arr = [...arg], op = 'DESC', c = ''
		this.filter = ` ORDER BY `
		for(let i = 0; i < arr.length; i++) {
			let char = arr[i]
			if (i != arr.length - 1) {
				c += `${char} ${op},`
			} else {
				c += `${char} ${op}`
			}
		}
		this.filter += c
		return this
	}

	// limit 一个参数 数组
	limit(...arg) {
		let arr = [...arg]
		let value1 = arr[0] || null,
        value2 = arr[1] || null
		if (value2) {
			this.filter += ` LIMIT ${value1},${value2}`
		} else {
			this.filter += ` LIMIT ${value1}`
		}
    return this
	}

	run() {
    let _sql = this.sql
    //debug模式打印出SQL语句
    if(this.debug) console.log(_sql)
    let table = this._table
    //注意在进行数据库查询的前一刻，应该把之前缓存的字符串清空掉。
    this.done()
    //基于Promise封装
    return new Promise((resolve, reject) => {
        if (!table) {
            reject('表名不可为空')
        } else {
            //进行数据库查询
            pool.getConnection((err, con) => {
                if (err) {
                    reject(err)
                } else {
                    con.query(_sql, (err, result) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                            con.release()
                        }
                    })
                }
            })
        }
    })
	}

	done(){
		this.sql = ''
		this._table = ''
		this.filter = ''
	}

	// objTraversal()
}

module.exports = {
	Orm
}


	// // like 多个参数 对象
	// like(obj) {
	// 	let objArr = Object.keys(obj)
	// 	let column = '', val = '', op = 'LIKE', key = ''
	// 	for(let i = 0; i < objArr.length; i++) {
	// 		key = objArr[i]
	// 		column = key
	// 		val = obj[key]
	// 		if (this.filter) {
  //       this.filter += ` AND ${column} ${op} '%${val}%'`
	// 		} else {
	// 				this.filter = `WHERE ${column} ${op} '%${val}%'`
	// 		}
	// 	}
  //   return this
	// }