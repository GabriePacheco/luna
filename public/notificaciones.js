
var notificaciones = function (){
	messaging.requestPermission().then(function() {
		hToken()

	}).catch(function(err) {
	  console.log('no resive notificaciones', err);

	});
	messaging.onTokenRefresh(function (){
		hToken();
	})
		
;
}

var hToken = function (){
	return messaging.getToken()
	.then(function (current){
		if (current){
		
			base.ref("tokenNotificaciones/").child(current).set({
				token: current,
				uid: userInline.uid,
				fecha: mt()
			})
		}
	})
}
messaging.onMessage(function(payload) {
   M.toast({html:payload.notification["title"] } );
   console.log(payload)
})

