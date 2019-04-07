
//Controla a interactividad del boton login 
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
      var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
     var instance = M.Tabs.init(instances);

      var elems = document.querySelectorAll('.chips');
    var instances = M.Chips.init(elems)


  });


var preloader =  '<div class="preloader-wrapper small active">'+
    '<div class="spinner-layer spinner-blue-only">'+
      '<div class="circle-clipper left">'+
        '<div class="circle"></div>'+
      '</div><div class="gap-patch">'+
        '<div class="circle"></div>'+
      '</div><div class="circle-clipper right">'+
        '<div class="circle"></div>'+
      '</div>'+
   '</div>'+
  '</div>';
  var next = '<i class="material-icons">skip_next</i>'
  var nPost = {}

$("#emailLogin").keyup(()=>{
	loginFrom()

})

$("#passwordLogin").keyup(()=>{
	loginFrom()

})

function loginFrom (){
	if($("#emailLogin").val() != "" && $("#passwordLogin").val() != "" ){
		$("#botonLogin").removeClass("disabled")
		
	}else{
		$("#botonLogin").addClass("disabled")
	}
}

//Controla a interactividad del boton Registro 

$("#emailRegistro").keyup(()=>{
	RegistroFrom()

})
$("#rpasswordRegistro").keyup(()=>{
	RegistroFrom()

})

$("#passwordRegistro").keyup(()=>{
	RegistroFrom()

})

function RegistroFrom (){
	if($("#emailRegistro").val() != "" && $("#passwordRegistro").val() != "" &&  $("#passwordRegistro").val() == $("#rpasswordRegistro").val() ){
		
		$("#botonRegistro").removeClass("disabled")
	
		
	}else{
		$("#botonRegistro").addClass("disabled")
	}
}

$("#emailRecuperar").keyup(()=>{
	if ($("#emailRecuperar").val() != ""){
		$("#botonRecuperar").removeClass("disabled")
	}else{
		$("#botonRecuperar").addClass("disabled")
	}

})

//NAVEGACION 

$( window ).on( 'hashchange', function( e ) {
	let url=  location.hash.split("?")[0]
	if (url != "#addPost"){
	  navegar(url)

	}else{
		testPermisos(function (estado){
			
			if (estado){
				navegar(url)
			}else{
				  navegar("#home")
			}
		})
	}
});

$(document).ready(function (){
	$(".pageApp").addClass("hide");



});

var navegar = function (url, callback){
	$(".pageApp").addClass("hide");
	$(""+url+"").removeClass("hide");

	if (callback){
		callback();
	}

}

$("#loginForm").submit(function (e){
	e.preventDefault();
	$("#botonLoginI").html(preloader);
	auth.signInWithEmailAndPassword($("#emailLogin").val(), $("#passwordLogin").val())
	.then(function (){
		$("#botonLoginI").html("lock_open");
		cargarPerfil();
		location.hash="#login";
	})
	.catch(function (error){
		mensajeria(error, "error");
		console.log(error)
		$("#botonLoginI").html("power_settings_new");
	});

})

$("#registroForm").submit(function (e){
	e.preventDefault();
	$("#botonRegistroI").html(preloader);
	auth.createUserWithEmailAndPassword($("#emailRegistro").val(),$("#passwordRegistro").val() )
	.then(function (){
		$("#botonRegistroI").html(next);
		auth.currentUser.sendEmailVerification()
		.then(function (e){
			location.hash="#registroMensaje";
		})

	})
	.catch((error) =>{
			mensajeria(error)
			$("#botonRegistroI").html(next);		
	});

});


//Registro de Nombre y rol 
$("#nombreRegistroNombre").keyup((e)=>{
	comprovarNombre()
});

$("#rolUsuarioRegistro").change((e)=>{
	comprovarNombre()
});

var comprovarNombre = function (){
	if ($("#nombreRegistroNombre").val() !=  "" && $("#rolUsuarioRegistro").val() != "" ){
		$("#botonRegistroNombre").removeClass("disabled");
	}else{
		$("#botonRegistroNombre").addClass("disabled");
	}
	if ($("#rolUsuarioRegistro").val() != ""){
		if ($("#rolUsuarioRegistro").val()== "3" ){
			$("#tokenRegistroNombre").removeClass("hide");
			$("#tokenRegistroNombre").attr("required", true)
			$("#estudiantesRegistroNombre").attr("required",false);
			$("#estudiantesRegistroNombre").addClass("hide");
		}
		if ($("#rolUsuarioRegistro").val() == "2" ){
			$("#estudiantesRegistroNombre").removeClass("hide");
			$("#estudiantesRegistroNombre").attr("required", true)
			$("#tokenRegistroNombre").addClass("hide");
			$("#tokenRegistroNombre").attr("required",false);
		}
		if ($("#rolUsuarioRegistro").val() == "1" ){
			$("#estudiantesRegistroNombre").addClass("hide");
			$("#estudiantesRegistroNombre").attr("required", false)
			$("#tokenRegistroNombre").addClass("hide");
			$("#tokenRegistroNombre").attr("required",false);
		}
	}

}



$("#registroNombreForm").submit( function (e){
	e.preventDefault();
	$("#botonRegistroNombreI").html= preloader;
	registrarNombre((e)=>{
		$("#botonRegistroNombreI").html= 'skip_next';
		location.hash= "#home"	
	})


})


// mensajeria 
var mensajeria = function (mensaje){
	let  alerta= {}


	if (mensaje.code == "auth/invalid-email"){
		alerta.icono = "<i class='material-icons'>error</i>"
		alerta.texto = "Email no valido"
	}
	if (mensaje.code == "auth/email-already-in-use"){
		alerta.icono = "<i class='material-icons'>error</i>"
		alerta.texto = "La direccion de correo ingresada ya está siendo utilizada en otra cuenta"
	}
	if (mensaje.code == "auth/wrong-password"){
		alerta.icono = "<i class='material-icons'>error</i>"
		alerta.texto = "La contraseña ingresada no es valida";
	}

	if (mensaje.code == "auth/cargando"){
		alerta.icono = "<i class='material-icons'>cached</i>"
		alerta.texto = mensaje.message;
	}
	if (mensaje.code == "auth/token-invalido"){
		alerta.icono = "<i class='material-icons'>error</i>"
		alerta.texto = "El token ingresado no es válido o ya caducó";
	}
	if (mensaje.code == "auth/user-not-found"){
		alerta.icono = "<i class='material-icons'>error</i>"
		alerta.texto = "El usuario no está registrado";
	}
	if (mensaje.code="auth/reenviado"){
		alerta.icono = "<i class='material-icons text-green'>send</i>"
		alerta.texto = "Correo electronico reemviado";		

	}
		if (mensaje.code="base/saveOK"){
		alerta.icono = "<i class='material-icons green-text'>save</i>"
		alerta.texto = "Tus datos se an actualizado";		

	}
	
	
	  M.toast({html: alerta.texto  + alerta.icono});

}

gpRecortador({recortador: "recortador", redondo: true},
 function(res){
 	$("#registroFotoForm").append(preloader);
 	registrarFotoUsuario(res, function (e){
 		location.href= "#registroNombre"
 	})
})

$("#cerrar").click((e)=>{
	console.log("cerrando secion..")
	auth.signOut();
});


 
$("#recuperarForm").submit(function (e) {
	e.preventDefault();
	$("#recuperarBotonI").html(preloader);
	recuperarPass(function (){
		$("#recuperarBotonI").html("skip_next");

	});
})

$(".loginFacebook").click((e)=>{
	e.target.innerHTML= "cargando... " +   preloader;
	loginCon ("facebook", function (snap){
		e.target.innerHTML= "Inicia sesión con facebook" ;
	});
	

});

$("#reenvio").click(function (e){
	auth.currentUser.sendEmailVerification()
	mensajeria({code: "auth/reenviado"})
})
$("#rolEPerfil").change(function (e){
	if ($("#rolEPerfil").val()== "2"){
		$("#portaEstudiantes").removeClass("hide")
	}else{
		$("#portaEstudiantes").addClass("hide")
	}

});

$("#formEPerfil").submit(function (e){
	e.preventDefault();
	$("#savePerfil").html(preloader)
	editarUsuario(function (cap){
		$("#savePerfil").html("done");
		mensajeria({code: "base/saveOK"})

	});
})
$("#savePerfil").click(function (){
	$("#formEPerfil").submit();
});


$("#linkEditarFoto").click(function (){
	$("#editarFotoPerfil").show("slow", function (){
		gpRecortador({redondo:true, recortador: "editarFPerfil", botonera: "editarFPerfilBotonera", colorFondo:"#989898"},
			function (captura){
				$("#editarFPerfilBotonera").html(preloader);
				registrarFotoUsuario(captura, function (e){
					$("#imagenEPerfil").attr("src",e)
					$("#imagenPerfil").attr("src",e)
					location.hash="#editarPerfil"
				})
			}
		)
	})
})

$("#postTextArea").keyup(function (){
	var el = this;
	
	  if (!$(this).hasClass("color")){
	  	setTimeout(function(){
	    el.style.cssText = 'height:auto; padding:0';
	    el.style.cssText = 'height:' + el.scrollHeight + 'px';
	  	},0);

	  }
	  nPost.texto = el.value;
	  if ( el.value == ""){
	  	delete nPost.texto;
	  }
});

$(".color").click(function (){
	if (!nPost.files && ! nPost.imagenes ){
	$("#postTextArea").removeClass("color")
	$("#postTextArea").attr("style", "")
	$("#postTextArea").removeClass("verde")
	$("#postTextArea").removeClass("naranja")
	$("#postTextArea").removeClass("azul")
	$("#postTextArea").addClass($(this).attr("data-color"))
	$("#postTextArea").addClass("color")
	nPost.color= $(this).attr("data-color");

	if ($(this).attr("data-color") == "none"){
		$("#postTextArea").removeClass("color");
		$("#postTextArea").removeClass("none");
		delete nPost.color
	}
 }	

});

$("#saveNPost").click(function (){
	if (nPost.texto || nPost.Imagenes || nPost.color || nPost.archivos){
		console.log("vamos a subirlo...")
	}

});
$("#addFilePost").click(function(){
	$("#NewFile").attr("accept", "")
	$("#NewFile").click()

});
$("#addFotoPost").click(function(){
	$("#NewFile").attr("accept", "image/*")
	$("#NewFile").click()

});
$("#NewFile").change(function (e){
	if ($("#NewFile").attr("accept") == ""){
		if (e.target.files[0].name){
			if (!nPost.files){
				nPost.files=[];
				nPost.filesName=[];
			}
			nPost.files.push(e.target.files[0])
			nPost.filesName.push(e.target.files[0].name);
			vistaPost()
		}
	}else{
		if (e.target.files[0].name){
			if (!nPost.imagenes){
				nPost.imagenes=[];
				nPost.dataImg=[];	
				nPost.dataURLimg=[];	
			}
			console.log(e.target.files[0].size);
			let canvasPost = document.createElement("canvas")
			let contextP = canvasPost.getContext("2d");
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = function (){
				let nImagen = new Image();
				nImagen.src = reader.result;
				nImagen.onload = function (){
					if (e.target.files[0].size >= 307200 ){
						canvasPost.width = nImagen.width/3.6
						canvasPost.height = nImagen.height /3.6
						contextP.drawImage(nImagen, 0,0, canvasPost.width, canvasPost.height) 
						nPost.imagenes.push(URLtoBlob(canvasPost.toDataURL())) 
						nPost.dataURLimg.push(canvasPost.toDataURL())
						nPost.dataImg.push(canvasPost.height )
						vistaPost(()=>{
							delete canvasPost;
							delete reader;
							delete nImagen;
						})
					}else{
						nPost.imagenes.push(e.target.files[0])
						nPost.dataURLimg.push(nImagen.src)
						nPost.dataImg.push(nImagen.height)
						vistaPost(()=>{
							delete canvasPost;
							delete reader;
							delete nImagen;
						})
					}

				}
			}
		

			/*nPost.imagenes.push(e.target.files[0])
			vistaPost()*/
		}
	}
});

var mt = function (){
	let fecha =  Date.now()
	return  Math.floor(fecha / 100)
}


var vistaPost = function (callback){

	$("#adjuntosPost").html("");
	$("#imagenesPost").html("");
	$("#postTextArea").removeClass("color")
	$("#postTextArea").attr("style", "")
	$("#postTextArea").removeClass("verde")
	$("#postTextArea").removeClass("naranja")
	$("#postTextArea").removeClass("azul")


	if (nPost.filesName){
		for (let a1 = 0; a1 < nPost.filesName.length ; a1++){
			$("#adjuntosPost").append("<div class='col s10 grey lighten-2 offset-s1' style='padding:1em'><a  onclick='removeAdjuntos("+a1+")'><i class='right' >X</i></a><div> <i class='material-icons' >attach_file</i>"+nPost.filesName[a1]+"</div></div>")
		}

	}
	if (nPost.imagenes){
		console.log(nPost.dataImg)
		if (nPost.imagenes.length == 1){
			
				$("#imagenesPost").append("<div class='col s12'><a onclick='removeImagenes("+0+")' ><i class='right'>X</i></a>"
					+"<img src='"+nPost.dataURLimg[0]+"' class='responsive-img' width='100%'  height='auto'>"
					+"</div>");
		}
		if(nPost.imagenes.length == 2){
			let alto = (nPost.dataImg[0] +  nPost.dataImg[1])/2 ;
			if (alto > 360){
				alto=360
			}		
				for (let im = 0; im < 2 ; im ++){
					let img = document.createElement("div")
					img.setAttribute("class", "col s6" );
					img.setAttribute("style", "height:" + alto +"px; background-repeat:no-repeat;" );
					
					img.style.backgroundPosition = "center";
					img.style.backgroundImage="url('"+nPost.dataURLimg[im]+"')";
					img.innerHTML="<a onclick='removeImagenes("+im+")'><i class='material-icons right'>delete_forever</i></a>";
					$("#imagenesPost").append(img)
					
				}	
		}
		if(nPost.imagenes.length == 3){
			let alto = (nPost.dataImg[0] +  nPost.dataImg[1] +   nPost.dataImg[2])/3 ;
			if (alto > 180){
				alto=180
			}
				$("#imagenesPost").append("<div class='col s12' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[0]+"); background-repeat: no-repeat; background-position: center;'><a onclick='removeImagenes("+0+")' ><i class='right'>X</i></a>"
				+"</div>");	
				$("#imagenesPost").append("<div class='col s6' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[1]+"); background-repeat: no-repeat;  background-position: center;'><a onclick='removeImagenes("+1+")' ><i class='right'>X</i></a>"
				+"</div>");
				$("#imagenesPost").append("<div class='col s6' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[2]+"); background-repeat: no-repeat; background-position: center;'><a onclick='removeImagenes("+0+")' ><i class='right'>X</i></a>"
				+"</div>");
		}		
		if(nPost.imagenes.length > 3){
			let alto = (nPost.dataImg[0] +  nPost.dataImg[1] +   nPost.dataImg[2]+ nPost.dataImg[3])/4 ;
			if (alto > 180){
				alto=180
			}
			console.log(alto)
			
				$("#imagenesPost").append("<div class='col s6' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[0]+"); background-repeat: no-repeat; background-position: center;'><a onclick='removeImagenes("+0+")' ><i class='right'>X</i></a>"
				+"</div>");	
				$("#imagenesPost").append("<div class='col s6' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[1]+"); background-repeat: no-repeat;  background-position: center;'><a onclick='removeImagenes("+1+")' ><i class='right'>X</i></a>"
				+"</div>");
				$("#imagenesPost").append("<div class='col s6' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[2]+"); background-repeat: no-repeat; background-position: center;'><a onclick='removeImagenes("+0+")' ><i class='right'>X</i></a>"
				+"</div>");
				$("#imagenesPost").append("<div class='col s6' style='height:"+alto+"px !important; background-image: url("+nPost.dataURLimg[3]+"); background-repeat: no-repeat; background-position: center;'><a onclick='removeImagenes("+0+")' ><i class='right'>X</i></a>"
				+"</div>");	
		}			


	}

	if (callback){
		callback();
	}
}
var removeAdjuntos = function (indez){
		nPost.filesName.splice(indez,1)
		nPost.files.splice(indez,1)
		vistaPost(function (){
			if (nPost.filesName.length == 0){
				delete nPost.filesName;
				delete nPost.files;
			}
		})

}
var removeImagenes = function (indez){

		nPost.imagenes.splice(indez,1)
		nPost.dataImg.splice(indez,1)
		nPost.dataURLimg.splice(indez,1)
		vistaPost(function (){
			if (nPost.imagenes.length == 0){			
				delete nPost.imagenes;
				delete nPost.dataImg;
				delete nPost.dataURLimg;


			}
			console.log(nPost)
		})

}


	var URLtoBlob =function (dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
		    byteString = atob(dataURI.split(',')[1]);
		else
		    byteString = unescape(dataURI.split(',')[1]);
		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
		    ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], {type:mimeString});
	}






