class Tabla {
	constructor(datos){
		this.link = datos.link;
		this.name = datos.name;
		this.path = datos.path;
		this.tabla= datos.tabla;
		this.buscador= datos.tablaBuscardor;
		this.campos = datos.tablaCampos;
		this.html;
		this.base = base.ref(datos.link);
		this.pageSize = setings.limiteTablas;		
	}
	async init(callbak){
		let contenTabla = document.createElement("div");
		contenTabla.id = "Pagina_" +this.link+ "_contenTabla";
		contenTabla.setAttribute("class", "card-panel white col s12");
		
		// crea el limitador  
		let contenedorLimitador = document.createElement("div");
		contenedorLimitador.setAttribute("class", "col s1");
		let labelLimitador = document.createElement("label");
		labelLimitador.append("Mostrar");
		let limitador = document.createElement("input");
		limitador.id = "Pagina_" +this.link+ "_limitado";
		limitador.setAttribute("type", "number");		
		limitador.setAttribute("value", this.pageSize ) ;
		contenedorLimitador.appendChild(labelLimitador) 
		contenedorLimitador.appendChild(limitador) 
		contenTabla.appendChild(contenedorLimitador)//agrega el limitador al contenedor Tabla

		// crea el buscador 
		if (this.buscador && this.buscador[0]){
			let contenedorBuscador = document.createElement("div");
			contenedorBuscador.setAttribute("class", "col s6 offset-s5");
			let labelBuscador =  document.createElement("label");
			labelBuscador.append("Buscar");
			let buscador = document.createElement("input");
			buscador.id = "Pagina_" +this.link+ "_buscador";
			buscador.setAttribute("type", "text");
			buscador.setAttribute("placeHolder",`Buscar por ${this.buscador[0]}`);
			contenedorBuscador.appendChild(labelBuscador);
			contenedorBuscador.appendChild(buscador);
			contenTabla.appendChild(contenedorBuscador);
	
		}
		// Crea la cabecera de la tabla; 
		let table = document.createElement("table");
		table.id=   "Pagina_" +this.link+ "_tabla";
		let cabecera = document.createElement("thead");
		let cabeceraRow = document.createElement("tr");
		cabeceraRow.innerHTML= `<th>Nº</th>`;
		this.tabla.forEach((item) => {
		  cabeceraRow.innerHTML += `<th>${item}</th>`;
		})
		cabecera.append(cabeceraRow);
		table.append(cabecera);//anade la cabecera a la tabla 
		

		// cramos Cuerpo de la Tabla 
		let tBody= document.createElement("tbody");
		tBody.id =  "Pagina_" +this.link+ "_tabla_datos";
		tBody.innerHTML= "<td>Cargando...</td>"
		table.appendChild(tBody);
		contenTabla.appendChild(table);
		this.html= contenTabla;	

	}
	async load(){
		let tBody = document.getElementById("Pagina_" +this.link+ "_tabla_datos");
		tBody.innerHTML='';
		let rows = await this.filtro();
		let nums = 0;
		rows.forEach((item)=>{
			let dato = item.val();
			let key = item.key;
			nums++;
			let fila = document.createElement("tr");
			fila.innerHTML += `<td>${nums}</td>`;
			this.campos.forEach(async (campo)=>{
				if (typeof campo != 'object'){
					fila.innerHTML += `<td>${dato[campo]}</td>`;	
				}else{
					if (campo['modelo']){
						fila.innerHTML+=`<td>${campo['modelo'][dato[campo['modelo'][0]]]}</td>`;
					}
					if(campo['deTabla']){
						fila.innerHTML +=`<td class ='${dato[campo['deTabla'][3]]}'> ${dato[campo['deTabla'][3]]} </td>`;
						base.ref(campo['deTabla'][0]).orderByChild(campo['deTabla'][2])
						.equalTo(dato[campo['deTabla'][3]])
						.once("value", function (snap){
							$(`.${snap.val()[dato[campo['deTabla'][3]]][campo['deTabla'][2]]}`).html(snap.val()[dato[campo['deTabla'][3]]][campo['deTabla'][1]])
						})
					}
					if (campo['acciones']){
						let c= 12 / campo['acciones'].length  ;
						let ac = document.createElement("td");
			  			campo["acciones"].forEach((accion)=>{
			  				ac.innerHTML+=`<div class="col s${c}"><a href='#${accion}' data-id='${key}'  data-table ="${this.link}" onClick ="cargarPagina(log('${this.link}', '${accion}', '${key}'))" class='btn btn-small '>${accion}</a></div>`;	
			  			})
			  			fila.appendChild(ac);
				  	}
					if(campo['fecha']){
		  					let date = new Date(item.val()[campo['fecha'][0]]);
							var options = 
								{
							       	 day: 'numeric',month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'
								};
							fila.innerHTML+=`<td>${date.toLocaleDateString('es', options)}</td>`;	    		
					}
				}
				
			})
			
			tBody.appendChild(fila)
		});


	}
	filtro (){
		let query;
		if (! this.busqueda){
			 query = this.base.limitToFirst(this.pageSize);
		}else{
			
			query = this.base.orderByChild(this.buscador[0]).startAt(this.busqueda).limitToFirst(this.pageSize);
		}			
		return query.once("value",  (snap)=>{
			if (snap && snap.val()){
				return snap.val();
			}else{
				return "No se encontraron datos que correspondan";
			}
		})
	}
	changeLimit(){
		let nLimite = parseInt($("#" + "Pagina_" +this.link+ "_limitado").val());
		this.pageSize = nLimite;
		
		this.load()
	}
	buscar (){
		this.busqueda = $("#Pagina_" +this.link+ "_buscador").val();
		this.load()

	}
		
	async onLoad (callbak){
		await this.init();
		if (callbak && typeof callbak === 'function' ){
			callbak(this.html)	
		}
		$("#Pagina_" + this.link + "_limitado").change((e)=>{this.changeLimit(e)})
		 $("#Pagina_" +this.link+ "_buscador").change((e)=>{this.buscar(e)})
		await this.load();
	}
	dibujar (){
		return this.html;
	}
}

function log(id, accion, pathId){
	var me= getSetings(id);
	var n = {
		link: me.link,
		name: me.name, 
		path: me.path +`/${pathId}`, 
	}
	if (me.schema != null ){
		n.schema= me.schema

	}
	return n

}
