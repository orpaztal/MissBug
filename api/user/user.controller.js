
import { userService } from "./user.service.js"
import { loggerService } from "../../services/logger.service.js"

export async function getUsers (req, res) {
	const { fullname, username, score, sortBy, sortDir, pageIdx } = req.query
	const filterBy = { fullname, score: +score, username, sortBy, sortDir: +sortDir, pageIdx: +pageIdx }

	try {
		const users = await userService.query(filterBy)
		res.send(users)
	} catch (err) {
		loggerService.error('Failed to get users', err)
		res.status(400).send(err)
	}
}

export async function getUser (req, res) {
    const { id } = req.params;

	try {
        const user = await userService.getById(id);

		res.send(user);
    } catch (err) {
		loggerService.error('Failed to get user', err)
        res.status(400).send(err);
    }
};

export async function updateUser(req, res) {
	const { _id, fullname, username, score } = req.body
	const userToSave = { _id, fullname, username, score: +score }

	try {
		const savedUser = await userService.update(userToSave)
		res.send(savedUser)
	} catch (err) {
		loggerService.error('Failed to update user', err)
		res.status(400).send(err)
	}
}

export async function removeUser (req, res) {
	const { id } = req.params

	try {
		await userService.remove(userId)
        res.send({ msg: 'Deleted successfully' })
	} catch (err) {
		loggerService.error('Failed to delete user', err)
		res.status(400).send(`Couldn't remove user`)
	}
}

export async function addUser (req, res) {
	const { fullname, username, score } = req.body
	const userToSave = { fullname, username, score: +score }

	try {
		const savedUser = await userService.add(userToSave)
		res.send(savedUser)
	} catch (err) {
		loggerService.error('Failed to add user', err)
		res.status(400).send(err)
	}
}



