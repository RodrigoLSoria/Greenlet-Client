function groupMessagesByDate(messages, setConversationDate) {
    const groups = []
    let lastDate = null
    messages.forEach(message => {
        const messageDate = setConversationDate(message.timestamp)
        if (messageDate !== lastDate) {
            lastDate = messageDate
            groups.push({ date: messageDate, messages: [message] })
        } else {
            groups[groups.length - 1].messages.push(message)
        }
    })
    return groups
}

export default groupMessagesByDate
