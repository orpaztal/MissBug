
import { userService } from "./user.service.js"

export async function getUsers (req, res) {
	const { fullname, username, score, sortBy, sortDir, pageIdx } = req.query
	const filterBy = { fullname, score: +score, username, sortBy, sortDir: +sortDir, pageIdx: +pageIdx }

	try {
		const users = await userService.query(filterBy)
		res.send(users)
	} catch (err) {
		res.status(400).send(err)
	}
}

export async function getUser (req, res) {
    const { userId } = req.params;

	try {
        const user = await userService.getById(userId);

		res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

export async function updateUser(req, res) {
	const { _id, fullname, username, score } = req.body
	const userToSave = { _id, fullname, username, score: +score }

	try {
		const savedUser = await userService.save(userToSave)
		res.send(savedUser)
	} catch (err) {
		res.status(400).send(err)
	}
}

export async function removeUser (req, res) {
	const { userId } = req.params

	try {
		await userService.remove(userId)
		res.send('OK')
	} catch (err) {
		res.status(400).send(`Couldn't remove user`)
	}
}

export async function addUser (req, res) {
	const { fullname, username, score } = req.body
	const userToSave = { fullname, username, score: +score }

	try {
		const savedUser = await userService.save(userToSave)
		res.send(savedUser)
	} catch (err) {
		res.status(400).send(err)
	}
}



