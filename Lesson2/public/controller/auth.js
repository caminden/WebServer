import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'

export function addEventListeners(){

    Element.formSignin.addEventListener('submit', async e =>{
        e.preventDefault();
        const email = Element.formSignin.email.value
        const password = Element.formSignin.password.value

        try{
            await FirebaseController.signIn(email, password)
            $("#modal-form-signin").modal('hide')
        }catch(e){
            if(Constant.DEV) console.log(e)
            Util.popupInfo("Sign in error", JSON.stringify(e), "modal-form-signin")
        }
    })

    Element.menuButtonSignout.addEventListener('click', async () =>{
        try{
            await FirebaseController.signOut()
        }
        catch(e){
            if(Constant.DEV) console.log(e)

        }
    })

}