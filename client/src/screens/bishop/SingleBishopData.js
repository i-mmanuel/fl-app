import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import moment from 'moment';

class SingleBishopData extends Component {
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
					<Card containerStyle={{ ...styles.card, height: 600, marginTop: -50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								marginBottom: 10,
							}}
						>
							{this.props.navigation.getParam('center')}
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
							data={this.props.navigation.getParam('item')}
							style={{ height: 500 }}
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
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate('CentreView', {
												center: item.location,
												userID: item._leader_id,
												date: moment(item.date).format('Do MMMM YYYY'),
											})
										}
									>
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
									</TouchableOpacity>
								);
							}}
						/>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

SingleBishopData['navigationOptions'] = screenProps => ({
	title: 'Centres',
});

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

export default connect(mapStateToProps, null)(SingleBishopData);
