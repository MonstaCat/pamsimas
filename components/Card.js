import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Card = ({
	title,
	value,
	iconName,
	color,
	additionalText,
	footerText
}) => {
	return (
		<View style={styles.card}>
			<Text style={styles.title}>
				<Ionicons name={iconName} color={color} size={16} />
				<Text style={{ color }}>&nbsp;{title}</Text>
			</Text>
			<Text>
				<Text style={styles.value}>{value}</Text>
				<Text style={styles.additionalText}>
					&nbsp;{additionalText}
				</Text>
			</Text>
			{footerText ? (
				<Text style={styles.footerText}>{footerText}</Text>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "rgb(28, 28, 30)",
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		marginTop: 10,
		marginBottom: 15
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 15,
		color: "rgb(142, 142, 147)"
	},
	value: {
		fontSize: 24,
		fontWeight: "800",
		color: "#fff"
	},
	additionalText: {
		fontSize: 16,
		fontWeight: "500",
		color: "rgb(142, 142, 147)"
	},
	footerText: {
		fontSize: 16,
		fontWeight: "500",
		color: "rgb(142, 142, 147)",
		marginTop: 3
	}
});

export default Card;
