import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyAzyAYysQNeR4LtxCo3OmpK-WfJ3XHxnY0",
	authDomain: "pamsimas-firebase.firebaseapp.com",
	databaseURL:
		"https://pamsimas-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "pamsimas-firebase",
	storageBucket: "pamsimas-firebase.appspot.com",
	messagingSenderId: "559807259172",
	appId: "1:559807259172:web:4937ff9c7480743524aeb1",
	measurementId: "G-RDTKFEF3VL"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
