$("a").click(async function (e){
	e.preventDefault();
	let men = this.getAttribute("href").split("#")[1]
	let datos = await getSetings(men)
	if (datos){
		cargarPagina(datos)
	}
	
})
var cargarPagina= function (objeto) {
	//crea la pagina 
	
	let pagina = document.createElement("div");
	pagina.id = "Pagina_" + objeto.link;
	pagina.setAttribute ("class", "col s12");

	//Agraga el titulo a la pagina 
	let tituloPag = document.createElement("h5");
	tituloPag.id = "Pagina_" + objeto.link+ "_titulo" ;
	tituloPag.append(objeto.name);
	pagina.append(tituloPag);

	//Agraga el contenedor de la tabla a la pagina
	if (objeto.tabla){
		var tabla = new Tabla(objeto);
		tabla.onLoad(function (e){
			pagina.appendChild(e)
		});
		
		
	}
	
	$("#contenido").html(pagina)
}

function getSetings (link){
		let datos = setings.menu.find(function (d){
			d = d.link === link;
		return d
		})
		return datos;
}