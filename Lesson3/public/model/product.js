export class Product{
    constructor(data) {
        this.name = data.name.toLowerCase()
        this.price = typeof data.price == 'number' ? data.price : Number(data.price)
        this.summary = data.summary
        this.imageName = data.imageName
        this.imageURL = data.imageURL
    }

    serialize(){
        return {
            name: this.name,
            price: this.price,
            summar: this.summary,
            imageName: this.imageName,
            imageURL: this.imageURL
        }
    }
}