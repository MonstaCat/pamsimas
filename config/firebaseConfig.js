import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

const firebaseConfig = {
	apiKey: "your_firebase_api_key",
	authDomain: "your-firebase.domain.com",
	databaseURL:
		"https://your-firebase-database-url.asia-southeast1.firebasedatabase.app",
	projectId: "your-project-id",
	storageBucket: "your-firebase-storage-bucket.appspot.com",
	messagingSenderId: "your_messaging_sender_id",
	appId: "your:firebase:web:appid",
	measurementId: "G-your-measurement-id"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
