$(".app").height( document.documentElement.clientHeight)

var cargandoHtml = ` <div class="preloader-wrapper small active">
					    <div class="spinner-layer spinner-green-only">
					      <div class="circle-clipper left">
					        <div class="circle"></div>
					      </div><div class="gap-patch">
					        <div class="circle"></div>
					      </div><div class="circle-clipper right">
					        <div class="circle"></div>
					      </div>
					    </div>
					  </div>
        			`;


  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

/* CONTROL DEL FORMULARIO  LOGIN */
$("#login_email").keyup(checkLogin);
$("#login_password").keyup(checkLogin);
function checkLogin(e){ //controla cambios los campos email y password del login y abilita o desabilita el boton 
	e.preventDefault()
	if ( $("#login_email").val() !=  "" && $("#login_password").val() != "" ){
		$("#login_boton").attr("disabled", false);
	}else{
		$("#login_boton").attr("disabled", true);
	}


}
$("#login_form").submit(function (e){
	e.preventDefault();
	$("#login_boton_icono").html(cargandoHtml);
	$("#login_boton").attr("disabled", true);	
	enviarLogin(function (sesion){
		if (sesion.estado == true){
			$("#login_boton_icono").html("lock_open");
			$("#login_boton").attr("disabled", false);
			mensajeria(sesion.mensaje, "echo")
		}
		if (sesion.estado == false){
			$("#login_boton_icono").html("lock");
			$("#login_boton").attr("disabled", false);
			mensajeria(sesion.mensaje, "error")
		}
		
	})
})

/*******/

/*CONTROL DEL FORMULARIO RECUPERAR CONTRASEÑA */
$("#resetPassword_email").keyup(checkRecuperar);
function checkRecuperar (e){
	if ($("#resetPassword_email").val() != "" && $("#resetPassword_email").val().indexOf(".") != -1 && $("#resetPassword_email").val().indexOf("@") != -1 ){
		$("#resetPassword_boton").attr("disabled", false);
	}else{
		$("#resetPassword_boton").attr("disabled", true);
	}
}
$("#resetPassword_form").submit(function (e){
	e.preventDefault();
	$("#resetPassword_boton_icono").html(cargandoHtml);
	$("#resetPassword_boton").attr("disabled", true);
	changePassword(function (change){
		if (change.estado){
			$("#resetPassword_boton").attr("disabled", false);
			$("#resetPassword_boton_icono").html("done");
			mensajeria(change.mensaje, "echo")
		}else{
			$("#resetPassword_boton").attr("disabled", false);
			$("#resetPassword_boton_icono").html("alert");
			mensajeria(change.mensaje, "error")
		}
	});

})

/******/

/** DIBUJA TOTAL DE USUARIOS EN EL HOME **/
var totalUsuarios = function (e){
	$("#totalUsers").html(e)
}
/******
/*MENSAJERIA*/ 
var mensajeria = function (men, tipo){
	let icono, clase;
	switch (tipo){
		case'error': 
			icono = "error";
			clase = "red-text text-darken-2";
		break;	
		case'echo': 
			icono = "done";
			clase = "green-text text-darken-2";
		break;	
		case'alerta': 
			icono = "warning";
			clase = "yellow-text text-darken-2";
		break;

	}
	 var toastHTML = '<span>'+ men+'</span><i class="material-icons '+ clase +'">'+icono+'</i>';
	 M.toast({html: toastHTML});

}	


/**Debuel el rol del usuario en palabras**/

var roles = function (i){
	let rol;
	switch (i){
		case "1":
			rol = "Estudiante";
		break;
		case "2":
			rol = "Representante";
		break;
		case "3":
			rol = "Profesor";
		break;
		case "4":
			rol = "WebMaster";
		break;
		case "5":
			rol = "Desarollador";
		break;		

	}
	return rol;
}
/***/ 

/***filtra el areglode usuarios**/
var drawTabla = function (us){
			
		$("#tbody").html("")
  		let x=0;
		us.forEach((item) => {
			x++;
			let print ='<tr><td>'+ x +'</td>'
			print+= '<td>' +item.val().nombre+'</td>';
			print+= '<td class="hide-on-small-only">' +item.val().email+'</td>';
			print+= '<td><span class="' + roles(item.val().rol) + '"> ' + roles(item.val().rol) +' </span></td>';
			print+= '<td> <i  onClick ="files(`' +item.val().uid + '`)" class="material-icons">folder_shared</i> </td>';
			print+="</tr>";
			$("#tbody").append(print)
	  
		})
		
		


		
}

$("#botonSearch").click(function (){
	buscarUsuarios($("#buscador").val())
})
var files = function (uid){

	if (uid){
		navegacion("#userFiles", function (){
			base.ref("users/" + uid).once("value", function(userSnap){
				let u = userSnap.val()
				$("#userFilesUid").val(u.uid);
				$("#userFilesImagen").attr("src", u.photoURL);
				$("#userFilesNombre").val(u.nombre);
				$("#userFilesEmail").val( u.email);
				$("#userFilesRol").val(roles(u.rol));
				 M.updateTextFields()
			})
			base.ref("historias/").orderByChild("userId").equalTo(uid).once("value", function (historiasUser){
				$("#userFilesTotalHistorias").html(historiasUser.numChildren())
				    var elems = document.querySelectorAll('.collapsible');
    				var instances = M.Collapsible.init(elems); 
    				$("#userFilesTotalHistoriasDetalle").html("");
    				if (historiasUser.val() ){
    					historiasUser.forEach((item) => {
	    					let sal = `<li id ='${item.val().id}' class="collection-item avatar">
						      <img src="${item.val().archivo}" alt="" class="circle">
						      <span class="title">${tiempo(item.val().fecha)}</span>

						      <a href="#!" class="secondary-content" data-action ="true"><i class="material-icons">delete</i></a>
						    </li>
						  `
	    					$("#userFilesTotalHistoriasDetalle").append(sal)
    					})

    				}else{
    					$("#userFilesTotalHistoriasDetalle").html("<li> El Usuario no a resgistrado ninguna historia.</li>");
    				}
    				
			})

			base.ref("ingresos/" + uid).once("value", function (ingresosUser){
				$("#userFilesIngresosDetalle").html("");
				if ( ingresosUser.val() ){
					ingresosUser.forEach((item) => {				
					  let sal2 =`<li id ='${item.val().id}' class="collection-item ">
						      			<span class="title">${tiempo(item.val().fecha)}</span>
						      	
						   		 </li>
						 	 `;
						 	 
						$("#userFilesIngresosDetalle").append(sal2)
					})
				}else{
					$("#userFilesIngresosDetalle").html("<li>El usuario no ha registrado ingresos! </li>");
				}
			})
			base.ref("albumes/" + uid).once("value", function (albumUser){
				$("#userFilesAlbumDetalle").html("");
				if (albumUser.val()){
					albumUser.forEach((item) => {
					  	let sal3 = `<li id ='${item.val().id}' class="collection-item avatar">
						      <img src="${item.val().archivo}" alt="" class="circle">
						      <span class="title">${tiempo(item.val().fecha)}</span>
						      <a href="#!" class="secondary-content" data-action ="true"><i class="material-icons">delete</i></a>
						`	;  
						$("#userFilesAlbumDetalle").append(sal3);
					})

				}else{
					$("#userFilesAlbumDetalle").html("<li>El usuario no tiene ninguna foto en el album.</li>");
				}
			
			})

			base.ref("posts/").orderByChild("authorId").equalTo(uid).once("value", function (postUser){
				$("#userFilesPublicacionesDetalle").html("");
				if (postUser.val()){
					postUser.forEach((item) => {
					  	let sal4 = `<li id ='${item.val().id}' class="collection-item avatar">
						      <img src="${item.val().archivo}" alt="" class="circle">
						      <span class="title">${tiempo(item.val().fecha)}</span>
						      <a href="#!" class="secondary-content" data-action ="true"><i class="material-icons">delete</i></a>
						`	;  
						$("#userFilesPublicacionesDetalle").append(sal4);
					})

				}else{
					$("#userFilesPublicacionesDetalle").html("<li>El usuario Tiene puiblicaciones .</li>");
				}
			
			})
			
		})
	}
}
/**/


var tiempo = function (ts){
		
		let date = new Date(ts);
		var options = {
		         day: 'numeric',month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
		    };

		return  date.toLocaleDateString('es', options); // 10/29/2013

}