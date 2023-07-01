import React, { useEffect, useState, useRef } from "react";
import {
	StyleSheet,
	View,
	Text,
	useColorScheme,
	SafeAreaView,
	Platform
} from "react-native";

import { off } from "firebase/database";
import { database, ref, onValue } from "./config/firebaseConfig";

import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme
} from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Card from "./components/Card";
import BarChartComponent from "./components/BarChart";

import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false
	})
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
	const message = {
		to: expoPushToken,
		sound: "default",
		title: "Pipa Terindikasi Bocor",
		body: "Segera cek pipa pada area A!",
		data: { someData: "goes here" }
	};

	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(message)
	});
}

async function registerForPushNotificationsAsync() {
	let token;
	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		alert("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C"
		});
	}

	return token;
}

function StatusScreen({ navigation }) {
	const [isRunning, setIsRunning] = useState(0);
	const [isLeak, setIsLeak] = useState(0);
	const [dayTotalVolume, setDayTotalVolume] = useState(0);

	useEffect(() => {
		const isRunningRef = ref(database, "Status/isRunning");
		const isLeakRef = ref(database, "Status/LeakConfirmed");
		const dayTotalVolumeRef = ref(database, "Sensors/totalMilliLitres1");

		const isRunningListener = onValue(isRunningRef, (snapshot) => {
			if (snapshot.exists()) {
				const value = snapshot.val();
				setIsRunning(value);
			}
		});

		const isLeakListener = onValue(isLeakRef, (snapshot) => {
			if (snapshot.exists()) {
				const value = snapshot.val();
				setIsLeak(value);
			}
		});

		const dayTotalVolumeListener = onValue(
			dayTotalVolumeRef,
			(snapshot) => {
				if (snapshot.exists()) {
					const valueInMilliliters = snapshot.val();
					const valueInLiters = valueInMilliliters / 1000;
					setDayTotalVolume(valueInLiters);
				}
			}
		);

		return () => {
			off(isRunningRef, isRunningListener);
			off(isLeakRef, isLeakListener);
			off(dayTotalVolumeRef, dayTotalVolumeListener);
		};
	}, []);

	const renderStatus = () => {
		if (isRunning === false) {
			return "Mati";
		} else if (isRunning === true) {
			return "Hidup";
		} else {
			return "Unknown";
		}
	};

	const renderLeakStatus = () => {
		if (isLeak === false) {
			return "Tidak Bocor";
		} else if (isLeak === true) {
			return "Bocor";
		} else {
			return "Unknown";
		}
	};

	const formatVolume = (value) => {
		return value.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text style={styles.title}>Status</Text>

				<Text style={styles.heading}>Pompa</Text>
				<Card
					title="Status Pompa Air"
					value={renderStatus()}
					iconName="warning"
					color="rgb(255, 159, 10)"
				/>

				<Text style={styles.heading}>Pipa</Text>
				<Card
					title="Indikasi Kebocoran"
					value={renderLeakStatus()}
					iconName="alert-circle"
					color="rgb(142, 142, 147)"
				/>

				<Text style={styles.heading}>Penggunaan</Text>
				<Card
					title="Jumlah Air Digunakan"
					value={formatVolume(dayTotalVolume)}
					iconName="bar-chart"
					color="rgb(10, 132, 255)"
					additionalText="liter"
					footerText="Per Hari Ini"
				/>
			</View>
		</SafeAreaView>
	);
}

function RiwayatScreen({ navigation }) {
	const [totalMonthVolume, setTotalMonthVolume] = useState(0);

	useEffect(() => {
		const currentYear = new Date().getFullYear(); // Get the current year
		const currentMonth = new Date().toLocaleString("en-US", {
			month: "long"
		}); // Get the current month (e.g., "July")

		const monthVolumeRef = ref(
			database,
			`pumpRunningHistory/${currentYear}/${currentMonth}`
		);

		const monthVolumeListener = onValue(monthVolumeRef, (snapshot) => {
			if (snapshot.exists()) {
				let totalMonthVolume = 0;

				snapshot.forEach((daySnapshot) => {
					const dayVolume = daySnapshot
						.child("totalMilliLitres")
						.val();
					totalMonthVolume += dayVolume;
				});

				const valueInLiters = totalMonthVolume / 1000;
				setTotalMonthVolume(valueInLiters);
			}
		});

		return () => {
			off(monthVolumeRef, monthVolumeListener);
		};
	}, []);

	const formatVolume = (value) => {
		return value.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text style={styles.title}>Riwayat</Text>
			</View>

			<Text style={styles.heading}>Riwayat Hidup Pompa (/Jam)</Text>
			<BarChartComponent />

			<Text style={styles.heading}>Total Penggunaan Air</Text>
			<Card
				title="Total Penggunaan Bulan Ini"
				value={formatVolume(totalMonthVolume)}
				iconName="bar-chart"
				color="rgb(10, 132, 255)"
				additionalText="liter"
				footerText={`Terakhir diperbarui ${new Date().toLocaleDateString()}`}
			/>
		</SafeAreaView>
	);
}

const Tab = createBottomTabNavigator();

export default function App() {
	const scheme = useColorScheme();

	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		const isLeakConfirmedRef = ref(database, "Status/LeakConfirmed");

		const isLeakConfirmedListener = onValue(
			isLeakConfirmedRef,
			(snapshot) => {
				if (snapshot.exists() && snapshot.val() === true) {
					sendPushNotification(expoPushToken);
				}
			}
		);

		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					console.log(response);
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(
				responseListener.current
			);
			off(isLeakConfirmedRef, isLeakConfirmedListener);
		};
	}, []);

	return (
		<NavigationContainer
			theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
			<StatusBar style="auto" />

			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === "Status") {
							iconName = focused ? "ios-water" : "ios-water";
						} else if (route.name === "Riwayat") {
							iconName = focused
								? "document-text"
								: "document-text";
						}

						return (
							<Ionicons
								name={iconName}
								size={size}
								color={color}
							/>
						);
					},
					tabBarActiveTintColor: "rgb(10, 132, 255)",
					tabBarInactiveTintColor: "gray",
					headerShown: false,
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					tabBarLabelStyle: {
						fontSize: 11
					}
				})}>
				<Tab.Screen name="Status" component={StatusScreen} />
				<Tab.Screen name="Riwayat" component={RiwayatScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20
	},
	title: {
		fontSize: 33,
		fontWeight: "bold",
		color: "#fff",
		paddingTop: 50
	},
	heading: {
		fontSize: 21,
		fontWeight: "bold",
		color: "#fff",
		paddingTop: 20
	}
});
