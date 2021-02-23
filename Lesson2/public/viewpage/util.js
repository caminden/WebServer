import * as Element from './element.js'

export function popupInfo(title, body, closeModel){
    if(closeModel) {
        $('#' + closeModel).modal('hide')
    }

    Element.popupInfoTitle.innerHTML = title
    Element.popupInfoBody.innerHTML = body
    $('#modal-popup-info').modal('show')
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