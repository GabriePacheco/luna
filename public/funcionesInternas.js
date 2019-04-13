
//Controla a interactividad del boton login 
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
      var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
     var instance = M.Tabs.init(instances);

      var elems = document.querySelectorAll('.chips');
    var instances = M.Chips.init(elems)
        var elems = document.querySelectorAll('.dropdown-trigger');
    	var instances = M.Dropdown.init(elems);


  });
var progres={};
progres.valor =0
progres.head= '<div id ="pogres" class="progress">'
progres.body1= '<div class="determinate" style="width: '
progres.body2='%"></div>'
progres.pie= '</div>';


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
  var edPost={}
  var edPostRespaldo={}

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
		if (url != "#registro" && url != "#recuperar" && url != "#login" && url != "mensajeRecuperar"){
			if (userInline.uid){
		  		navegar(url)
			}else{
				navegar("#login")
			}
		}else{
			navegar(url)
		}

	}else{
		testPermisos(function (estado){
			
			if (estado){
				navegar(url)
			}else{
				if (userInline.uid){
				  navegar("#home")
				}else{
				  navegar("#login")
				}
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
	
		location.hash="#login";
	})
	.catch(function (error){
		mensajeria(error, "error");
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

	switch(mensaje.code){
		case "auth/invalid-email":
		alerta.icono = "<i class='material-icons red-text'>error</i>"
		alerta.texto = "Email no valido"
		break;
		case "auth/email-already-in-us":
				alerta.icono = "<i class='material-icons'>error</i>"
				alerta.texto = "La direccion de correo ingresada ya está siendo utilizada en otra cuenta"
		break;
		case "auth/wrong-password":
			alerta.icono = "<i class='material-icons'>error</i>"
			alerta.texto = "La contraseña ingresada no es valida";
		break;
		case "auth/cargando":
			alerta.icono = "<i class='material-icons'>cached</i>"
			alerta.texto = mensaje.message;
		break;	
		case "auth/token-invalido":
			alerta.icono = "<i class='material-icons'>error</i>"
			alerta.texto = "El token ingresado no es válido o ya caducó";
		break
		case "auth/token-invalido":
			alerta.icono = "<i class='material-icons'>error</i>"
			alerta.texto = "El token ingresado no es válido o ya caducó";
		break;
		case  "auth/user-not-found":
		alerta.icono = "<i class='material-icons'>error</i>"
		alerta.texto = "El usuario no está registrado";
		break;
		case "auth/reenviado":
			alerta.icono = "<i class='material-icons text-green'>send</i>"
			alerta.texto = "Correo electronico reemviado";		

		break;
		case "base/saveOK":
			alerta.icono = "<i class='material-icons green-text'>save</i>"
			alerta.texto = "Tus datos se an actualizado";		
		break;
		default: 
			alerta.icono = "<i class='material-icons red-text'>error</i>"
			alerta.texto = mensaje.message;
		break

	
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
	auth.signOut()
	.then(function (){
		delete userInline.id, userInline.nombre, userInline.foto;
	})

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
	if ($("#rolEPerfil").val() == "3"){
		$("#portaTokens").removeClass("hide")
		$("#tokenEPerfil").attr("required", true )
	}else{
		$("#portaTokens").addClass("hide")
		$("#tokenEPerfil").attr("required",false)
		
	}

});

$("#formEPerfil").submit(function (e){
	e.preventDefault();
	$("#savePerfil").html(preloader)
	editarUsuario(function (cap){
		$("#savePerfil").html("done");
		mensajeria(cap)
		$("#portaTokens").addClass("hide")
		$("#tokenEPerfil").val("")

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
	if (nPost.texto || nPost.imagenes || nPost.color || nPost.files){
		$("#posts").prepend("<div class='posteando col s12 '>Posteando... <i class='right'>"+preloader+"</i></div")
		location.hash="#home";
		subirPost(function (captura, e){
			if (e){
				mensajeria(e)

			}
			delete nPost.texto,nPost.imagenes,nPost.color,nPost.files ;
			delete nPost.imagenes;
			delete nPost.dataImg;
			delete nPost.dataURLimg;
			$(".posteando").remove();
			$("#postTextArea").val("")
			vistaPost();
		})
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
			$("#adjuntosPost").append(preloader);
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
		$("#imagenesPost").append(preloader);
		if (e.target.files[0].name){
			if (!nPost.imagenes){
				nPost.imagenes=[];
				nPost.dataImg=[];	
				nPost.dataURLimg=[];	
			}
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
		
			
		}
	}
});

var mt = function (){
	let fecha =  Date.now()
	return  Math.floor(fecha / 100)
}
var progresBar = function(avance){
	progres.valor = avance ;
	let por = progres.head + progres.body1+progres.valor+ progres.body2 + progres.pie
	return por;
}

var vistaPost = function (callback){

	$("#adjuntosPost").html("");
	$("#imagenesPost").html("");
	$("#postTextArea").removeClass("color")
	$("#postTextArea").attr("style", "")
	$("#postTextArea").removeClass("verde")
	$("#postTextArea").removeClass("naranja")
	$("#postTextArea").removeClass("azul")

	delete nPost.color;


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
					img.style.backgroundSize = "cover";
					img.style.backgroundPosition = "center";
					img.style.backgroundImage="url('"+nPost.dataURLimg[im]+"')";
					img.innerHTML="<a onclick='removeImagenes("+im+")'><i class='material-icons right'>delete_forever</i></a>";
					$("#imagenesPost").append(img)
					img = ""; 
					delete img;
					
				}	
		}
		if(nPost.imagenes.length == 3){
			let alto = (nPost.dataImg[0] +  nPost.dataImg[1] +   nPost.dataImg[2])/3 ;
			if (alto > 180){
				alto=180
			}
			for (let im = 0; im < 3; im ++){
				
					let img = document.createElement("div")
					if (im == 0){
						img.setAttribute("class", "col s12" );
					}else{
						img.setAttribute("class", "col s6" );
					}
					
					img.setAttribute("style", "height:" + alto +"px; background-repeat:no-repeat;" );					
					img.style.backgroundPosition = "center";
					img.style.backgroundImage="url('"+nPost.dataURLimg[im]+"')";
					img.style.backgroundSize = "cover";
					img.innerHTML="<a onclick='removeImagenes("+im+")'><i class='material-icons right'>delete_forever</i></a>";
					$("#imagenesPost").append(img)
					img = ""; 
					delete img;
					
			}
							
		}		
		if(nPost.imagenes.length > 3){
			let alto = (nPost.dataImg[0] +  nPost.dataImg[1] +   nPost.dataImg[2]+ nPost.dataImg[3])/4 ;
			if (alto > 180){
				alto=180
			}
			for (let im = 0; im < 4 ; im ++){				
					let img = document.createElement("div")			
					img.setAttribute("class", "col s6" );			
					img.setAttribute("style", "height:" + alto +"px; background-repeat:no-repeat;" );					
					img.style.backgroundPosition = "center";
					img.style.backgroundSize = "cover";
					img.style.backgroundImage="url('"+nPost.dataURLimg[im]+"')";
					img.innerHTML="<a onclick='removeImagenes("+im+")'><i class='material-icons right'>delete_forever</i></a>";
					if (nPost.imagenes.length > 4  &&  im == 3){
						img.setAttribute("class", "col s6 valign-wrapper center-align white-text" );
						img.innerHTML+= "<div class='col s12'><h3 class='center-align'>"+ (nPost.imagenes.length-4) +"</h3></div>";
					}
					$("#imagenesPost").append(img)
					img = ""; 
					delete img;					
			}
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


var dibujarPublicacion = function (publicacion){
	let formato = document.createElement("div")

	formato.id ="P"+publicacion.id
	formato.setAttribute("class", "publicacion row")
	formato.style = "padding-top: 0.7em; margin-bottom: 0.5em";
	
	let autorPublicacion = document.createElement("div");
	autorPublicacion.setAttribute("class", "col s8 ");
	autorPublicacion.innerHTML = '<div class="col s3"><img src="'+publicacion.autorFoto+'" class="responsive-img circle"></div>'
	autorPublicacion.innerHTML += '<div class="col s9">'+publicacion.autorName+'<br><small>'+tiempo(publicacion.fecha)+'</small> </div> ';
	formato.appendChild(autorPublicacion)

	let menuPublicacion = document.createElement("div");
	menuPublicacion.setAttribute("class", "col s4 right-align")
	menuPublicacion.innerHTML = `<a href='#' class='dropdown-trigger ' data-target='menu${publicacion.id}'><i class='material-icons'>more_horiz</i></a>`
	menuPublicacion.innerHTML +=`<ul id='menu${publicacion.id}' class='dropdown-content'>
								    <li><a  onclick='borrar("${publicacion.id}")' >Borrar</i></a></li>
								    <li><a onclick='editar("${publicacion.id}")' >Editar</i></a></li>								    
								  </ul>`;

	formato.appendChild(menuPublicacion)

	if (publicacion.texto){
		let texto = document.createElement("div");
		texto.innerHTML="<div class='textoP'>" + publicacion.texto +"</div>";
		texto.setAttribute("class", "col s12")
		formato.appendChild(texto)	
		if (publicacion.color){
			texto.setAttribute("class", "col s12 "+ publicacion.color )
			texto.innerHTML="<div class='color valign-wrapper  '><div class=' col s12 center-align'>" +publicacion.texto+"</div></div>";

		}
	}

	if (publicacion.imagenes){
		let vistaImagenes = document.createElement("div");
		
		if (publicacion.imagenes.length >= 4){
			for (let a1 = 0; a1 < 4 ; a1++){
				let imP = document.createElement("div");
				if ((publicacion.imagenes.length - 4 ) > 0  && a1 == 3){
					imP . setAttribute("class", "col s6 valign-wrapper");
					imP.innerHTML= "<div class='center-align white-text col s12'><h3> + " +  (publicacion.imagenes.length - 4)  + "</h3></div>";

				}else{
					imP . setAttribute("class", "col s6  ");	

				}
				

				imP.style.height = "180px";
				imP.style.backgroundImage= "url('"+publicacion.imagenes[a1]+"')";
				imP.style.backgroundPosition = "center";
				imP.style.backgroundSize = "cover";
				vistaImagenes.appendChild(imP);
				imP = "";
				delete imP;
			}
		}
		if (publicacion.imagenes.length == 3){
			for (let a1 = 0; a1 < publicacion.imagenes.length; a1++){
				let imP = document.createElement("div");
				if (a1 == 0){
					imP . setAttribute("class", "col s12");
				}else{
					imP . setAttribute("class", "col s6");
				}				
				imP.style.height = "180px";		
				imP.style.backgroundImage= "url('"+publicacion.imagenes[a1]+"')";
				imP.style.backgroundPosition = "center";
				imP.style.backgroundSize = "cover";
				vistaImagenes.appendChild(imP);
				imP = "";
				delete imP;
			}
		}
		if (publicacion.imagenes.length ==2){
			for (let a1 = 0; a1 < publicacion.imagenes.length; a1++){
				let imP = document.createElement("div");				
				imP.setAttribute("class", "col s6");			
				imP.style.height = "360px";		
				imP.style.backgroundImage= "url('"+publicacion.imagenes[a1]+"')";
				imP.style.backgroundPosition = "center";
				imP.style.backgroundSize = "cover";
				vistaImagenes.appendChild(imP);

			}
		}
		if (publicacion.imagenes.length == 1){

				let imP = document.createElement("img");			
				imP.setAttribute("class", "responsive-img");								
				imP.setAttribute("src", publicacion.imagenes[0])		
				vistaImagenes.appendChild( imP );
				imP = "";
				delete imP;
				
		}	
		formato.appendChild(vistaImagenes);

	}
	if (publicacion.files){
		for (let f1 = 0 ; f1 < publicacion.files.length;  f1++){
			var  fileP = document.createElement("div");
			fileP.setAttribute( "class", "col s10  grey lighten-2 offset-s1");
			fileP.style= "padding: 1em;"
			fileP.innerHTML = "<i class='material-icons'>attach_file</i>" +publicacion.filesName[f1];
			fileP.innerHTML +='<a href="'+publicacion.files[f1]+'" download> <i class="material-icons right grey-text">cloud_download</i></a>'
			
		}
		formato.appendChild(fileP);
		fileP = "";
		delete fileP;

	}
	let pieP = document.createElement("div")
	let corazonP = document.createElement("div");
	corazonP.id = "likes" + publicacion.id;
	corazonP.setAttribute("class", "col s6 left-align")
	corazonP.innerHTML = "<i class='material-icons'> favorite_border </i>"
	corazonP.innerHTML+= "<span class='contador'></spna>";
	corazonP.style = "padding-top: 0.7em"
	let comentP = document.createElement("div");

	comentP.setAttribute("class", "col s6 right-align")
	comentP.innerHTML = "<span class='contador'></span>";
	comentP.innerHTML += "<i class='material-icons'>comment</i>";
	comentP.style = "padding-top: 0.7em"
	pieP.appendChild(corazonP)
	pieP.appendChild(comentP)

	formato.appendChild(pieP)

	$("#posts").prepend(formato);
	
    let elems = document.querySelectorAll('.dropdown-trigger');
	let instances = M.Dropdown.init(elems);
}


$("#addPost .back").click(function (e){
	e.preventDefault();
	if (!$.isEmptyObject(nPost)){
		
		let descart = confirm("¿Deseas descartar la publicación? " );
		if (descart){
			nPost ={}
			vistaPost();
			$("#postTextArea").val("");
			location.hash= "#home";
		}
	}else{
		$("#postTextArea").val("");
		location.hash= "#home";
	}

})
$("#editPost .back").click(function (e){
	e.preventDefault();
	if (edPost.color == edPostRespaldo.color && edPost.imagenes == edPostRespaldo.imagenes &&  edPost.files == edPostRespaldo.files ){
		let descart = confirm("¿Hay cambios en la publicacion deseas descartarlos? " );
		if (descart){
			limpiarEdit()	
			location.hash= "#home";
			edPost={}
			edPostRespaldo={}
		}
		
	}else{

		limpiarEdit()
		location.hash = "#home";
		edPost={}
		edPostRespaldo={}		

	}

})
var tiempo = function (ts){
		
		let date = new Date(ts);
		var options = {
		         day: 'numeric',month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
		    };

		return  date.toLocaleDateString('es', options); // 10/29/2013

}
var editar = async function (postId){
	location.hash = "#editPost"
	await consultarPublicacion(postId, edPostDraw)

}
var edPostDraw =  function (ed){

		edPost = ed;
		edPostRespaldo = ed;
	if (edPost.texto){
		$("#postETextArea").val(edPost.texto)
	}
	if (edPost.color){
		$("#postETextArea").addClass(edPost.color)
		$("#postETextArea").addClass("color")
	}
	if (edPost.files){
		for (let ef = 0; ef < edPost.files.length; ef++){
			let edPostFile = document.createElement("div");
			edPostFile.setAttribute("class", "col s10  grey lighten-2 offset-s1");
		
			edPostFile.style = " padding: 1em";
			edPostFile.innerHTML = `<a  onclick="borrarEf('${ef}')"><i class="material-icons right">delete</i></a>`
			edPostFile.innerHTML += `<i class="material-icons">attach_file </i>`;
			edPostFile.innerHTML += edPost.filesName[ef];
			$("#adjuntosEPost").append(edPostFile)
			edPostFile ="";
			delete edPostFile

		}	
	}
	if (edPost.imagenes){
		if (edPost.imagenes.length >= 4 ){
			for (let ei = 0; ei < 4; ei++ ){
				let edImagen = document.createElement("div");
				edImagen.setAttribute("class", "col s6")
				edImagen.style= "height: 180px";
				edImagen.style.backgroundImage= `url('${edPost.imagenes[ei]}')`;
				edImagen.style.backgroundSize = "cover";
				edImagen.style.backgroundPosition = "center";
				edImagen.style.backgroundRepeat = "no-repeat";
				edImagen.innerHTML= `<a onclick='borrarEi("${ei}")'><i class="material-icons right">delete</i></a>`
				if (edPost.imagenes.length > 4 && ei == 3){
					edImagen.setAttribute("class", "col s6 valign-wrapper white-text");
					edImagen.innerHTML+= `<h3> + ${ edPost.imagenes.length - 4 }</h3>`
				}
				$("#adjuntosEPost").append(edImagen);
				edImagen = "";
				delete edImagen;
			}
		}
		if (edPost.imagenes.length == 3 ){
			for (let ei = 0; ei < 3; ei++ ){
				let edImagen = document.createElement("div");
				edImagen.setAttribute("class", "col s6")
				edImagen.style= "height: 180px";
				edImagen.style.backgroundImage= `url('${edPost.imagenes[ei]}')`;
				edImagen.style.backgroundSize = "cover";
				edImagen.style.backgroundPosition = "center";
				edImagen.style.backgroundRepeat = "no-repeat";
				edImagen.innerHTML= `<a onclick='borrarEi("${ei}")'><i class="material-icons right">delete</i></a>`
				if (ei == 0 ){
					edImagen.setAttribute("class", "col s12");
					
				}
				$("#adjuntosEPost").append(edImagen);
				edImagen = "";
				delete edImagen;
			}
		}
		if (edPost.imagenes.length == 2 ){
			for (let ei = 0; ei < 2; ei++ ){
				let edImagen = document.createElement("div");
				edImagen.setAttribute("class", "col s6");
				edImagen.style= "height: 360px";
				edImagen.style.backgroundImage= `url('${edPost.imagenes[ei]}')`;
				edImagen.style.backgroundSize = "cover";
				edImagen.style.backgroundPosition = "center";
				edImagen.style.backgroundRepeat = "no-repeat";
				edImagen.innerHTML= `<a onclick='borrarEi("${ei}")'><i class="material-icons right">delete</i></a>`
				$("#adjuntosEPost").append(edImagen);
				edImagen = "";
				delete edImagen;
			}
		}
		if (edPost.imagenes.length == 1 ){
				let edImagen = document.createElement("div");
				edImagen.setAttribute("class", "col s12")
				edImagen.innerHTML= `<a onclick='borrarEi(${0})'><i class="material-icons right">delete</i></a>`
				edImagen.innerHTML+= `<img class='responsive-img' src='${edPost.imagenes[0]}' width ='100%'>`
				$("#adjuntosEPost").append(edImagen);
				edImagen = "";
				delete edImagen;	
		}
	}

}

var limpiarEdit = function (callback){
	$("#postETextArea").val("");
	$("#imagenesEPost").html("");
	$("#adjuntosEPost").html("");
	$("#postETextArea").removeClass("color");
	$("#postETextArea").removeClass("verde")
	$("#postETextArea").removeClass("naranja")
	$("#postETextArea").removeClass("azul")
	if (callback){
		callback();
	}

}

var borrarEi = function (ind){
	edPost.imagenes.splice(ind,1)
	if (edPost.imagenes.length == 0 ){
		delete edPost.imagenes;
	}
	limpiarEdit(function (){
		edPostDraw(edPost)
	});
}
var borrarEf = function (ind){
	edPost.files.splice(ind,1)
	edPost.filesName.splice(ind,1)
	if (edPost.files.length){
		delete edPost.imagenes;
	
	} 
	limpiarEdit(function (){
		edPostDraw(edPost)
	});
}

$("#postETextArea").keyup(function (){
	var el = this;
	  if (!$(this).hasClass("color")){
	  	setTimeout(function(){
	    el.style.cssText = 'height:auto; padding:0';
	    el.style.cssText = 'height:' + el.scrollHeight + 'px';
	  	},0);

	  }
	  edPost.texto = el.value;
	  if ( el.value == ""){
	  	delete edPost.texto;
	  }
});
$(".colorE").click(function (){
	if (!nPost.files && ! nPost.imagenes ){
	$("#postETextArea").removeClass("color")
	$("#postETextArea").attr("style", "")
	$("#postETextArea").removeClass("verde")
	$("#postETextArea").removeClass("naranja")
	$("#postETextArea").removeClass("azul")
	$("#postETextArea").addClass($(this).attr("data-color"))
	$("#postETextArea").addClass("color")
	edPost.color= $(this).attr("data-color");

	if ($(this).attr("data-color") == "none"){
		$("#postETextArea").removeClass("color");
		$("#postETextArea").removeClass("none");
		delete edPost.color
	}
 }	

});