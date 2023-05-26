import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	useColorScheme,
	SafeAreaView
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

function StatusScreen({ navigation }) {
	const [isRunning, setIsRunning] = useState(0);
	const [isLeak, setIsLeak] = useState(0);
	const [dayTotalVolume, setDayTotalVolume] = useState(0);

	useEffect(() => {
		const isRunningRef = ref(database, "Status/isRunning");
		const isLeakRef = ref(database, "Status/isLeak");
		const dayTotalVolumeRef = ref(database, "Status/dayTotalVolume");

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
					const value = snapshot.val();
					setDayTotalVolume(value);
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
		if (isRunning === 0) {
			return "Mati";
		} else if (isRunning === 1) {
			return "Hidup";
		} else {
			return "Unknown";
		}
	};

	const renderLeakStatus = () => {
		if (isLeak === 0) {
			return "Tidak Bocor";
		} else if (isLeak === 1) {
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
				value="123.456"
				iconName="bar-chart"
				color="rgb(10, 132, 255)"
				additionalText="liter"
				footerText="Terakhir diperbarui 18/05/2022"
			/>
		</SafeAreaView>
	);
}

const Tab = createBottomTabNavigator();

export default function App() {
	const scheme = useColorScheme();

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
