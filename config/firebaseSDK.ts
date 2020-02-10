import firebase from 'firebase';

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyBlPXjhL-xVQNt_JkHg2H_I7LyE4TOprO0",
        authDomain: "chat-app-414e9.firebaseapp.com",
        databaseURL: "https://chat-app-414e9.firebaseio.com",
        projectId: "chat-app-414e9",
        storageBucket: "chat-app-414e9.appspot.com",
        messagingSenderId: "1086580259170",
        appId: "1:1086580259170:web:4b75ca74f6b86d78c2943b"
      });
    }
  }
  login = async (user: any, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };

  logoutUser = () => {
    firebase.auth().signOut();
  };

  createAccount = async (user: any) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function () {
          console.log(
            'created user successfully. User email:' +
            user.email +
            ' name:' +
            user.name
          );
          firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).set({
            username: user.name,
            email: user.email,
            isTyping: false,
            uid: firebase.auth().currentUser.uid,
          })
          var userf = firebase.auth().currentUser;
          userf.updateProfile({ displayName: user.name }).then(
            function () {
              console.log('Updated displayName successfully. name:' + user.name);
             
            },
            function (error) {
              console.warn('Error update displayName.');
            }
          );
        },
        function (error) {
          console.error('got error:' + typeof error + ' string:' + error.message);
          alert('Create account failed. Error: ' + error.message);
        }
      );
  };

}


const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;