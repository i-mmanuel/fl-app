import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import AnimatedNumber from '../../components/AnimatedNumber';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import moment from 'moment';

class BishopConstituencies extends Component {
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
		const arrayOfLocation = this.props.navigation.getParam('data');

		if (!_.isEmpty(arrayOfLocation)) {
			const lastDate = this.getLastDate(arrayOfLocation);
			// console.log(
			// 	this.props.center.centerData.attendance.filter(
			// 		obj => obj.date === lastDate.date
			// 	)
			// );

			// console.log(this.props.navigation.getParam('data'));

			return this.sift(
				arrayOfLocation.filter(obj => moment(obj.date).format('Do MM YY') === moment(lastDate.date).format('Do MM YY')),
				'attendance_number'
			).reduce(this.reducer);
		} else {
			return 0;
		}
		// this.sift(this.getRecentData(), 'attendance_number').reduce(this.reducer);
	};

	returnDetails = param => {
		let data = this.props.center.allCenterData
			.filter(obj => !obj.location.includes('Sonta'))
			.find(
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

	returnAttendance = (attendance, param = 'attendance_number') => {
		let number = '';
		// console.log(attendance);
		if (attendance.length) {
			number = attendance
				.map(obj =>
					obj.attendance.filter(
						obj => moment(obj.date).format('Do MMMM YYYY') === this.props.navigation.getParam('date')
					)
				)
				.map(obj => obj.map(obj => Number(obj[param])))
				.flat();
		} else number = 0;

		return number === 0
			? number
			: number.length < 1
			? 0
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

				<Animatable.View
					animation='fadeInDown'
					duration={1300}
					delay={200}
					style={{ marginTop: -80, marginBottom: 50 }}
				>
					{/* <View style={{ height: 190 }}> */}
					{this.props.center.userDetails
						.filter(obj => obj.membership_type === 'Overseer' && !obj.center.includes('Sonta'))
						.map(item => (
							<Card
								containerStyle={{
									...styles.card,
									height: 180,
									marginBottom: 10,
								}}
							>
								<Text
									style={{
										textAlign: 'center',
										fontWeight: 'bold',
										marginTop: 20,
										fontSize: 20,
									}}
								>
									{item.center}
								</Text>
								<Text
									style={{
										textAlign: 'center',
										marginTop: 5,
										fontSize: 12,
									}}
								>
									CURRENT DATE: {this.props.navigation.getParam('date')}
								</Text>

								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										marginTop: 25,
										marginBottom: 15,
									}}
								>
									<AnimatedNumber
										title='ATT'
										number={this.returnAttendance(
											this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
										)}
									/>
									<AnimatedNumber
										title='FTS'
										number={this.returnAttendance(
											this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id),
											'number_first_timers'
										)}
									/>
									<AnimatedNumber
										title='CON'
										number={this.returnAttendance(
											this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id),
											'number_of_converts'
										)}
									/>
									<AnimatedNumber
										title='NBS'
										number={this.returnAttendance(
											this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id),
											'started_nbs'
										)}
									/>
									<AnimatedNumber
										title='FNBS'
										number={this.returnAttendance(
											this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id),
											'finished_nbs'
										)}
									/>
								</View>
							</Card>
						))}
					{/* <FlatList
								data={this.props.center.userDetails.filter(obj => obj.membership_type === 'Overseer')}
								style={{ height: 300 }}
								showsVerticalScrollIndicator={false}
								keyExtractor={item => item._id}
								renderItem={({ item }) => {
									return this.returnAttendance(
										this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
									) === '-' ? (
										<View style={styles.row}>
											<Text
												style={{
													color:
														this.returnAttendance(
															this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
														) === '-'
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
														this.returnAttendance(
															this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
														) === '-'
															? 'red'
															: 'green',
													marginVertical: 10,
												}}
											>
												{this.returnAttendance(
													this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
												)}
											</Text>
										</View>
									) : (
										<TouchableOpacity
											onPress={() =>
												this.props.navigation.navigate('SingleBishopData', {
													item: this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id),
													date: this.props.navigation.getParam('date'),
												})
											}
										>
											<View style={styles.row}>
												<Text
													style={{
														color:
															this.returnAttendance(
																this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
															) === '-'
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
															this.returnAttendance(
																this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
															) === '-'
																? 'red'
																: 'green',
														marginVertical: 10,
													}}
												>
													{this.returnAttendance(
														this.props.center.allCenterData.filter(obj => obj._pastor_id === item._id)
													)}
												</Text>
											</View>
										</TouchableOpacity>
									);
								}}
							/> */}
					{/* </View> */}
				</Animatable.View>
			</ScrollView>
		);
	}
}

BishopConstituencies['navigationOptions'] = screenProps => ({
	title: 'Constituencies',
});

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

export default connect(mapStateToProps, null)(BishopConstituencies);
