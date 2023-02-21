import { CATEGORIES } from './constants/categories';

const getEmptyStats = () => {
    let newStats = {}
    for (let prop in CATEGORIES.attributes) {
        newStats[prop] = 0
    }
    for (let prop in CATEGORIES.elements) {
        newStats[prop] = 0
    }
    for (let prop in CATEGORIES.weapons) {
        newStats[prop] = 0
    }
    newStats.RemainingPoints = 327
    return newStats
}
export { getEmptyStats }