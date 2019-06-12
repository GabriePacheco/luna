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
  var userPresensia ;
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey("BG1OIJl6E9nqJMq--PCXiMzzdKY9Eu8AMY57Kxuswa0QM_GpJE3H4DH4aD7y4ANSdI_gfhoKFY0JF6ktYQoEsNw");
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
				    			notificaciones()
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
									userInline.uid= user.uid;
								  	userInline.email = user.email;
								  	userInline.foto = user.photoURL;	
								  	userInline.nombre = user.displayName;
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
            .then(function (){
            	userInline.foto=URL
            })
	        base.ref("users/" +userInline.uid  ).update({
	          uid :userInline.uid,
	          email: userInline.email,
	          photoURL: URL
	        })
	        .then(callback(URL))	
	    	
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
			.then(function (){
				userInline.nombre = $("#nombreRegistroNombre").val()

				callback(e)
			})
		
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
							.then(function (){
								userInline.nombre = $("#nombreRegistroNombre").val()	
								callback(e)
							})
							
					})
					base.ref("tokens/" + $("#tokenRegistroNombre").val()).update({
						estado: false,
						usuario:userInline.uid
					})
					/*callback();*/
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



	userPresensia = `<div class='row valign-wrapper'>`
	userPresensia+= `<div class='col s2'>`
	userPresensia+= `<img class="responsive-img circle" src="${userInline.foto}">`
	userPresensia+= `</div>`
	userPresensia+= `<div class='col s10'>`
	userPresensia+= `${userInline.nombre}` 
	userPresensia+= `<br><span class='optional'></span>` 
	userPresensia+= `</div>`;
	userPresensia+= `</div>`;
	$("#addPost .contenido").prepend(userPresensia);
	$("#addPost .optional").html("Público");
	$("#editPost .contenido ").prepend(userPresensia);
	$("#editPost .optional").html("Público");
	base.ref().child("config/").on("value", function (conf){
		$(".historias").html("")
		if (conf.val().historias === true ){
			$(".historias").append(`<div class='center-align history' data-id="myHistory" onclick = 'verHistorias.init("${userInline.uid}")'><div class='col s12  hide-on-med-and-up '>
								<img src="${userInline.foto}"  class= "responsive-img circle " width="100%">
							<small>Tu historia</small> </div>
							<div class='col m12 hide-on-small-only' >
								<div class="col m4"> <img src="${userInline.foto}"  class= "responsive-img circle " width="100%"> </div>	
								<div class='col m8 left-align' >Tu historia <small class='text-grey'> </small></div>
							</div>							
						</div>`)

			historiasNuevas()
		}else{
			$(".historias").html("")
		}

	})
	

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
			$("#biografiaPerfil").html("<p> No has ingresado una biografía </p>");
		}
		if (datos.val().alumnos){
			$("#estudiantesEPerfil").val(datos.val().alumnos)
			$("#portaEstudiantes").removeClass("hide");
		}

		 base.ref().child("/albumes/" + datos.val().uid).limitToLast(12).on("value", function(album){
		 	$("#albumPerfil").html("")
		 	album.forEach((item)=>{
		 		let foto = `<div class='col s4 fotoAlbum materialboxed hoverable' id ="Album${item.key}">
		 						<div class='col s12 '><img src='${item.val().archivo}' class="responsive-img " width="100%"></div>
		 						<a class="col s12" onClick ="borrarAlbum('${item.key}')"><i class='material-icons'>delete</i> </a>
		 				   </di>`
		 			$("#albumPerfil").append(foto)
		 			 var elems = document.querySelectorAll('.materialboxed')
		 			 M.Materialbox.init(elems);
		 	})

		 })

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
				alumnos: $("#estudiantesEPerfil").val()
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
			var urlnImagen = await suirAdjuntos("imagenes/posts/"+ myPost.id, nPost.imagenes[ci], mt2()+".png" )
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


base.ref().child("posts/").orderByKey().limitToLast(limite).once("value", function (publicaciones){
	if (publicaciones.val()){
		publicaciones.forEach((item) => {
			  let pubs = item.val()		  
			  base.ref().child("users/" + item.val().authorId )
			  .once("value", function(usuario){
			  	pubs.autorName = usuario.val().nombre
				pubs.autorFoto = usuario.val().photoURL
				
				dibujarPublicacion(pubs, "carga");
			  })
		})	
	}
})

var bajarPost = function (){
	base.ref().child("posts/").orderByKey().limitToLast(limite).once("value", function (publicaciones){
		if (publicaciones.val()){
			publicaciones.forEach((item) => {
				  let pubs = item.val()		  
				  base.ref().child("users/" + item.val().authorId )
				  .once("value", function(usuario){
				  	pubs.autorName = usuario.val().nombre
					pubs.autorFoto = usuario.val().photoURL
					
					dibujarPublicacion(pubs, "bajar");
				  })
			})	
		}
	})
}
base.ref().child("posts/").limitToLast(1).on("child_added", function (pub){
	if (pub.val()){
		let pubs = pub.val();
		base.ref().child("users/" + pub.val().authorId )
		.once("value", function (usuario){
			pubs.autorName = usuario.val().nombre
			pubs.autorFoto = usuario.val().photoURL			
			dibujarPublicacion(pubs, "add");
		})
	}
})

///Escuchar cambios en los post 
base.ref().child("posts/").on("child_changed", function (pub){
	if (pub.val()){
		let pubs = pub.val();
		base.ref().child("users/" + pub.val().authorId )
		.once("value", function (usuario){
			pubs.autorName = usuario.val().nombre
			pubs.autorFoto = usuario.val().photoURL
			dibujarPublicacion(pubs, "change");
		})
	}
})
base.ref().child("posts/").on("child_removed", function (pub){
	$("#P" + pub.val().id).remove() 
})

var  borrar = function (publicacionId){

	testPermisos(function (permiso){
		if (permiso){
			base.ref().child("posts/" + publicacionId).remove()
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

var savePost = async function (callback){
	if (edPost.imagenes){
		for (let spI = 0; spI < edPost.imagenes.length; spI++ )	{
			if (edPost.imagenes[spI].split(":")[0] != "https"){
				
				console.log("cambiando imagen:  " + spI )
				let archivo = await URLtoBlob(edPost.imagenes[spI]);
				let nURLimagen = await suirAdjuntos("imagenes/posts/"+edPost.id, archivo, mt2()+".png" )
				edPost.imagenes[spI] = nURLimagen;
			}
		}
	}
	if (edPost.files){
		for (let spf = 0; spf < edPost.files.length; spf++ )	{
			if(edPost.files[spf].type){		
				let nURLarchivo = await suirAdjuntos("archivos/posts/"+edPost.id, edPost.files[spf], edPost.files[spf].name)
				edPost.files[spf]= nURLarchivo;
			}
		}
	}
	
	let updates = {}
	updates["/posts/" + edPost.id]= edPost;
	return base.ref().update(updates)
	.then(function (){
		callback();
	})
}
var toLike = function (id, callback){
	let refLikes  = base.ref("likes/" + id );
	refLikes.child(userInline.uid).once("value", function (snap){
		let isLiked = (snap && snap.val()) || false;
		if (!isLiked){
			refLikes.child(userInline.uid).update({
				fecha: mt()

			})
		}else{
			refLikes.child(userInline.uid).remove()
		}
		callback(!isLiked)
	})
	
}
var toLisentLikes = function (pid, callback){
	let likesCount = base.ref().child("likes/" + pid);
	likesCount.on("value", function (snap){
		let cont = 0;
		let likeTome= false;
			snap.forEach((item) => {
				if (userInline.uid == item.key){
				 likeTome= true;
				}
			cont++;
			})
		callback(cont, likeTome)	
	})

}

var subirComentario = function(publicacionId , comentario, callback){
	let refComentarios = base.ref("comentarios/" + publicacionId);
	let nuComentarioId = refComentarios.push().key;
	refComentarios.child("/"+nuComentarioId).set({
		userId: userInline.uid,
		comentario: comentario, 
		fecha: mt(), 
		id: nuComentarioId
	})	
	.then(function (){
		callback()
	})

}

var cargarComentarios =function (publicacionId, callback){
	let refComentarios = base.ref("comentarios/" + publicacionId);
	refComentarios.on("value", function (comentarios){
		let totalComentarios = 0
		comentarios.forEach((com)=>{
			totalComentarios++
			let come = com.val()
			
			base.ref().child("users/" + com.val().userId ).once("value", function (autor){
				come.autorNombre = autor.val().nombre
				come.autorFoto =  autor.val().photoURL
				dibujarComentarios(come, publicacionId)
			})

		})
		callback(totalComentarios);
	})
}
var buscarPost = function(id, callback){
	base.ref().child("posts/" + id).once("value", function (publicacion){
		let publis= publicacion.val()
		base.ref().child("users/" + publicacion.val().authorId ).once("value", function (uu){
			publis.userName = uu.val().nombre
			publis.userFoto = uu.val().photoURL
		})
		.then(()=>{
			if (callback){
			 callback(publis)
			}
		})
		
	})
}

var buscarUsuario = function (id, callback){
	base.ref().child("users/" + id).once("value", function (us){
		let usC=us.val()
		 base.ref().child("/albumes/" + us.val().uid).limitToLast(12).once("value", function (archivos){
		 	archivos.forEach((item) => {
		 	 if (!usC.album  ){
		 	 	usC.album=[];
		 	 }		 	
		 	 usC.album.push(item.val().archivo)
		 	})
		 		 callback(usC)
		})
	
	})

}
var addHistoria =  async function (file, callback){

	let historia = base.ref("/historias/")
	let nId = historia.push().key
	let albumes =  base.ref().child("/albumes/" + userInline.uid+"/"+nId+"/")
	
	let url = await suirAdjuntos("imagenes/historias/" + userInline.uid+ "/"  , file, nId+".png" )
	historia.child(nId).set({
		id: nId,
		userId: userInline.uid,
		archivo: url,
		fecha: mt()

		
	})
	.then((e)=>{
		callback(e)
	})
	albumes.set({
		id: nId,
		userId: userInline.uid,
		archivo: url,
		fecha: mt()
	})

}

var historiasNuevas = function(){
	let fecha = new Date() 
	let nows = Math.floor(fecha.setDate(fecha.getUTCDate()-2 )) 	
	let historias = base.ref("historias/").orderByChild("fecha").startAt(nows).on("value", function (his){
		
		his.forEach((laHistoria)=>{
			let hisautor = laHistoria.val()				
			base.ref("users/"+ hisautor.userId).once("value", function (snapUser){				
				hisautor.imagen = snapUser.val().photoURL
				hisautor.nombre = snapUser.val().nombre .split (" ")[0];
				if (userInline.uid != snapUser.val().uid){
					dibujarHistoriaNueva(hisautor);
				}
			})

		})		
	})
	 base.ref("historias/").orderByChild("fecha").startAt(nows).on("child_removed", function (snapshot){
	 	
	 	buscarHistorias(snapshot.val().userId, function (quedan){
				if (quedan == null){
					$("div[data-id='"+snapshot.val().userId+"']").remove()
				}
	 	} )
	 })
	
}


var buscarHistorias =  async function (i,callback){
	base.ref("historias/").orderByChild("userId").equalTo(i).limitToLast(20).once("value", async function(his){
		let histo = his.val();
		let fecha = new Date() 
		let nows = Math.floor(fecha.setDate(fecha.getUTCDate()-2 ))
		await his.forEach(async function(item){
			if (item.val().fecha < nows){
				delete histo[item.key] 	
			}		
		})	
		callback(histo)
	})
}

var leerHistoria = function (id){
	let historia =  base.ref("historias/"+id).once("value", function (snap){
		if(snap && snap.val()){
			base.ref("historias/" + id +"/").child("leido/" + userInline.uid).set({
				uid : userInline.uid,
				fecha: mt()
			})
		}
	})
		
	
}

var likeToHistoria = function (idH){
	let refLikeHistorias= base.ref().child("LikesHistorias/"+idH+"/" + userInline.uid )
	refLikeHistorias.once("value", function (e){
		let isLiked = (e && e.val()) || false
		if (!isLiked ){
			refLikeHistorias.set({
				uid: userInline.uid, 
				fecha: mt()
			})
		} else{
			refLikeHistorias.remove()
		}
	})

}
var removerHistoria = function (idh, callback){

	base.ref().child("historias/"  + idh).remove()
	if (callback) callback()
}
var borrarAlbum = function (id){
	console.log(id)
		base.ref("/albumes/" + userInline.uid + "/" + id ).remove()
		.then ((e)=>{
			$("#Album"+ id).remove()
		})
}