import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { database, ref, onValue } from "../config/firebaseConfig";
import moment from "moment";

const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const BarChartComponent = () => {
	const screenWidth = Dimensions.get("window").width;
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		// Calculate the start and end dates of the current week
		const currentDate = moment();
		const startOfWeek = currentDate.clone().startOf("isoWeek");
		const endOfWeek = currentDate.clone().endOf("isoWeek");

		// Format the dates as needed for Firebase query
		const startDateString = startOfWeek.format("YYYY/MM/DD");
		const endDateString = endOfWeek.format("YYYY/MM/DD");

		// Fetch data from Firebase for the current week
		const fetchChartData = async () => {
			try {
				const snapshot = await onValue(
					ref(database, "pumpRunningHistory"),
					(snapshot) => {
						const data = snapshot.val();
						if (data) {
							const currentYear = moment().format("YYYY");
							const yearData = data[currentYear];

							if (yearData) {
								const formattedChartData = daysOfWeek.map(
									() => 0
								); // Initialize chart data with 0 values

								Object.entries(yearData).forEach(
									([month, monthData]) => {
										Object.entries(monthData).forEach(
											([day, dayData]) => {
												const runningTimeInSeconds =
													dayData.runningTime;
												const runningTimeInMinutes =
													runningTimeInSeconds / 60; // Convert running time to minutes
												const dayOfWeek = moment(
													day,
													"DD"
												).isoWeekday();
												formattedChartData[
													dayOfWeek - 1
												] += runningTimeInMinutes; // Accumulate running time for each day of the week
											}
										);
									}
								);

								setChartData(formattedChartData);
							}
						}
					}
				);

				return () =>
					off(ref(database, "pumpRunningHistory"), "value", snapshot);
			} catch (error) {
				console.error(
					"Failed to fetch chart data from Firebase:",
					error
				);
			}
		};

		fetchChartData();
	}, []);

	const formatValue = (value) => {
		const hours = Math.round(value * 60 * 10) / 10; // Convert value to hours and round to one decimal place
		return hours.toFixed(1); // Return the formatted value with one decimal place
	};

	// Format the chart data with the desired format
	const formattedData = {
		labels: daysOfWeek,
		datasets: [
			{
				data: chartData.map(
					(value) => Math.round((value / 60) * 10) / 10
				) // Convert minutes to hours and round to one decimal place
			}
		]
	};

	return (
		<View style={styles.container}>
			{chartData.length > 0 && (
				<BarChart
					data={formattedData}
					width={screenWidth - 40}
					height={250}
					showValuesOnTopOfBars={true}
					fromZero={true}
					chartConfig={{
						backgroundColor: "transparent",
						backgroundGradientFrom: "transparent",
						backgroundGradientTo: "transparent",
						decimalPlaces: 1,
						color: (opacity = 0) =>
							`rgba(255, 214, 10, ${opacity})`,
						style: {
							borderRadius: 16
						},
						propsForDots: {
							r: "0"
						},
						barPercentage: 1.0,
						minBarLength: 1,
						formatValue: formatValue // Use the custom formatValue function
					}}
					style={styles.chart}
				/>
			)}
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
