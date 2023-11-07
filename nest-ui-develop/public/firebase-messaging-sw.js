importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyA3q7GkPzd_r-BcybdqQqk1Mvtp7rrGRt8",
  authDomain: "ikarus-nest-demo.firebaseapp.com",
  projectId: "ikarus-nest-demo",
  storageBucket: "ikarus-nest-demo.appspot.com",
  messagingSenderId: "466161040020",
  appId: "1:466161040020:web:f474195957f0b662185281",
  measurementId: "G-ZHTH5477XZ"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
 
const content = payload.notification.body;
  const notificationTitle =   payload.notification.title;
  const notificationOptions = {
    body: content,
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
