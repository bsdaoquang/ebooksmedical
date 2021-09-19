import * as firebase from 'firebase'
import "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyDhmPu2wlJm0F-abhTzF_nbHKLoqxk_tYg",
	authDomain: "thuvien-eef7b.firebaseapp.com",
	databaseURL: "https://thuvien-eef7b-default-rtdb.firebaseio.com",
	projectId: "thuvien-eef7b",
	storageBucket: "thuvien-eef7b.appspot.com",
	messagingSenderId: "798860776333",
	appId: "1:798860776333:web:e7590b701311025c8263c4",
	measurementId: "G-QHGX5B3F6S"
};
  // Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
