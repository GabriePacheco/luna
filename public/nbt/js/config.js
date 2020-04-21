$("#app").height(document.documentElement.clientHeight);
$("title").html(setings.appName)
$("#menuPageName").html(setings.appName)

var generarMenu = function (){
	let menus = ``;
	setings.menu.forEach((setings) => {
		menus += `<a href="#${setings.link}"
				 class="collection-item" data-path="${setings.path}">
				 <i class="material-icons left ">${setings.icon}</i>
				  <span class="truncate">${setings.name}</span>
				  </a>`;	  
	})
	$("#menu").append(menus)
}

var base;
var auth;
var conectarFirebase = function(){
 var firebaseConfig = {
    apiKey: setings.apiKey,
    authDomain: setings.authDomain,
    databaseURL: setings.databaseURL,
    projectId: setings.projectId,
    storageBucket: setings.storageBucket,
    messagingSenderId: setings.messagingSenderId
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  	 auth = firebase.auth();
	base  = firebase.database();

}
conectarFirebase();
generarMenu();