// This registration token comes from the client FCM SDKs.
var registrationToken = 'fAtKoBYbvPA:APA91bEPAyzZqQCBzl0alOncdajSAxrbmQrBHumY0JZQIOE_y5QXY6IJf5KyznmD3SuUFO7UurrREmW-46rT1h-yKFfVy7-53ETAvu3--lz-_wqTOQnagWwn7qL4_9RUSdDF0Z_Nd5Jy';

var key = 'AAAAkIoaL5s:APA91bET5A94m-nB3biyQs7IPd93CEZqc0D8zTzFiXkxEEyCUe35_ccPsrDnGJRGzH_hyZ85fUaoSFk7huL_LDU-lco9n64aVGpZoxy1PGySiBoInsN4ng_VG0h9OkN72XJpN45nRtD0';
var to = registrationToken
var notification = {
  'title': 'Portugal vs. Denmark',
  'body': '5 to 1',
  'icon': 'firebase-logo.png',
  'click_action': 'http://localhost:8081'
};

fetch('https://fcm.googleapis.com/fcm/send', {
  'method': 'POST',
  'headers': {
    'Authorization': 'key=' + key,
    'Content-Type': 'application/json'
  },
  'body': JSON.stringify({
    'notification': notification,
    'to': to
  })
}).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.error(error);
})