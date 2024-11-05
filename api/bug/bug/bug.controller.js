
import { bugService } from "./bug.service.js"
import { loggerService } from "../../../services/logger.service.js"
import { ObjectId } from 'mongodb'

export async function getBugs (req, res) {
	const { title, severity, labels, sortBy, sortDir, pageIdx, creatorId } = req.query
	const filterBy = { title, severity: +severity, labels, sortBy, sortDir: +sortDir, pageIdx: +pageIdx, creatorId }

	try {
		const bugs = await bugService.query(filterBy)
		res.json(bugs)
	} catch (err) {
		loggerService.error('Failed to get bugs', err)
		res.status(400).send({ err: 'Failed to get bugs' })
	}
}

export async function getBug (req, res) {
    const { bugId } = req.params;
    let { visitedBugs = [] } = req.cookies;

	if (visitedBugs?.length >= 3) {
		return res.status(401).send('wait a sec')
	}

	if (!visitedBugs.includes(bugId)) {
		visitedBugs.push(bugId)
	}

	res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 });

    try {
        const bug = await bugService.getById(bugId);
		res.json(bug)
    } catch (err) {
        res.status(400).send(err);
    }
};

export async function addBug (req, res) {
	const user = req.loggedinUser
	user._id = ObjectId.createFromHexString(user._id)

	const { title, description, severity } = req.body
	const bugToSave = { title, description, severity: +severity, creator: user }

	try {
		const savedBug = await bugService.add(bugToSave)
		res.json(savedBug)
	} catch (err) {
		loggerService.error('Failed to add bug', err)
		res.status(400).send({ err: 'Failed to add bug' })
	}
}

export async function updateBug(req, res) {
	const { _id: userId, isAdmin } = req.loggedinUser
	const { _id, title, description, severity, createdAt, creator } = req.body
	const bugToSave = { _id, title, description, severity: +severity, createdAt, creator }

    if (!isAdmin && bugToSave.creator._id !== userId) {
        res.status(403).send('Not your bug...')
        return
    }

	try {
		const savedBug = await bugService.update(bugToSave)
		res.json(savedBug)

	} catch (err) {
		loggerService.error('Failed to update bug', bug)
		res.status(400).send({ err: 'Failed to update bug' })
	}
}

export async function removeBug (req, res) {
	try {
		const { bugId } = req.params
		const removedId = await bugService.remove(bugId)
		res.send(removedId)
	} catch (err) {
		loggerService.error('Failed to remove bug', err)
		res.status(400).send({ err: 'Failed to remove bug' })
	}
}

export async function addBugMsg(req, res) {
	const { loggedinUser } = req

	try {
		const bugId = req.params

		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		
		const savedMsg = await bugService.addBugMsg(bugId, msg)
		res.json(savedMsg)
	} catch (err) {
		loggerService.error('Failed to update bug', err)
		res.status(400).send({ err: 'Failed to update bug' })
	}
}

export async function removeBugMsg(req, res) {
	try {
		const { bugId, msgId } = req.params

		const removedId = await bugService.removeBugMsg(bugId, msgId)
		res.send(removedId)
	} catch (err) {
		loggerService.error('Failed to remove bug msg', err)
		res.status(400).send({ err: 'Failed to remove bug msg' })
	}
}




