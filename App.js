import * as React from "react";
import {
	StyleSheet,
	View,
	Text,
	useColorScheme,
	SafeAreaView
} from "react-native";

import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Card from "./components/Card";

import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

function StatusScreen({ navigation }) {
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text style={styles.title}>Status</Text>

				<Text style={styles.heading}>Pompa</Text>
				<Card
					title="Status Pompa Air"
					value="Mati"
					iconName="warning"
					color="rgb(255, 159, 10)"
				/>

				<Text style={styles.heading}>Pipa</Text>
				<Card
					title="Indikasi Kebocoran"
					value="Tidak Bocor"
					iconName="alert-circle"
					color="rgb(142, 142, 147)"
				/>

				<Text style={styles.heading}>Debit</Text>
				<Card
					title="Jumlah Debit Air"
					value="2.437"
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
		<View
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<Text>Riwayat Screen</Text>
		</View>
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
