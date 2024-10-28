
import { authService } from "../../auth/auth.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs (req, res) {
	const { title, severity, labels, sortBy, sortDir, pageIdx, creatorId } = req.query
	const filterBy = { title, severity: +severity, labels, sortBy, sortDir: +sortDir, pageIdx: +pageIdx, creatorId }

	try {
		const bugs = await bugService.query(filterBy)
		res.send(bugs)
	} catch (err) {
		con
		res.status(400).send(err)
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

		res.send(bug);
    } catch (err) {
        res.status(400).send(err);
    }
};

export async function updateBug(req, res) {
	const user = req.loggedinUser
	const { loginToken } = req.cookies
	const { _id, title, description, severity, createdAt, creator } = req.body
	
	const bugToSave = { _id, title, description, severity: +severity, createdAt, creator }

	try {
		const savedBug = await bugService.save(bugToSave, user)
		res.send(savedBug)
	} catch (err) {
		res.status(400).send(err)
	}
}

export async function removeBug (req, res) {
	const { bugId } = req.params
	const user = req.loggedinUser

	try {
		await bugService.remove(bugId, user)
		res.send('OK')
	} catch (err) {
		res.status(400).send(`Couldn't remove bug`)
	}
}

export async function addBug (req, res) {
	const user = req.loggedinUser
	const { loginToken } = req.cookies
	const { title, description, severity } = req.body

	const bugToSave = { title, description, severity: +severity, createdAt: Date.now(), creator: user }

	try {
		const savedBug = await bugService.save(bugToSave, user)
		res.send(savedBug)
	} catch (err) {
		res.status(400).send(err)
	}
}



