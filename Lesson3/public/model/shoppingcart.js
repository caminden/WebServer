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
        this.saveToLocalStorage()
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
        this.saveToLocalStorage()
    }

    saveToLocalStorage(){
        window.localStorage.setItem(`cart-${this.uid}`, this.stringify())
    }

    stringify(){
        return JSON.stringify({uid: this.uid, items: this.items})
    }

    static parse(cartString){
        if(!cartString) return null
        const obj = JSON.parse(cartString)
        const sc = new ShoppingCart(obj.uid)
        sc.items = obj.items
        return sc
    }
    

    getTotalQty(){
        if(!this.items) return 0
        let n = 0
        this.items.forEach(item => {n += item.qty})
        return n
    }
}