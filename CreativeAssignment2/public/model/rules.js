export class Rules{
    constructor(data) {
        this.title = data.title
        this.content = data.content
    }

    serialize(){
        return {
            title: this.title,
            content: this.content,
        }
    }
}