import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const messageService = { query, remove, add }

async function query(filterBy = {}) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('message')

        var messages = await collection.aggregate([
            {
                $match: criteria,
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user', foreignField: '_id',
                    as: 'byUser',
                },
            },
            {
                $unwind: '$byUser',
            },
            // {
            //     $lookup: {
            //         localField: 'aboutBugId',
            //         from: 'bug', foreignField: '_id',
            //         as: 'aboutBug',
            //     },
            // },
            // {
            //     $unwind: '$aboutBug',
            // },
            { 
                $project: {
                    'txt': true, 
                    'byUser._id': true, 'byUser.fullname': true,
                    // 'aboutBug._id': true, 'aboutBug.title': true, 'aboutBug.severity': true,
                } 
            }
        ]).toArray()

        // var bugCursor = await collection.find(criteria)

        // const messages = bugCursor.toArray()
        // return messages

        console.log("collection messages: ", messages)

		return messages
	} catch (err) {
		loggerService.error('cannot get messages', err)
		throw err
	}
}

async function remove(messageId) {
    const { loggedinUser } = asyncLocalStorage.getStore()

	try {
		const criteria = { _id: ObjectId.createFromHexString(messageId) }

		if (!loggedinUser.isAdmin) {
            criteria.byUserId = loggedinUser._id
        }

        const collection = await dbService.getCollection('message')
        const res = await collection.deleteOne(criteria)
        if (res.deletedCount === 0) throw ('Not your bug')

		return res.deletedCount
	} catch (err) {
		loggerService.error(`cannot remove message ${messageId}`, err)
		throw err
	}
}

async function add(message) {
    try {
        const messageToAdd = {
            byUserId: message.byUserId,
			aboutBugId: message.aboutBugId,
			txt: message.txt,
		}
		const collection = await dbService.getCollection('message')
		await collection.insertOne(messageToAdd)
        
		return messageToAdd
	} catch (err) {
		loggerService.error('cannot add message', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}

	if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }
	return criteria
}