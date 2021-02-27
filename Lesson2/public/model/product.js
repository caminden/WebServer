export class Product {
    constructor(data){
        this.name = data.name.toLowerCase();
        this.price = typeof data.price == 'number' ? data.price : Number(data.price);
        this.summary = data.summary;
        this.imageName = data.imageName;
        this.imageURL = data.imageURL;
    }

    serialize(){
        return {
            name: this.name,
            price: this.price,
            summary: this.summary,
            imageName: this.imageName,
            imageURL: this.imageURL,
        }
    }

    validate(image){
        const errors = {}
        if(!this.name || this.name.length < 2){
            errors.name = 'Product name should be min 2 chars'
        }
        if(!this.price || !Number(this.price)){
            errors.price = 'Price is not valid'
        }
        if(!this.summary || this.summary.length < 5){
            errors.summary = 'Summary to short, min 5 chars'
        }
        if(!image){
            errors.image = "Image not selected"
        }
        if(Object.keys(errors).length == 0) return null
        else return errors
    }

    serializeForUpdate(){
        const p = {}
        if(this.name) p.name = this.name
        if(this.price) p.price = this.price
        if(this.summary) p.summary = this.summary
        if(this.imageName) p.imageName = this.imageName
        if(this.imageURL) p.imageURL = this.imageURL
        return p
    }
}