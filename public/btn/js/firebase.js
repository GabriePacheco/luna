
/** Inicializacion de App Firebase **/ 

 var firebaseConfig = {
    apiKey: "AIzaSyAFZ0V3epQRnqXpzN8pkpcJesfZu-xVWlg",
    authDomain: "lunytha-0.firebaseapp.com",
    databaseURL: "https://lunytha-0.firebaseio.com",
    projectId: "lunytha-0",
    storageBucket: "lunytha-0.appspot.com",
    messagingSenderId: "620792262555"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const base = firebase.database();
//***//
/** inicia sesion en firebase*/
var enviarLogin = function (callbak){
	auth.signInWithEmailAndPassword( $("#login_email").val() , $("#login_password").val() )
	.then(function (user){
		let sesion = {}
		let inlineUid =user.user.uid
		base.ref("users/" + user.user.uid).once("value")
		.then(function (snap){
			if (snap.val().rol >= 4){
				sesion.estado = true;
				sesion.mensaje = "La sesion se a iniciado con exito! "
			}else{
				sesion.estado = false;
				sesion.mensaje = "El usuario no tiene autorización para ingresar a la esta pagina! ";
				auth.signOut();
			}
			callbak(sesion);
		})
	})
	.catch(function (error){
		let sesion = {}
		sesion.estado = false;
		switch (error.code){
			case "auth/wrong-password":
				sesion.mensaje = "La contraseña es invalida o el usuario no tiene una contraseña";

			break;
			case "auth/user-not-found":
				sesion.mensaje = "El correo electronico ingresado no es correcto o fue borrado";
			break;
		}
		callbak(sesion)
	})
	
}
/***/
/**Comprueba cambio de contraseña*/
var changePassword = function (callbak){
	let change ={}
	auth.sendPasswordResetEmail($("#resetPassword_email").val())
	.then(function (){
		change.estado = true;
		change.mensaje= "Se envio un correo electronico para cambiar la contraseña."
		callbak(change)

	})
	.catch(function (error){
		change.estado = false;
		switch(error.code){
			case "auth/invalid-email":
				change.mensaje = "La dirección de correo ingresada no es valida.";
			break;
			case "auth/user-not-found":
				change.mensaje = "No se encontro un usuario con esta dirección de correo electrónico.";
			break;			
		}
		callbak(change);
	})
	

}

auth.onAuthStateChanged(function (user){
	if (user){
		navegar("home");
	}else{
		navegar("home")

	}
});

/****/

/***Escucha Cambios en usuarios***/
base.ref("users").on("value", function (snap){
	totalUsuarios(snap.numChildren())

})
/****/
/**Buscar Usuarios**/
var buscarUsuarios = function (limite, nombre, filtro){
	$("#tbody").html("")
	base.ref("users").on("value", function (snap){
		let x =0;
		snap.forEach((item) => {
			x++;
			let print ='<tr><td>'+ x +'</td>'
			print+= '<td>'+item.val().uid.substr(0,10)+'... </td>';		
			print+= '<td><img width ="100%" src="' +item.val().photoURL+'" class="responsive-img circle"></td>';
			print+= '<td>' +item.val().nombre+'</td>';
			print+= '<td>' +item.val().email+'</td>';
			print+= '<td>' + roles(item.val().rol) +'</td>';
				print+= '<td>' +item.val().rol+'</td>';
			print+="</tr>";
			$("#tbody").append(print)
	  
		})
	})
}

/******/
