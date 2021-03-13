//use cloud function emulator
if(window.location.host.includes("localhost") ||
    window.location.host.includes("127.0.0.1")){
        firebase.functions().useFunctionsEmulator("http://localhost:5001")
    }

import * as Auth from "./controller/auth.js"

Auth.addEventListeners()