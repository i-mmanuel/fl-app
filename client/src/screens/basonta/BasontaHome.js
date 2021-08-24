import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import DrawerToggle from '../../components/DrawerToggle';
import styles from '../../styles/style';
import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart,
} from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable';
import AnimatedNumber from '../../components/AnimatedNumber';
import serverRequests from '../../api/serverRequests';
import { AddAttendance } from '../../actions';
import _ from 'lodash';
import moment from 'moment';
import { Dimensions } from 'react-native';
import PushNotificationAPI from '../../api/PushNotificationAPI';

class BasontaHome extends Component {
	state = {
		attendance_data: [],
	};

	fetchAttendanceData = async () => {
		try {
			let response = await serverRequests.get(
				`/api/${this.props.auth.user.center}/attendance/${
					this.props.auth.user.center.includes('Constituency')
						? this.props.navigation.getParam('userID')
						: this.props.auth.user._id
				}`
			);

			if (response.data === undefined || response.data.length == 0) {
				this.props.AddAttendance([
					{
						date: moment().format(),
						attendance_names: 'None',
						attendance_number: '0',
						rehearsed_number: '0',
						rehearsed_names: 'None',
						ministered_number: '0',
						ministered_names: 'None',
						updatedAt: '2021-04-19T12:29:55.092Z',
					},
				]);
			} else {
				this.props.AddAttendance(response.data);
			}
		} catch (error) {
			console.log(`error from fetchData homepage: `, error);
		}
	};

	componentDidMount() {
		this.fetchAttendanceData();
	}

	render() {
		return (
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1500}
					delay={150}
				>
					<DrawerToggle />
					<Animatable.View animation='bounceInDown' duration={2500} delay={500}>
						<Image
							style={{ ...styles.homePageImage }}
							source={require('../../assets/images/whitelogowithoutchurch.png')}
						/>
					</Animatable.View>
				</Animatable.View>
				{this.props.auth.user.membership_type === 'Bacenta leader' && <PushNotificationAPI />}

				{this.props.attendance.attendanceData ? (
					<>
						<Animatable.View animation='fadeInDown' duration={1000}>
							<Card containerStyle={{ ...styles.card, marginTop: -50 }}>
								<Text style={{ textAlign: 'center', fontStyle: 'italic' }}>
									Be thou diligent to know the state of thy flocks, and look well to thy herds.
								</Text>
								<Text style={{ textAlign: 'center' }}>Psalms 27:23</Text>

								<TouchableOpacity
									placeHolderContent={ActivityIndicator}
									style={styles.button}
									onPress={() => {
										this.props.navigation.navigate('SontaDataSubmit');
									}}
								>
									<Text style={{ color: 'white' }}>SUBMIT SONTA DATA</Text>
								</TouchableOpacity>
							</Card>
						</Animatable.View>

						<Animatable.View animation='fadeInDown' delay={100} duration={1200}>
							<Card containerStyle={{ ...styles.smallerCard }}>
								<TouchableOpacity
									onPress={() =>
										this.props.navigation.navigate('SontaEditData', {
											data: _.last(this.props.attendance.attendanceData),
										})
									}
								>
									<Text
										style={{
											textAlign: 'center',
											fontWeight: 'bold',
											marginTop: 10,
											fontSize: 18,
										}}
									>
										CLICK TO EDIT RECENT DATA
									</Text>
									<Text
										style={{
											textAlign: 'center',
											fontSize: 12,
											marginTop: 5,
										}}
									>
										{_.last(this.props.attendance.attendanceData).date
											? `Current Date: ${moment(_.last(this.props.attendance.attendanceData).date).format('dddd, ll')}`
											: 'No Date Yet'}
									</Text>
									{this.props.attendance.attendanceData ? (
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'center',
												marginVertical: 20,
												marginBottom: 100,
											}}
										>
											<AnimatedNumber
												title='ATT'
												number={_.last(this.props.attendance.attendanceData).attendance_number}
											/>
											<AnimatedNumber
												title='REH'
												number={_.last(this.props.attendance.attendanceData).rehearsed_number}
											/>
											<AnimatedNumber
												title='MIN'
												number={_.last(this.props.attendance.attendanceData).ministered_number}
											/>
										</View>
									) : (
										<ActivityIndicator />
									)}
								</TouchableOpacity>
							</Card>
						</Animatable.View>

						<Animatable.View animation='fadeInDown' delay={200} duration={1400}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('AllSontaData')}>
								<LineChart
									data={{
										labels: _.isEmpty(this.props.attendance.attendanceData)
											? ['00/00']
											: this.props.attendance.attendanceData.length >= 7
											? _.slice(this.props.attendance.attendanceData, this.props.attendance.attendanceData.length - 8)
													.sort(function (a, b) {
														return a.date.localeCompare(b.date);
													})
													.map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM'))
											: this.props.attendance.attendanceData
													.slice()
													.sort(function (a, b) {
														return a.date.localeCompare(b.date);
													})
													.map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM')),
										datasets: [
											{
												data:
													this.props.attendance.attendanceData.length >= 7
														? _.slice(
																this.props.attendance.attendanceData,
																this.props.attendance.attendanceData.length - 8
														  )
																.sort(function (a, b) {
																	return a.date.localeCompare(b.date);
																})
																.map(e => Number(e.attendance_number))
														: this.props.attendance.attendanceData
																.slice()
																.sort(function (a, b) {
																	return a.date.localeCompare(b.date);
																})
																.map(e => Number(e.attendance_number)),
											},
										],
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
										marginBottom: 20,
										borderRadius: 16,
									}}
								/>
							</TouchableOpacity>
						</Animatable.View>
					</>
				) : (
					<ActivityIndicator />
				)}
			</ScrollView>
		);
	}
}

BasontaHome['navigationOptions'] = screenProps => ({
	title: 'My Basonta',
});

const mapStateToProps = state => {
	return { auth: state.auth, attendance: state.center };
};

export default connect(mapStateToProps, { AddAttendance })(BasontaHome);
