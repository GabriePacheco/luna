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
	console.log(i)
	switch (i){
		case "1":
			rol = "Estudiante";
		break;
		case "2":
			rol = "Padre de familia";
		break;
		case "3":
			rol = "Profesor";
		break;
		case "4":
			rol = "Web master";
		break;
		case "5":
			rol = "Desarollador";
		break;		

	}
	return rol;
}
/***/ 