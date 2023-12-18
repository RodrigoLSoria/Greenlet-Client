const getTimeDifferenceInHours = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const differenceInMilliseconds = now - postDate
    return differenceInMilliseconds / (1000 * 60 * 60)
}

const formatDate = (date) => {
    const hoursDifference = getTimeDifferenceInHours(date)

    if (hoursDifference < 1) {
        return 'Just now'
    } else if (hoursDifference < 24) {
        return `${Math.floor(hoursDifference)}h ago`
    } else if (hoursDifference < 168) {
        return `${Math.floor(hoursDifference / 24)} day(s) ago`
    } else {
        const postDate = new Date(date)
        return `${postDate.getDate()}/${postDate.getMonth() + 1}`
    }
}

export default formatDate
