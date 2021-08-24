import React, { Component } from 'react';
import { Text, View, Image, Alert } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import AnimatedNumber from '../../components/AnimatedNumber';
import moment from 'moment';
import serverRequests from '../../api/serverRequests';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ActivityIndicator } from 'react-native';

class ConstituencyDataHistory extends Component {
	returnUniqueArray = a => {
		let arr = [];

		a.slice().map(e => {
			if (arr.find(i => moment(i.date).format('Do MMMM YYYY') === moment(e.date).format('Do MMMM YYYY'))) {
				console.log();
			} else {
				arr.push(e);
			}
		});

		return arr;
	};

	center = this.props.center.allCenterData
		.map(obj => obj.attendance)
		.flat()
		.filter(obj => {
			return !_.isEmpty(obj);
		});

	getDataForDate = date => {
		return this.center.filter(obj => moment(obj.date).format('Do MM YY') === moment(date).format('Do MM YY'));
	};

	returnDataLabels = () => {
		if (_.isEmpty(this.center)) {
			return ['0/0'];
		}

		const dates = this.returnUniqueArray(
			this.center.slice().sort(function (a, b) {
				return a.date.localeCompare(b.date);
			})
		);

		if (dates.length >= 7) {
			return _.slice(dates, dates.length - 8).map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM'));
		} else {
			return dates.map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM'));
		}
	};

	returnDataSets = () => {
		if (_.isEmpty(this.center)) {
			return [0];
		}

		const dates = this.returnUniqueArray(
			this.center.slice().sort(function (a, b) {
				return a.date.localeCompare(b.date);
			})
		);

		if (dates.length >= 7) {
			return _.slice(dates, dates.length - 8).map(e =>
				Number(this.sift(this.getDataForDate(e.date), 'attendance_number').reduce(this.reducer))
			);
		} else {
			return dates.map(e => Number(this.sift(this.getDataForDate(e.date), 'attendance_number').reduce(this.reducer)));
		}
	};

	reducer = (accumulator, current_value) => accumulator + current_value;

	sift = (arr, param) => arr.map(element => Number(element[param]));

	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={500}
					delay={150}
				>
					<Image
						style={[styles.homePageImage, { marginTop: 80 }]}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1000} delay={200}>
					<Card
						containerStyle={{
							...styles.card,
							height: 100,
							alignItems: 'center',
							marginTop: -50,
						}}
					>
						<Text
							style={{
								fontWeight: 'bold',
								fontSize: 25,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							{this.props.auth.user.center.replace('Sonta', '')}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							Full Data History
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300} delay={250}>
					<LineChart
						data={{
							labels: this.returnDataLabels(),
							datasets: [{ data: this.returnDataSets() }],
						}}
						width={Dimensions.get('window').width - 28} // from react-native
						height={280}
						yAxisInterval={5} // optional, defaults to 1
						chartConfig={{
							backgroundColor: 'black',
							backgroundGradientFrom: 'grey',
							backgroundGradientTo: 'black',
							decimalPlaces: 0, // optional, defaults to 2dp
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForDots: {
								r: '8',
								strokeWidth: '2',
								stroke: '#9d0d0e',
							},
						}}
						bezier
						style={{
							marginTop: 15,
							marginLeft: 15,
							borderRadius: 16,
						}}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1500} delay={250}>
					<Card containerStyle={{ ...styles.card, height: 350, marginBottom: 50 }}>
						<View style={styles.row}>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Date</Text>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance</Text>
						</View>
						<FlatList
							data={this.returnUniqueArray(
								this.center
									.slice()
									.sort(function (a, b) {
										return a.date.localeCompare(b.date);
									})
									.reverse()
							)}
							style={{ height: 230 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => {
								return (
									// <TouchableOpacity
									// 	onPress={() =>
									// 		this.props.navigation.navigate('ViewLeaderHistoryData', {
									// 			data: item,
									// 			center: this.props.navigation.getParam('center'),
									// 			date: moment(item.date).format('Do MMMM YYYY'),
									// 		})
									// 	}
									// >
									<View style={styles.row}>
										<Text style={{ color: 'black', marginVertical: 10 }}>
											{moment(item.date).format('Do MMMM YYYY')}
										</Text>

										<Text style={{ color: 'black', marginVertical: 10 }}>
											{this.sift(this.getDataForDate(item.date), 'attendance_number').reduce(this.reducer)}
										</Text>
									</View>
									// </TouchableOpacity>
								);
							}}
							keyExtractor={item => item._id}
							ItemSeparatorComponent={this.renderSeparator}
						/>
					</Card>
				</Animatable.View>
				{/* {console.log(this.getDates(this.props.center.centerData.attendance))} */}
			</ScrollView>
		);
	}
}

ConstituencyDataHistory['navigationOptions'] = screenProps => ({
	title: 'Centres Data',
});

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, null)(ConstituencyDataHistory);
