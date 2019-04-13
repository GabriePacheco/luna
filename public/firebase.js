// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAFZ0V3epQRnqXpzN8pkpcJesfZu-xVWlg",
    authDomain: "lunytha-0.firebaseapp.com",
    databaseURL: "https://lunytha-0.firebaseio.com",
    projectId: "lunytha-0",
    storageBucket: "lunytha-0.appspot.com",
    messagingSenderId: "620792262555"
  };
  firebase.initializeApp(config);
  var base = firebase.database();
  var auth = firebase.auth();
  var storage = firebase.storage();
  var userInline ={}
	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
		
		  	userInline.uid= user.uid;
		  	userInline.email = user.email;
		  	userInline.foto = user.photoURL;	
		  	userInline.nombre = user.displayName;
				
				if (user.providerData[0].providerId == "password" ){
				    if (!user.emailVerified){
				    	location.hash="#registroMensaje";
				    }else{
				    	if (!user.photoURL){
				    		location.hash ="#registroFoto"
				    	}else{
				    		if (!userInline.nombre){
				    			location.hash ="#registroNombre"	
				    		}else{
				    			cargarPerfil();
				    			location.hash= "#home"
				    			

				    		}
				    	}
				    }
				}else{
					if (user.providerData[0].providerId == "facebook.com" ){
						var userFacebookR = base.ref("users/" + userInline.uid)
						userFacebookR.once("value", function (usuario){
							var faceUser = (usuario.val() ) || false;
							if (!faceUser){
								userFacebookR.set({
									uid: userInline.uid,
									nombre: userInline.nombre,
									photoURL: 	userInline.foto,
									email: userInline.email
								})
								location.hash= "#registroNombre"
								$("#nombreRegistroNombre").val(userInline.nombre);
							}else{
								if (!usuario.val().rol){
									$("#nombreRegistroNombre").val(userInline.nombre);
									location.hash= "#registroNombre"
								}else{
									cargarPerfil();
									location.hash= "#home"
									
								}
							}

						})
						

					}
				}
				
		 }else{
		 	 location.hash="#login";
		}
	});

var registrarFotoUsuario = function (snap, callback){

	var nfotoUsuario = storage.ref("imagenes/users/perfil/" + userInline.uid + "png")
	nfotoUsuario.put(snap.file)
	.then(function (){

		nfotoUsuario.getDownloadURL()
		.then((URL)=>{
			auth.currentUser.updateProfile({
              photoURL : URL
            })

	        base.ref("users/" +userInline.uid  ).update({
	          uid :userInline.uid,
	          email: userInline.email,
	          photoURL: URL
	        });	
	    callback(URL);
		})

		
	});


} 

var registrarNombre = function (callback){
	if ($("#tokenRegistroNombre").val() == ""){ 
		 auth.currentUser.updateProfile({
			displayName: $("#nombreRegistroNombre").val()
		});
		 if ($("#estudiantesRegistroNombre").val() != ""){
			    base.ref("users/" +userInline.uid).update({
					alumnos: $("#estudiantesRegistroNombre").val()
				})
		}
	    base.ref("users/" +userInline.uid).update({
		  nombre: $("#nombreRegistroNombre").val(),
		  rol: $("#rolUsuarioRegistro").val() 
		})
		.then((e)=>{
			auth.currentUser.updateProfile({
				displayName: $("#nombreRegistroNombre").val()
			})
			callback(e);
		})
	}else{
		base.ref("tokens/" + $("#tokenRegistroNombre").val()).once('value')
		.then(function (token){
			var estado = (token.val() && token.val().estado ) || false;
			if (!estado){
				mensajeria ({code: "auth/token-invalido"})
			}else{
				    base.ref("users/" +userInline.uid).update({
						  nombre: $("#nombreRegistroNombre").val(),
						  rol: $("#rolUsuarioRegistro").val() 
						})
						.then((e)=>{
							auth.currentUser.updateProfile({
								displayName: $("#nombreRegistroNombre").val()
							})
							callback(e);
					})
					base.ref("tokens/" + $("#tokenRegistroNombre").val()).update({
						estado: false,
						usuario:userInline.uid
					})
					callback();
			}

		})
	}


}


var recuperarPass= function (callback){
	auth.sendPasswordResetEmail($("#emailRecuperar").val())
	.then(function(e) {
			callback();
			mensajeria({code: "auth/mail-enviado"})
			location.hash = "#recuperarMensaje"
 	
	})
	.catch(function(error) {
			callback();
			mensajeria(error)
			console.log(error)
 	
	})
}

var loginCon = function(prov, callback){
	if (prov == "facebook"){
		var provider = new firebase.auth.FacebookAuthProvider();
		
		firebase.auth().signInWithRedirect(provider)
		.then((result)=>{	
			cargarPerfil();
			location.hash= "#home"
			callback(result);
		})
		.catch(function (error){
			mensajeria(error)

		})
		
	}
}

var cargarPerfil = function (){

	$("#imagenPerfil").attr("src",userInline.foto)
	$("#nombrePerfil").html(userInline.nombre)
	$("#emailPerfil").html(userInline.email)
	

	$("#nombreEPerfil").val(userInline.nombre)
	$("#nombrePerfil").html(userInline.nombre)

	$("#imagenEPerfil").attr("src",userInline.foto)

	$("#imagenUserPost").attr("src",userInline.foto)
	$("#nombreUserPost").html(userInline.nombre)

	var userPresensia = document.createElement("div");
	userPresensia.setAttribute("class", "row valign-wrapper")
	let  presensiaFoto = document.createElement("div")
	presensiaFoto.setAttribute("class", "col s2");
	presensiaFoto.innerHTML= `<img class="responsive-img circle" src="${userInline.foto}">` ;
	userPresensia.appendChild(presensiaFoto);
	let presensiaNombre = document.createElement("div")
	presensiaNombre.setAttribute("class", "col s10");
	presensiaNombre.innerHTML= userInline.nombre + `<br><span class="optional"></span>`;
	userPresensia.appendChild(presensiaNombre);
	userPresensia.id ="UserInlinePresensiaPostNuevo" ;
	$("#addPost .contenido").prepend(userPresensia);
	$("#addPost .optional").html("Publico");
	

	 base.ref("users/" + userInline.uid ).on("value", function (datos){
	 	userInline.rol= datos.val().rol
		$("#rolEPerfil").val(datos.val().rol);
		
		$("#rolEPerfil option[value = "+datos.val().rol+"]").attr("selected", "selected")
		userInline.rol=datos.val().rol;
		testPermisos((es)=>{
			if (es){
				$("#botonPost").removeClass("hide")
			}else{
				$("#botonPost").addClass("hide")
			}
		})

	 	switch(datos.val().rol) {
		  case "1":
		    	$("#rolPerfil").html("Alumno");
		    	console.log(datos.val().rol)
		    break;
		  case "2":
		 		  $("#rolPerfil").html("Representante");
		 		  console.log(datos.val().rol)
		    break;

		   case "3":
		 		  $("#rolPerfil").html("Profesor");
		 		 
		    break;
   		  case "4":
		 		  $("#rolPerfil").html("Administrador");
		 		  console.log(datos.val().rol)
		    break;
   		  case "5":
		 		  $("#rolPerfil").html("Desarollador");
		 		  console.log(datos.val().rol)
		    break;
		  default:
 				$("#rolEPerfil").val(datos.val().rol);
 				console.log(datos.val().rol)	   
		}

		if (datos.val().biografia){
			$("#biografiaPerfil").html(datos.val().biografia)	
			$("#biografiaEPerfil").val(datos.val().biografia)
			  M.textareaAutoResize($("#biografiaEPerfil"));
			  	M.updateTextFields()
		}else{
			$("#biografiaPerfil").html("<p> No has ingresado auna biografía </p>");
		}
		if (datos.val().estudiantes){
			$("#estudiantesEPerfil").val(datos.val().estudiantes)
			$("#portaEstudiantes").removeClass("hide");
		}
		M.updateTextFields()
	}) 	
}

var editarUsuario = function (callback) {
	switch ($("#rolEPerfil").val()){
		case "1"://Es estudiante 
			base.ref("users/" + userInline.uid)
			.update({
				nombre: $("#nombreEPerfil").val(),
				biografia: $("#biografiaEPerfil").val(),
				rol: $("#rolEPerfil").val(),
				estudiantes: false
			})
			.then(function (e){
				auth.currentUser.updateProfile({
					displayName: $("#nombreEPerfil").val(),
				})
				callback({code: "base/saveOK"})
			})

		break;
		case "2":// Es padre de familia 
			base.ref("users/" + userInline.uid)
			.update({
				nombre: $("#nombreEPerfil").val(),
				biografia: $("#biografiaEPerfil").val(),
				rol: $("#rolEPerfil").val(),
				estudiantes: $("#estudiantesEPerfil").val()
			})
			.then(function (e){
				auth.currentUser.updateProfile({
				displayName: $("#nombreEPerfil").val(),
				})
				callback({code: "base/saveOK"});
			})
		break;
		case "3": // Es profesor 

			if ($("#tokenEPerfil").attr("required") == "required"){
				base.ref().child("tokens" + $("tokensEPerfil").val() ).once("value", function(token){
					let tok = (token.val() && token.val().estado) || false;
					if (tok){
						base.ref("users/" + userInline.uid)
						.update({
							nombre: $("#nombreEPerfil").val(),
							biografia: $("#biografiaEPerfil").val(),
							rol: $("#rolEPerfil").val(),
							estudiantes: false
						})
						.then(function (e){
							callback({code: "base/saveOK"})
							auth.currentUser.updateProfile({
								displayName: $("#nombreEPerfil").val(),
							})
						})
						base.ref().child("tokens/" + $("#tokenEPerfil").val())
						.update({
							estado: false,
							usuario: userInline.uid
						})
					}else{
						mensajeria({code: "auth/token-invalido"})
						callback({code: "auth/token-invalido"})
					}

				})
			}else{
			base.ref("users/" + userInline.uid)
				.update({
					nombre: $("#nombreEPerfil").val(),
					biografia: $("#biografiaEPerfil").val(),
					rol: $("#rolEPerfil").val(),
					estudiantes: false
				})
				.then(function (e){
					auth.currentUser.updateProfile({
						displayName: $("#nombreEPerfil").val(),
					})
					callback({code: "base/saveOK"})
				})
			}
		break;
	}
}
var testPermisos = function (callback){
	base.ref("config/")
	.once("value", function (estatus){
		var permisos = (userInline.rol >= estatus.val().perfil )
		
		callback(permisos);
	})
}

var subirPost = async function (callbaks){
	let myPost = {}
	let peso = 0
	if (nPost.imagenes){
		for (let ci =0; ci < nPost.imagenes.length; ci++){
			peso += nPost.imagenes[ci].size
		}
	}
	if (nPost.files){
		for (let ci =0; ci < nPost.files.length; ci++){
			peso += nPost.files[ci].size
		}
	}
	
	myPost.id = await base.ref().child("posts").push().key
	myPost.authorId = userInline.uid
	myPost.autorName =userInline.nombre;
	myPost.autorFoto =userInline.foto;
	myPost.fecha = firebase.database.ServerValue.TIMESTAMP;
	if (nPost.texto){
		myPost.texto = nPost.texto;
	}
	if (nPost.color){
		myPost.color = nPost.color;
	}
	if (nPost.imagenes){
		for (let ci =0; ci < nPost.imagenes.length; ci++){
			if (!myPost.imagenes){
				 myPost.imagenes =[]
			}
			var urlnImagen = await suirAdjuntos("imagenes/posts/"+ myPost.id, nPost.imagenes[ci], mt()+".png" )
			myPost.imagenes.push(urlnImagen);
		}

	}
	if (nPost.files){
		for (let ca =0; ca < nPost.files.length; ca++){
			if (!myPost.files){
				 myPost.files =[]
				 myPost.filesName =[]
			}
			var urlnFiles = await suirAdjuntos("archivos/posts/"+ myPost.id, nPost.files[ca], nPost.files[ca].name)
			myPost.files.push(urlnFiles);
			myPost.filesName.push(nPost.files[ca].name);
		}

	}
	
	var updates = {}
	updates["/posts/" + myPost.id]= myPost;
	return base.ref().update(updates)
	.then(function (){
		callbaks();
	})

	
		

}


var suirAdjuntos = async function (ruta, archivo, referencia ){
	let  up = storage.ref().child(ruta + "/"+ referencia);
	return up.put(archivo)
	.then( function (){
		return up.getDownloadURL()
		.then(function (url){
			return url
		})
	})

}

///Escuchar cambios en los post 
base.ref().child("posts/").on("child_added", function (pub){
	if (pub.val()){
		dibujarPublicacion(pub.val());
	}
})


var  borrar = function (publicacionId){

	testPermisos(function (permiso){
		if (permiso){
			base.ref().child("posts/" + publicacionId).remove()
			.then(function (m){
				$("#P" + publicacionId).remove()
			});

		}

	});
}

var consultarPublicacion = function (id, callback){
	 base.ref().child("posts/" + id ).once("value", function (pub){
		if (pub.val()){
			let pp = {}
				 pp = pub.val();
				 callback(pp)
			
		}
	})

}