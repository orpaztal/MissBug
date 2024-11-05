
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'

export const userService = {
    add, // Create (Signup)
	getById, // Read (Profile page)
	update, // Update (Edit profile)
	remove, // Delete (remove user)
	query, // List (of users)
	getByUsername, // Used for Login
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = user._id.getTimestamp()
            return user
        })
        return users
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }}

async function getById(usersId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        delete user.password

        criteria = { byUserId: userId }

        // user.givenReviews = await reviewService.query(criteria)
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })

        return user
    } catch (err) {
        loggerService.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
	try {
		const collection = await dbService.getCollection('user')
		const user = await collection.findOne({ username })
		
        return user
	} catch (err) {
		loggerService.error(`while finding user by username: ${username}`, err)
		throw err
	}
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        await collection.deleteOne(criteria)
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id), 
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }
}


async function add(user) {
	try {
		const userToAdd = {
			username: user.username,
			password: user.password,
			fullname: user.fullname,
			imgUrl: user.imgUrl,
			isAdmin: user.isAdmin,
			score: 100,
		}
		const collection = await dbService.getCollection('user')
		await collection.insertOne(userToAdd)
		
        return userToAdd
	} catch (err) {
		loggerService.error('cannot add user', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	if (filterBy.txt) {
		const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
		criteria.$or = [
			{
				username: txtCriteria,
			},
			{
				fullname: txtCriteria,
			},
		]
	}
	// if (filterBy.minBalance) {
	// 	criteria.score = { $gte: filterBy.minBalance }
	// }
	return criteria
}

// async function save(user) {
//     // try {
//     //     if (userToSave._id) {
//     //         const idx = users.findIndex(user => user._id === userToSave._id)
//     //         if (idx === -1) throw `Bad user Id`

//     //         users.splice(idx, 1, userToSave)
//     //     } else {
//     //         userToSave._id = utilService.makeId()
//     //         users.push(userToSave)
//     //     }
//     //     _saveUsers()
//     // } catch (err) {
//     //     loggerService.error(err)
//     //     throw `couldn't save user`
//     // }
//     // return userToSave

//     // try {
//     //     // user._id = utilService.makeId()
//     //     user.score = 10000
//     //     user.createdAt = Date.now()
//     //     if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
        
//     //     users.push(user)
    
//     //     _saveUsers()
//     //     return user
//     // } catch (err) {
//     //     loggerService.error('userService[save] : ', err)
//     //     throw err
//     // }
// }

// async function _saveUsers() {
//     utilService.writeJsonFile('./data/user.json', users)
// }
