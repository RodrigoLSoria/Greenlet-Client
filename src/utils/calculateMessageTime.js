function calculateMessageTime(timeOfMessage) {
    const messageDate = new Date(timeOfMessage)
    const today = new Date()
    const timeDifference = today - messageDate

    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60))

    if (hoursDifference < 1) {
        return '1h'
    } else if (hoursDifference < 24) {
        return hoursDifference + 'h'
    } else if (hoursDifference < 48) {
        return '1d'
    } else {
        const daysDifference = Math.floor(hoursDifference / 24)
        return daysDifference + 'd'
    }
}
export default calculateMessageTime


