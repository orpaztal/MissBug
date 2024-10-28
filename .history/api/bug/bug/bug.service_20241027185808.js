
import { utilService } from '../../../services/util.service.js'
import { loggerService } from "../../../services/logger.service.js"

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const PAGE_SIZE = 4
const bugs = utilService.readJsonFile('./data/bug.json')

async function query(filterBy = {}) {
    var filteredBugs = [...bugs]
    const { title, severity, labels, sortBy, sortDir = 1, pageIdx = 0, creatorId } = filterBy; 

    try {
        if (title) {
            const regExp = new RegExp(filterBy.title, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
	    }
    
        if (severity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.severity)
        }

        if (labels && labels.length > 0) {
            filteredBugs = filteredBugs.filter(bug => 
                bug.labels?.some(label => filterBy.labels.includes(label))
            );
        }

        if (creatorId) {
            filteredBugs = filteredBugs.filter(bug => bug.creator._id === creatorId
            );
        }

        if (sortBy) {
            filteredBugs = filteredBugs.sort((a, b) => {
                let aValue = a[sortBy];
                let bValue = b[sortBy];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return aValue.localeCompare(bValue) * sortDir;
                }

                return (aValue - bValue) * sortDir;
            });
        }

        if (pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return filteredBugs // change to an obj with max pages number
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get bugs...`
    }
}

async function getById(bugsId) {
    try {
        const bug = bugs.find(bug => bug._id === bugsId)
        if (!bug) throw `Couldn't get bug...`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't get bug...`
    }
}

async function remove(bugId, user) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw `Bad bug Id`

        if(!user.isAdmin) {
            if (bugs[idx].creator._id !== user._id)throw `This is not your bug`
        }

        bugs.splice(idx, 1)
        _saveBugs()
    } catch (err) {
        loggerService.error(err)
        throw `Couldn't remove bug`
    }
}

async function save(bugToSave, user) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Bad bug Id`

            if(!user.isAdmin) {
                if (bugs[idx].creator._id !== user._id)throw `This is not your bug`
            }

            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave)
        }
        _saveBugs()
    } catch (err) {
        loggerService.error(err)
        throw `couldn't save bug`
    }
    return bugToSave
}

async function _saveBugs() {
    utilService.writeJsonFile('./data/bug.json', bugs)
}
