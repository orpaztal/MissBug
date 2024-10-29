
import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    save,
    remove,
}

const PAGE_SIZE = 2
const users = utilService.readJsonFile('./data/user.json')

async function query() {
    return users
}

async function getById(usersId) {
    try {
        const user = users.find(user => user._id === usersId)

        if (!user) throw `Couldn't get user...`
        return user
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get user...`
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Bad user Id`

        users.splice(idx, 1)
        _saveUsers()
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't remove user`
    }
}

async function save(user) {
    // try {
    //     if (userToSave._id) {
    //         const idx = users.findIndex(user => user._id === userToSave._id)
    //         if (idx === -1) throw `Bad user Id`

    //         users.splice(idx, 1, userToSave)
    //     } else {
    //         userToSave._id = utilService.makeId()
    //         users.push(userToSave)
    //     }
    //     _saveUsers()
    // } catch (err) {
    //     loggerService.error(err)
    //     throw `couldn't save user`
    // }
    // return userToSave

    try {
        user._id = utilService.makeId()
        user.score = 10000
        user.createdAt = Date.now()
        if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
        
        users.push(user)
    
        _saveUsers()
        return user
    } catch (err) {
        loggerService.error('userService[save] : ', err)
        throw err
    }
}

async function _saveUsers() {
    utilService.writeJsonFile('./data/user.json', users)
}
