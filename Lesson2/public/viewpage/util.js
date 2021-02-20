import * as Element from './element.js'

export function popupInfo(title, body, closeModel){
    if(closeModel) {
        $('#' + closeModel).modal('hide')
    }

    Element.popupInfoTitle.innerHTML = title
    Element.popupInfoBody.innerHTML = body
    $('#modal-popup-info').modal('show')
}