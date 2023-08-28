

const usuario = document.getElementById("usuario")
const botonEntrar = document.getElementById("botonEntrar")


const firebaseConfig = {
    apiKey: "AIzaSyCX4xya-dtj0a_t4faF1fCUTB3dyE6lgqo",
    authDomain: "sala-de-chat-21cab.firebaseapp.com",
    projectId: "sala-de-chat-21cab",
    storageBucket: "sala-de-chat-21cab.appspot.com",
    messagingSenderId: "746854404293",
    appId: "1:746854404293:web:370507cec50f756ee4e0ac",
    measurementId: "G-BHFZD781LX"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let z

firebase.auth().onAuthStateChanged(user =>{
    if (user){
        z = user
        contenidoWeb.innerHTML = `<div>Si logueadon'tn't, chatn'tn't</div>`
        contenidoWeb.innerHTML += `<div>Te has conectado</div>`
        usuario.textContent = user.displayName
        console.log(user)
        accionCerrar()
        status("conectado",z)
    }else{
        contenidoWeb.innerHTML += `<div>Te has desconectado</div>`
        usuario.textContent = "logueadon't"
        console.log(false)
        contenidoWeb.innerHTML = `<div>Si logueadon't, chatn't</div>`
        accionAcceder()
        status("desconectado",z)
    }
})

function status(tipo,usuario){
    if (!usuario){return}
    texto.value = "El usuario " + usuario.displayName + " se ha " + tipo
    firebase.firestore().collection("chat").add({
        texto:texto.value,
        nombre:usuario.displayName,
        uid:usuario.uid,
        fecha:Date.now(),
        mensaje:false
    }).then(res => {
        console.log('texto agregado')
    })
    texto.value = ""
}
const accionAcceder = () => {
    botonEntrar.textContent = "Entrar"
    botonEntrar.addEventListener("click",async()=>{
        const provider = new firebase.auth.GoogleAuthProvider()
        try{
            await firebase.auth().signInWithPopup(provider)
        }catch(error){
            console.log(error)
        }
    })
}

const accionCerrar = () =>{
    botonEntrar.textContent = "Salir"
    botonEntrar.addEventListener("click",()=>firebase.auth().signOut())
}

const formulario = document.getElementById("formulario")

firebase.auth().onAuthStateChanged(user=>{
    if(user){
        formulario.classList = ""
        contenidoChat(user)
    }
    else{
        formulario.classList = "none"
    }
})
const texto = document.getElementById("texto")


function contenidoChat(user){
    formulario.addEventListener("submit",event=>{
        event.preventDefault()
        console.log(texto.value)
        if(!texto.value.trim()){
            return
        }
        firebase.firestore().collection("chat").add({
            texto:texto.value,
            nombre:user.displayName,
            uid:user.uid,
            fecha:Date.now(),
            mensaje:true
        }).then(res => {
            console.log('texto agregado')
        })
        texto.value = ""
    })
    firebase.firestore().collection("chat").orderBy("fecha")
        .onSnapshot(query=>{
            contenidoWeb.innerHTML = ""
            query.forEach(doc=>{
                if ((!doc.data().mensaje) && (!checkAcciones())){
                    return
                }
                if(user.uid === doc.data().uid){
                    if (doc.data().mensaje){
                        contenidoWeb.innerHTML += `<div class = "yo">Mensaje de ${user.displayName}: ${doc.data().texto}</div>`
                    }
                    else{
                        contenidoWeb.innerHTML += `<div class = "yo acciones">${doc.data().texto}</div>`
                    }
                }else{
                    if (doc.data().mensaje){
                        contenidoWeb.innerHTML += `<div>Mensaje de ${doc.data().nombre}: ${doc.data().texto}</div>`
                    }
                    else{
                        contenidoWeb.innerHTML += `<div class = "acciones">${doc.data().texto}</div>`
                    }
                }
                contenidoWeb.scrollTop = contenidoWeb.scrollHeight
            })
        })
} 

const chequearAccionesInput = document.getElementById("deshabilitarAcciones")
function checkAcciones(){
    if (chequearAccionesInput.checked){
        return true
    }
    else{return false}
}