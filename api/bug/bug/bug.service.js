import { ObjectId } from 'mongodb'

import { loggerService } from "../../../services/logger.service.js"
import { dbService } from '../../../services/db.service.js'
import { asyncLocalStorage } from '../../../services/als.service.js'

export const bugService = {
    query,
    getById,
    remove,
    add,
    update,
    addBugMsg,
    removeBugMsg,
}

const PAGE_SIZE = 4

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

        const collection = await dbService.getCollection('bug')
        var bugCursor = await collection.find(criteria, { sort })

        if (filterBy.pageIdx !== undefined) {
            bugCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const bugs = bugCursor.toArray()
        return bugs
    } catch (err) {
        loggerService.error(err)
		throw err
    }
}

async function getById(bugId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }

		const collection = await dbService.getCollection('bug')
		const bug = await collection.findOne(criteria)
        
		bug.createdAt = bug._id.getTimestamp()
		return bug
    } catch (err) {
        loggerService.error(err)
		throw err
    }
}

async function remove(bugId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    console.log("loggedinUser", loggedinUser)
    const { _id: creatorId, isAdmin } = loggedinUser

	try {
        const criteria = { 
            _id: ObjectId.createFromHexString(bugId), 
        }
       
        if (!isAdmin) criteria['creator._id'] = creatorId
        
		const collection = await dbService.getCollection('bug')
		const res = await collection.deleteOne(criteria)

        if(res.deletedCount === 0) throw('Not your bug')
		return bugId

    } catch (err) {
        loggerService.error(err)
		throw err
    }
}

async function add(bug) {
	try {
		const collection = await dbService.getCollection('bug')
		await collection.insertOne(bug)

		return bug
	} catch (err) {
		loggerService.error('cannot insert bug', err)
		throw err
	}
}

async function update(bug) {
    const bugToSave = { severity: bug.severity }

    try {
        const criteria = { _id: ObjectId.createFromHexString(bug._id) }

		const collection = await dbService.getCollection('bug')
		await collection.updateOne(criteria, { $set: bugToSave })

		return bug
	} catch (err) {
		loggerService.error(`cannot update bug ${bug._id}`, err)
		throw err
	}
}

async function addBugMsg(bugId, msg) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }
        // msg.id = utilService.makeId()
        
		const collection = await dbService.getCollection('bug')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		loggerService.error(`cannot add bug msg ${bugId}`, err)
		throw err
	}
}

async function removeBugMsg(bugId, msgId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }

		const collection = await dbService.getCollection('bug')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId }}})
        
		return msgId
	} catch (err) {
		loggerService.error(`cannot remove bug msg ${bugId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
    const criteria = {
        title: { $regex: filterBy.title, $options: 'i' },
        severity: { $gte: filterBy.severity },
    }

    //     if (labels && labels.length > 0) {
    //         filteredBugs = filteredBugs.filter(bug => 
    //             bug.labels?.some(label => filterBy.labels.includes(label))
    //         );
    //     }

    //     if (creatorId) {
    //         filteredBugs = filteredBugs.filter(bug => bug.creator?._id === creatorId);
    //     }

    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortBy) return {}
    return { [filterBy.sortBy]: filterBy.sortDir }
}
