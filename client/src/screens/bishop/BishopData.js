import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import AnimatedNumber from '../../components/AnimatedNumber';
import moment from 'moment';

class BishopData extends Component {
	fetchLeaderDetails = async id => {
		try {
			let response = await serverRequests.get(`/api/user/${id}`);

			// return response.data;
			let userList = _.uniqBy([...this.props.center.userDetails, response.data], '_id');
			this.props.AddUserDetails(userList);
		} catch (error) {
			console.log(this.props.center.userDetails);
			console.log(`error adding user details:`, error);
		}
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

	returnSontaData = (sonta = false) =>
		sonta
			? this.props.center.allCenterData.filter(obj => obj.location.includes('Sonta'))
			: this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta'));

	getAverage = param => {
		const list = this.props.navigation.getParam('data');

		// console.log('list', list);

		const sum = list.map(obj => Number(obj[param]));

		// console.log(Math.round(sum.reduce(this.reducer) / list.length));
		return Math.round(
			sum.reduce(this.reducer) / this.props.center.userDetails.filter(obj => obj.membership_type === 'Overseer').length
		);
	};

	returnDetails = param => {
		let data = this.props.center.allCenterData.find(
			element =>
				moment(this.props.navigation.getParam('data')[0].date).format('Do MMMM YYYY') ===
				moment(element.date).format('Do MMMM YYYY')
		);

		return data;
	};

	getLastDate = array => {
		let dates = array.slice().sort(function (a, b) {
			// return a > b ? 1 : a < b ? -1 : 0;
			return a.date.localeCompare(b.date);
		});

		return _.last(dates);
	};

	returnAttendance = attendance => {
		let number = '';
		// console.log(attendance);
		if (attendance.length) {
			number = attendance
				.map(obj =>
					obj.attendance.filter(
						obj => moment(obj.date).format('Do MMMM YYYY') === this.props.navigation.getParam('date')
					)
				)
				.map(obj => obj.map(obj => Number(obj.attendance_number)))
				.flat();
		} else number = '-';

		return number === '-'
			? number
			: number.length < 1
			? '-'
			: number.reduce((accumulator, current_value) => accumulator + current_value);
	};

	reducer = (accumulator, current_value) => accumulator + current_value;

	sift = (arr, param) => arr.map(element => (Number(element[param]) ? Number(element[param]) : 0));

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

				<Animatable.View animation='fadeInDown' duration={1300} delay={200}>
					<Card containerStyle={{ ...styles.card, height: 500, marginTop: -50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								marginBottom: 10,
							}}
						>
							{this.props.auth.user.center}
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
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Constituency</Text>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance</Text>
						</View>

						<FlatList
							data={this.props.center.userDetails.filter(
								obj => obj.membership_type === 'Overseer' && !obj.center.includes('Sonta')
							)}
							style={{ height: 350 }}
							showsVerticalScrollIndicator={false}
							keyExtractor={item => item._id}
							renderItem={({ item }) => {
								return this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id)) ===
									'-' ? (
									<View style={styles.row}>
										<Text
											style={{
												color:
													this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id)) ===
													'-'
														? 'red'
														: 'green',
												marginVertical: 10,
											}}
										>
											{item.center}
										</Text>

										<Text
											style={{
												color:
													this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id)) ===
													'-'
														? 'red'
														: 'green',
												marginVertical: 10,
											}}
										>
											{this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id))}
										</Text>
									</View>
								) : (
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate('SingleBishopData', {
												item: this.returnSontaData().filter(obj => obj._pastor_id === item._id),
												center: item.center,
												date: this.props.navigation.getParam('date'),
											})
										}
									>
										<View style={styles.row}>
											<Text
												style={{
													color:
														this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id)) ===
														'-'
															? 'red'
															: 'green',
													marginVertical: 10,
												}}
											>
												{item.center}
											</Text>

											<Text
												style={{
													color:
														this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id)) ===
														'-'
															? 'red'
															: 'green',
													marginVertical: 10,
												}}
											>
												{this.returnAttendance(this.returnSontaData().filter(obj => obj._pastor_id === item._id))}
											</Text>
										</View>
									</TouchableOpacity>
								);
							}}
						/>
					</Card>

					<Animatable.View animation='fadeInDown' duration={1700} delay={300}>
						<Card containerStyle={{ ...styles.card, height: 150, marginBottom: 20 }}>
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
								Average Data for {this.props.auth.user.center}
							</Text>
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
						</Card>
					</Animatable.View>
				</Animatable.View>
			</ScrollView>
		);
	}
}

BishopData['navigationOptions'] = screenProps => ({
	title: 'Home',
});

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

export default connect(mapStateToProps, null)(BishopData);
