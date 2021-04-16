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

     validate(){
        const errors = {}
        if(!this.content || this.content.length < 5){
            errors.content = 'Content to short, min 10 chars'
        }
        if(Object.keys(errors).length == 0) return null
        else return errors
    }
}