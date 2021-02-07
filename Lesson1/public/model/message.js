export class Message{
    constructor(data){
        this.threadID = data.threadID
        this.uid = data.uid
        this.email = data.email
        this.timestamp = data.timestamp
        this.content = data.content
    }

    serialize(){
        return {
            threadID: this.threadID,
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content
        }
    }
}

    