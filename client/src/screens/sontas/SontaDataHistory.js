import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

import styles from '../../styles/style';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';

class SontaDataHistory extends Component {
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

	getDataForDate = date => {
		// console.log(
		// 	this.props.center.centerData.attendance.filter(
		// 		obj => obj.date === lastDate.date
		// 	)
		// );

		return this.props.center.centerData.attendance.filter(
			obj => moment(obj.date).format('Do MM YY') === moment(date).format('Do MM YY')
		);
	};

	returnDataLabels = () => {
		if (_.isEmpty(this.props.center.centerData.attendance)) {
			return ['0/0'];
		}

		const dates = this.returnUniqueArray(
			this.props.center.centerData.attendance.slice().sort(function (a, b) {
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
		if (_.isEmpty(this.props.center.centerData.attendance)) {
			return [0];
		}

		const dates = this.returnUniqueArray(
			this.props.center.centerData.attendance.slice().sort(function (a, b) {
				return a.date.localeCompare(b.date);
			})
		);

		if (dates.length >= 7) {
			return _.slice(dates, dates.length - 8).map(e => Number(e.attendance_number));
		} else {
			return dates.map(e => Number(e.attendance_number));
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
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center').replace('Sonta', '')
								: this.props.auth.user.center.replace('Sonta', '')}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center').replace('Sonta', '')
								: this.props.auth.user.center.replace('Sonta', '')}{' '}
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
						<Text
							style={{
								textAlign: 'center',
								borderColor: '#dcdcdc',
								fontWeight: 'bold',
								marginVertical: 10,
							}}
						>
							FULL DATA HISTORY
						</Text>

						<View style={styles.row}>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Date</Text>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance Number</Text>
						</View>
						<FlatList
							data={this.returnUniqueArray(
								this.props.center.centerData.attendance
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
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate('ViewSontaLeaderDataHistory', {
												data: item,
												center: this.props.navigation.getParam('center'),
												date: moment(item.date).format('Do MMMM YYYY'),
											})
										}
									>
										<View style={styles.row}>
											<Text style={{ color: 'black', marginVertical: 10 }}>{moment(item.date).format('dddd, ll')}</Text>

											<Text style={{ color: 'black', marginVertical: 10 }}>
												{this.sift(this.getDataForDate(item.date), 'attendance_number').reduce(this.reducer)}
											</Text>
										</View>
									</TouchableOpacity>
								);
							}}
							keyExtractor={item => item._id}
							ItemSeparatorComponent={this.renderSeparator}
						/>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

SontaDataHistory['navigationOptions'] = screenProps => ({
	title: 'Data History',
});

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

export default connect(mapStateToProps, null)(SontaDataHistory);
