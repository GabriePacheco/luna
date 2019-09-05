// escuchamos los vinculos 
$("a").click(function (e){
	e.preventDefault();
	if ( !$(this).attr("data-action")){
		navegar($(this).attr("href") );	
	}else{
		if ($(this).attr("href") == "#cerrar" ){	
			auth.signOut();
			navegar("login");	
		}	
	}
})
var navegar = function(link){
	let nLink, fRespuesta;
	fRespuesta = function (e){
		console.log(e)
	}

	if (link.indexOf("#") == -1){
		nLink = "#"+link;
		
	}else{
		nLink = link;
	}
	if (nLink =="#users"){
		buscarUsuarios();
	}
	navegacion(nLink,fRespuesta);
}
var navegacion = function (url, calbak){
	
	$(".app").addClass("hide");
	$(""+url).removeClass("hide");
	calbak(url)
}