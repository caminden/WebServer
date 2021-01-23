const buttonTag = document.getElementById("button-lucky")

const f1 = firebase.functions().httpsCallable('doSomething')

buttonTag.addEventListener("click", buttonClick)

async function buttonClick(){
    console.log("Button clicked")
    try{
        const n1 = Math.floor(Math.random() * 100)
        const n2 = Math.floor(Math.random() * 100)
        const result = await f1({n1, n2})
        const ret = result.data
        console.log(ret)
        const message = document.getElementById("message")
        message.innerHTML = "n1 = " + n1 + ", n2 = " + n2
        + '<br> ' + "Add: " + ret.add + " Mul " + ret.mul
    }catch(e){

    }
}