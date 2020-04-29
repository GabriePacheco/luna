const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
const laBase = functions.database;
const base = admin.database()
exports.notificarNuevoPost = laBase.ref("/posts/{postId}/")
.onCreate(async (snap, context)=>{
	const nuevoPost = snap.val();
	var playLoad = {}
	playLoad.notification= {
    	"title": "Nueva publicación",
    	"body": "Se agrego información en la agenda Lunytha ",
        "sound":"default",
      	"click_action": "https://lunytha-0.firebaseapp.com/"
    }
    return await base.ref("users/" + nuevoPost.authorId ).once("value", async (snapUser)=>{
    	  	playLoad.notification.icon = snapUser.val().photoURL;
    	  	playLoad.notification.title += " de " +  snapUser.val().nombre;
    	  	await base.ref("/tokenNotificaciones/" ).once("value", (snapTokens)=>{
    	  		  		const snap = snapTokens.val();
    	  		  		const sendTokes=Object.keys(snap);
    	  		  		return admin.messaging().sendToDevice(sendTokes, playLoad)
    	  		  		.then((reponse)= console.info(sendTokes) );	
    	  		  })		
    	  })
})	
