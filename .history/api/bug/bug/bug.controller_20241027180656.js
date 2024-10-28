
import { authService } from "../../auth/auth.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs (req, res) {
	const { title, severity, labels, sortBy, sortDir, pageIdx } = req.query
	const filterBy = { title, severity: +severity, labels, sortBy, sortDir: +sortDir, pageIdx: +pageIdx }

	try {
		const bugs = await bugService.query(filterBy)
		res.send(bugs)
	} catch (err) {
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
	const { loginToken } = req.cookies
	const { _id, title, description, severity, createdAt, creator } = req.body
	
	const user = authService.validateToken(loginToken)
	const bugToSave = { _id, title, description, severity: +severity, createdAt, creator }

	if (!user) return res.status(401).send('Not logged in!')
	
	try {
		const savedBug = await bugService.save(bugToSave, user)
		res.send(savedBug)
	} catch (err) {
		res.status(400).send(err)
	}
}

export async function removeBug (req, res) {
	const { bugId } = req.params
	
	// const { loginToken } = req.cookies
	// const user = authService.validateToken(loginToken)

	// if (!user) return res.status(401).send('Not logged in!')
	
	try {
		await bugService.remove(bugId, user)
		res.send('OK')
	} catch (err) {
		res.status(400).send(`Couldn't remove bug`)
	}
}

export async function addBug (req, res) {
	const { title, description, severity } = req.body
	const { loginToken } = req.cookies
	
	const user = authService.validateToken(loginToken)
	const bugToSave = { title, description, severity: +severity, createdAt: Date.now(), creator: user }

	if (!user) return res.status(401).send('Not logged in!')

	try {
		const savedBug = await bugService.save(bugToSave, user)
		res.send(savedBug)
	} catch (err) {
		res.status(400).send(err)
	}
}



