var setings = {
	"appName": "Lunytha administrador",
	"version": "1.0",
	"limiteTablas":5,
	"apiKey": "AIzaSyAFZ0V3epQRnqXpzN8pkpcJesfZu-xVWlg",
    "authDomain": "lunytha-0.firebaseapp.com",
    "databaseURL": "https://lunytha-0.firebaseio.com",
    "projectId": "lunytha-0",
    "storageBucket": "lunytha-0.appspot.com",
    "messagingSenderId": "620792262555",
	"menu": [
		{
			"link": "home",
			"name": "Dashboar",
			"schema": null,
			"icon": "home",
			"mesaje":"Esta es la pagina de inico del sistema."
		},
		{
			"link": "users",
			"name": "Usuarios",
			"path":"users",
			"schema": null,
			"icon": "supervised_user_circle",
			"tabla":["Nombre", "Email", "Rol", "Aciones"],
			"tablaBuscardor": ["nombre"],
			"tablaCampos":["nombre", ,"email",{'modelo':['rol', "Estudiante", "Representante", "Profesor", "WebMaster", "Dueño"]}, {"acciones":["ver"]} ]
		},
		{
			"link": "posts",
			"name": "Publicaciones",
			"path":"posts",
			"schema": null,
			"icon": "move_to_inbox",
			"tabla":["Usuario", "fecha",  "Aciones"],
			"tablaCampos":[{"deTabla":['users', 'nombre','uid', 'authorId']}, {'fecha':['fecha']}, {"acciones":["ver", "borrar"]} ]
		},
		{
			"link": "historias",
			"name": "Historias",
			"path":"historias",
			"schema": null,
			"icon": "recent_actors",
			"tabla":["Usuario", "fecha" ],
			"tablaCampos":[{"deTabla": ['users', 'nombre', 'uid', 'userId']}, {"fecha":["fecha"]} ]
		}		
		
	]

}
