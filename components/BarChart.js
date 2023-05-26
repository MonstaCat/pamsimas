import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const getRandomData = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const BarChartComponent = () => {
	const screenWidth = Dimensions.get("window").width;

	const data = {
		labels: daysOfWeek,
		datasets: [
			{
				data: daysOfWeek.map(() => getRandomData(4, 10))
			}
		]
	};

	return (
		<View style={styles.container}>
			<BarChart
				data={data}
				width={screenWidth - 40}
				height={250}
				showValuesOnTopOfBars={true}
				fromZero={true}
				chartConfig={{
					backgroundColor: "transparent",
					backgroundGradientFrom: "transparent",
					backgroundGradientTo: "transparent",
					decimalPlaces: 0,
					color: (opacity = 0) => `rgba(255, 214, 10, ${opacity})`,
					style: {
						borderRadius: 16
					},
					propsForDots: {
						r: "0"
					},
					barPercentage: 1.0,
					minBarLength: 1
				}}
				style={styles.chart}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center"
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
		paddingRight: 0
	}
});

export default BarChartComponent;
