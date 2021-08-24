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
import { ActivityIndicator } from 'react-native';

class CentersData extends Component {
	state = {
		loading: false,
		leaders: [],
	};

	getAverage = (param, sonta = false) => {
		const list = sonta
			? this.props.center.allCenterData
					.filter(obj => obj.location.includes('Sonta'))
					.map(obj => obj.attendance)
					.flat()
			: this.props.center.allCenterData
					.filter(obj => !obj.location.includes('Sonta'))
					.map(obj => obj.attendance)
					.flat();

		const sum = list.map(obj => Number(obj[param])).flat();

		// console.log(Math.round(sum.reduce(this.reducer) / list.length));
		return Math.round(sum.reduce(this.reducer) / this.props.center.allCenterData.length);
	};

	returnLeaderName = id => {
		let name = '';
		this.props.center.userDetails.find(el => {
			if (el._id === id) {
				name = `${el.first_name} ${el.last_name}`;
			}
		});

		return name;
	};

	getLastDate = array => {
		let dates = array.slice().sort(function (a, b) {
			// return a > b ? 1 : a < b ? -1 : 0;
			return a.date.localeCompare(b.date);
		});

		return _.last(dates);
	};

	getRecentData = location => {
		const arrayOfLocation = this.props.center.allCenterData.filter(obj => obj.location === location);

		if (!_.isEmpty(arrayOfLocation)) {
			const lastDate = this.getLastDate(arrayOfLocation.map(el => el.attendance).flat());
			// console.log(
			// 	this.props.center.centerData.attendance.filter(
			// 		obj => obj.date === lastDate.date
			// 	)
			// );

			return this.sift(
				arrayOfLocation
					.map(el => el.attendance)
					.flat()
					.filter(obj => moment(obj.date).format('Do MM YY') === moment(lastDate.date).format('Do MM YY')),
				'attendance_number'
			).reduce(this.reducer);
		} else {
			return '-';
		}
		// this.sift(this.getRecentData(), 'attendance_number').reduce(this.reducer);
	};

	// isSonta = () => (this.props.auth.user.center.includes('Sonta') ? true : false);

	filterSonta = () =>
		this.props.navigation.getParam('showSonta')
			? this.props.center.allCenterData.filter(obj => obj.location.includes('Sonta'))
			: this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta'));

	reducer = (accumulator, current_value) => accumulator + current_value;

	sift = (arr, param) => arr.map(element => Number(element[param]));

	returnDetails = param => {
		let data = this.props.center.allCenterData.find(
			element =>
				moment(this.props.navigation.getParam('data')[0].date).format('Do MMMM YYYY') ===
				moment(element.date).format('Do MMMM YYYY')
		);

		return data;
	};

	returnAttendance = attendance => {
		let number = '';
		if (
			attendance.filter(obj => moment(obj.date).format('Do MMMM YYYY') === this.props.navigation.getParam('date'))
				.length
		) {
			number = attendance
				.filter(obj => moment(obj.date).format('Do MMMM YYYY') === this.props.navigation.getParam('date'))
				.map(el => Number(el.attendance_number))
				.reduce((accumulator, current_value) => accumulator + current_value);
		} else number = '-';

		return number;
	};

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render() {
		return (
			<Animatable.View animation='fadeInDown' duration={1000} delay={200}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Animatable.View
						style={{ backgroundColor: '#9d0d0e', height: 280 }}
						animation='fadeIn'
						duration={500}
						delay={150}
					>
						<Image
							style={{ ...styles.homePageImage, marginTop: 100 }}
							source={require('../../assets/images/whitelogowithoutchurch.png')}
						/>
					</Animatable.View>

					<Animatable.View animation='fadeInDown' duration={1300} delay={200}>
						<Card containerStyle={{ ...styles.card, height: 450, marginTop: -50 }}>
							<Text
								style={{
									textAlign: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									marginBottom: 10,
								}}
							>
								All Current Data
							</Text>
							<Text
								style={{
									textAlign: 'center',
									fontSize: 13,
									marginBottom: 20,
								}}
							>
								Data For {this.props.navigation.getParam('date')}
							</Text>

							<View style={styles.row}>
								<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Centre</Text>
								<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance</Text>
							</View>

							<FlatList
								data={this.filterSonta()}
								style={{ height: 310 }}
								showsVerticalScrollIndicator={false}
								keyExtractor={item => item._id}
								renderItem={({ item }) => {
									return this.returnAttendance(item.attendance) === '-' ? (
										<View style={styles.row}>
											<Text
												style={{
													color: this.returnAttendance(item.attendance) === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{item.location}
											</Text>

											<Text
												style={{
													color: this.returnAttendance(item.attendance) === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnAttendance(item.attendance)}
											</Text>
										</View>
									) : (
										// <TouchableOpacity
										// 	onPress={() =>
										// 		this.props.navigation.navigate('AllCenterData', {
										// 			data: item.attendance,
										// 			center: item.location,
										// 			date: this.props.navigation.getParam('date'),
										// 		})
										// 	}
										// >
										<View style={styles.row}>
											<Text
												style={{
													color: this.returnAttendance(item.attendance) === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{item.location}
											</Text>

											<Text
												style={{
													color: this.returnAttendance(item.attendance) === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.getRecentData(item.location)}
											</Text>
										</View>
										// </TouchableOpacity>
									);
								}}
							/>
						</Card>
					</Animatable.View>

					<Animatable.View animation='fadeInDown' duration={1700} delay={300}>
						<Card containerStyle={{ ...styles.card, height: 230, marginBottom: 50 }}>
							<Text
								style={{
									textAlign: 'center',
									borderColor: '#dcdcdc',
									fontSize: 15,
									fontWeight: 'bold',
									marginTop: 20,
									marginBottom: 10,
								}}
							>
								Average Data for {this.props.auth.user.center.replace('Sonta', '')}
							</Text>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('ConstituencyDataHistory')}>
								{this.props.navigation.getParam('showSonta') ? (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'center',
											marginVertical: 10,
										}}
									>
										<AnimatedNumber title='ATT' number={this.getAverage('attendance_number', true)} />
										<AnimatedNumber title='REH' number={this.getAverage('rehearsed_number', true)} />
										<AnimatedNumber title='MIN' number={this.getAverage('ministered_number', true)} />
									</View>
								) : (
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'center',
											marginVertical: 10,
										}}
									>
										<AnimatedNumber title='ATT' number={this.getAverage('attendance_number')} />
										<AnimatedNumber title='FTS' number={this.getAverage('number_first_timers')} />
										<AnimatedNumber title='CON' number={this.getAverage('number_of_converts')} />
										<AnimatedNumber title='NBS' number={this.getAverage('started_nbs')} />
										<AnimatedNumber title='FNBS' number={this.getAverage('finished_nbs')} />
									</View>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									...styles.errorMessage,
									marginTop: 30,
									backgroundColor: '#9d0d0e',
									// backgroundColor: 'grey',
								}}
								onPress={() => this.props.navigation.navigate('ConstituencyDataHistory')}
							>
								<Text style={{ ...styles.buttonTitle }}>FULL DATA HISTORY</Text>
							</TouchableOpacity>
						</Card>
					</Animatable.View>
				</ScrollView>
			</Animatable.View>
		);
	}
}

CentersData['navigationOptions'] = screenProps => ({
	title: 'All Centre Data',
});

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, null)(CentersData);
