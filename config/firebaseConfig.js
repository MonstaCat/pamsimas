import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyBDSvrxm-tYTErYoxX8AhOzruglgMuZtQ8",
	authDomain: "esp32-database-3c1ad.firebaseapp.com",
	databaseURL: "https://esp32-database-3c1ad-default-rtdb.firebaseio.com",
	projectId: "esp32-database-3c1ad",
	storageBucket: "esp32-database-3c1ad.appspot.com",
	messagingSenderId: "128794389589",
	appId: "1:128794389589:web:26ee272fcf2a54e37038dc",
	measurementId: "G-2CYRZN3BTJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
