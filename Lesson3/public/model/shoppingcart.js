export class ShoppingCart{
    constructor(uid) {
        this.uid = uid
        this.items //array of serialized product objects
    }

    addItem(product){
        if(!this.items) this.items = []

        const item = this.items.find(element => {return product.docId == element.docId})
        
        if(item){
            ++product.qty
            ++item.qty
        }
        else{
            //new item
            product.qty = 1
            const newItem = product.serialize()
            newItem.docId = product.docId
            this.items.push(newItem)
        }
    }

    removeItem(product){
        //decrement qty or remove item from shoppingcart
        const index = this.items.findIndex(element => {return product.docId == element.docId})

        if(index >= 0){
            --this.items[index].qty
            --product.qty
            if(product.qty == 0){
                this.items.splice(index, 1)
            }
        }
    }
}