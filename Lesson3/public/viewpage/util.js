import * as Element from "./element.js"

export function popupInfo(title, body, closeModal){
    if(closeModal){
        $("#"+closeModal).modal('hide')
    }

    Element.popupInfoBody.innerHTML = body
    Element.popupInfoTitle.innerHTML = title
    $("#modal-popup-info").modal('show')
    
}

export function disableButton(button){
    button.disabled = true
    const label = button.innerHTML
    button.innerHTML = "Wait..."
    return label
}

export function enableButton(button, label){
    if(label) button.innerHTML = label
    button.disabled = false
}

export function currency(money){
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(money)
}