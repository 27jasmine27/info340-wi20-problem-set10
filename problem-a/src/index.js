import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css'; //using FA 4.7 atm

import App from './App'; //so our app styling is applied second

//import and configure firebase here
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBDrtlNgZ_gjnvaBuPLex5hHocA0vhJp4w",
	authDomain: "chirper-set10.firebaseapp.com",
	databaseURL: "https://chirper-set10.firebaseio.com",
	projectId: "chirper-set10",
	storageBucket: "chirper-set10.appspot.com",
	messagingSenderId: "932938034155",
	appId: "1:932938034155:web:ca6cc1e8e93e29941fc7ae"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


ReactDOM.render(<App />, document.getElementById('root'));
