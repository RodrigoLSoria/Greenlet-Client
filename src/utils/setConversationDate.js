function setConversationDate(timestamp) {
    const messageDate = new Date(timestamp)
    const today = new Date()
    const diffInDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24))

    if (diffInDays <= 6) {
        const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
        return daysOfWeek[messageDate.getDay()]
    } else {
        return messageDate.toLocaleDateString("es-ES")
    }
}

export default setConversationDate