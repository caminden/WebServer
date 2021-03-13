import * as Element from "./element.js"

export function popupInfo(title, body, closeModal){
    if(closeModal){
        $("#"+closeModal).modal('hide')
    }

    Element.popupInfoBody.innerHTML = body
    Element.popupInfoTitle.innerHTML = title
    $("#modal-popup-info").modal('show')
    
}