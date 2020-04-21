var tabla = function (datos){
	let tabla= `<div class="row">
    <div class="col s12 ">
      <div id ="panel" class="card-panel">
      	<div class="col s1"><label>Mostar: </label><input type="number"  onChange="limitar('${datos.link}','${datos.name}_limite')"  id ="${datos.name}_limite" value=${setings.limiteTablas}></div>
      	<div class="col s10"></div>
      `;

    tabla+= `<table id = '${datos.name}'>
        	<thead>
          	<tr>`;
	datos.tabla.forEach((item) => {
	  tabla += `<th>`+item+`</th>`
	})

              
    tabla+=`</tr>
        </thead>`  ;
     tabla+=`<tbody>` ;
     
    consulta (datos)	;
     tabla+=`</tbody>`; 	
    
     tabla+=`</div>
       </div>
  </div>`;
	return tabla;

}
var consulta = function (p){
	base.ref(p.path).once("value", function (e){
		let totalPaginas = Math.round(e.numChildren() / setings.limiteTablas)
		 base.ref(p.path).limitToLast(setings["limiteTablas"]).once("value", function (snap){
			if (snap && snap.val() ){

				let num = 0;
				let tbody = ``;
				snap.forEach((item) => {
					num ++;
				  tbody  += `<tr>`;
				  tbody  += `<td>${num}</td> `;
				  p.tablaCampos.forEach(async (campo)=>{
				  	if (typeof campo != 'object'){
				  		tbody+=`<td>${item.val()[campo]}</td>`;	
				  	}else{
				  		if (campo['acciones']){
				  			tbody+=`<td>`;
				  			campo["acciones"].forEach((accion)=>{
				  				tbody+=`<a href='#${accion}' data-id='${item.key}' class='btn btn-small '>${accion}</a>`;	
				  			})
				  			tbody+=`</td>`;
				  		}
				  		if (campo['modelo']){
				  			tbody+=`<td>`;
				  			tbody += campo['modelo'][item.val()[campo['modelo'][0]]]
				  			tbody+=`</td>`;

				  		}
				  		if (campo['deTabla']){
				  			tbody+=`<td class='${item.val()[campo['deTabla'][3]]}'></td>`;
				  			 base.ref(campo['deTabla'][0])
				  			 .orderByChild(campo['deTabla'][2])
				  			 .equalTo(item.val()[campo['deTabla'][3]])
				  			 .once('value', function (snap){
				  				 tbody+=`<td>` + snap.val()[item.val()[campo['deTabla'][3]]][campo['deTabla'][1]] + `</td>`	
				  			$("." + snap.val()[item.val()[campo['deTabla'][3]]][campo['deTabla'][2]]).html(snap.val()[item.val()[campo['deTabla'][3]]][campo['deTabla'][1]])
				  				 
				  			})
				  		}
				  		if (campo['fecha']){

		  					let date = new Date(item.val()[campo['fecha'][0]]);
							var options = 
								{
							       	 day: 'numeric',month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
								};
							tbody+=`<td>${date.toLocaleDateString('es', options)}</td>`;	    		
							
						}
				  	}
				  
				  	
				  })
			
				  tbody  += `</tr>`;


				})
				$("#"+ p.name + " tbody").html(tbody);
			}
		 })
		 let paginas =`
		 <div id ="paginacion" class="truncate">
		  <ul class="pagination">`;
		 for (var i = 0; i < totalPaginas; i++ ){
		 	paginas += `<li><a href='${i}'>${i}</a></li>`
		 }

		 paginas +=`</ul></div>`;
		 $("#panel").append(paginas)	

	}) 

}


var limitar = function (link, second){

	
	var nLimite = parseInt(document.getElementById(second).value) 
	setings.limiteTablas = nLimite;
	let datos =  setings.menu.find(function (d){
		return d.link === link;
	})
	consulta(datos)
}