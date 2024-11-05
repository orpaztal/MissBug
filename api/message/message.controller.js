import { loggerService } from '../../services/logger.service.js'
import { messageService } from './message.service.js'

export async function getMessages(req, res) {
	try {
		const messages = await messageService.query(req.query)
		res.send(messages)
	} catch (err) {
		loggerService.error('Cannot get messages', err)
		res.status(400).send({ err: 'Failed to get messages' })
	}
}

export async function deleteMessage(req, res) {
    const { id: messageId } = req.params
    
	try {
		const deletedCount = await messageService.remove(messageId)
		if (deletedCount === 1) {
			res.send({ msg: 'Deleted successfully' })
		} else {
			res.status(400).send({ err: 'Cannot remove message' })
		}
	} catch (err) {
		loggerService.error('Failed to delete message', err)
		res.status(400).send({ err: 'Failed to delete message' })
	}
}

export async function addMessage(req, res) {
	var { loggedinUser, body: message } = req

	try {
		message.byUserId = loggedinUser._id
		const newMessage = await messageService.add(message)

		res.json(newMessage)
	} catch (err) {
		loggerService.error('Failed to add message', err)
		res.status(400).send({ err: 'Failed to add message' })
	}
}
