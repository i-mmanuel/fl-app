import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import DrawerToggle from '../../components/DrawerToggle';
import AnimatedNumber from '../../components/AnimatedNumber';
import serverRequests from '../../api/serverRequests';
import { AddCenterData, AddLeadersData } from '../../actions';
import moment from 'moment';
import PushNotificationAPI from '../../api/PushNotificationAPI';

class SontaHome extends Component {
	checkLeader = () => {
		if (this.props.auth.user.membership_type === 'Bishop') {
			return this.props.navigation.getParam('center');
		} else if (this.props.auth.user.center.includes('Constituency')) {
			return this.props.navigation.getParam('center');
		} else if (this.props.auth.user.membership_type === 'Overseer') {
			return this.props.navigation.getParam('center');
		} else {
			return this.props.auth.user.center;
		}
	};

	fetchData = async () => {
		try {
			let response = await serverRequests.get(`/api/${this.checkLeader()}`);

			let leaders = await serverRequests.get(`/api/${this.checkLeader()}/all-leaders`);

			if (response.data === undefined || response.data.length == 0) {
				this.props.AddCenterData({
					leader_first_name: '',
					leader_last_name: '',
					pastor_first_name: '',
					pastor_last_name: '',
					_id: '',
					location: '',
					attendance: [
						{
							_id: '',
							date: '',
							attendance_number: '',
							attendance_names: '',
							number_first_timers: '',
							names_first_timers: '',
							number_of_converts: '',
							names_of_converts: '',
							started_nbs: '',
							finished_nbs: '',
							leader_id: '',
						},
					],
					members: [],
					createdAt: '',
					updatedAt: '',
					__v: 6,
				});
			} else {
				this.props.AddCenterData(response.data);
				this.props.AddLeadersData(leaders.data);
			}
		} catch (error) {
			console.log(`error from fetchData: `, error);
		}
	};

	getLastDate = array => {
		let dates = array.slice().sort(function (a, b) {
			// return a > b ? 1 : a < b ? -1 : 0;
			return a.date.localeCompare(b.date);
		});

		return _.last(dates);
	};

	getRecentData = () => {
		const lastDate = this.getLastDate(this.props.center.centerData.attendance);
		// console.log(
		// 	this.props.center.centerData.attendance.filter(
		// 		obj => obj.date === lastDate.date
		// 	)
		// );

		return this.props.center.centerData.attendance.filter(
			obj => moment(obj.date).format('Do MM YY') === moment(lastDate.date).format('Do MM YY')
		);
	};

	reducer = (accumulator, current_value) => accumulator + current_value;

	sift = (arr, param) => arr.map(element => Number(element[param]));

	isCenterLeader = () =>
		this.props.auth.user.membership_type === 'Centre leader' || this.props.auth.user.membership_type === 'Admin'
			? true
			: false;

	componentDidMount() {
		this.fetchData();

		if (
			this.props.auth.user.membership_type === 'Admin' ||
			this.props.auth.user.membership_type === 'Centre leader' ||
			this.props.auth.user.membership_type === 'Overseer'
		) {
			this.timer = setInterval(() => {
				this.fetchData();
				console.log(`sonta fetched new data`);
			}, 30000);
		}
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1000}
					delay={150}
				>
					{this.isCenterLeader() && <DrawerToggle />}

					<View style={{ backgroundColor: '#9d0d0e', height: 200 }}>
						<Animatable.View animation='bounceInDown' duration={2500} delay={500}>
							<Image
								style={[styles.homePageImage, { marginTop: this.isCenterLeader() ? 0 : 100 }]}
								source={require('../../assets/images/whitelogowithoutchurch.png')}
							/>
						</Animatable.View>
					</View>
				</Animatable.View>

				{this.isCenterLeader() && <PushNotificationAPI />}

				<Animatable.View animation='fadeInDown' duration={1100} delay={150}>
					<Card containerStyle={{ ...styles.card, height: 100, marginTop: -50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								fontStyle: 'italic',
								fontFamily: 'Avenir',
								marginTop: 20,
								fontSize: 25,
							}}
						>
							{this.isCenterLeader()
								? '• ' + this.props.auth.user.center.replace('Sonta', '') + ' •'
								: '• ' + this.props.navigation.getParam('center').replace('Sonta', '') + ' •'}
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1200} delay={150}>
					<Card containerStyle={{ ...styles.card, height: this.isCenterLeader() ? 300 : 100 }}>
						{this.isCenterLeader() && (
							<TouchableOpacity
								style={{
									...styles.errorMessage,
									marginTop: 60,
									backgroundColor: '#9d0d0e',
								}}
								onPress={() =>
									this.props.navigation.navigate('BASONTA', { userID: this.props.navigation.getParam('userID') })
								}
							>
								<Text style={{ ...styles.buttonTitle }}>MY BASONTA</Text>
							</TouchableOpacity>
						)}

						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: this.isCenterLeader() ? 60 : 10,
								backgroundColor: '#9d0d0e',
							}}
							onPress={() =>
								this.props.navigation.navigate('AllSontaLeaders', {
									center: this.checkLeader(),
								})
							}
						>
							<Text style={{ ...styles.buttonTitle }}>SONTA LEADERS</Text>
						</TouchableOpacity>
					</Card>
				</Animatable.View>

				{this.props.center.centerData && this.props.center.centerData.attendance.length >= 1 ? (
					<Animatable.View animation='fadeInDown' delay={150} duration={1500}>
						<Card
							containerStyle={{
								...styles.card,
								height: 250,
								marginBottom: 50,
							}}
						>
							<Text
								style={{
									textAlign: 'center',
									fontWeight: 'bold',
									marginTop: 15,
									fontSize: 20,
								}}
							>
								SONTA OVERVIEW
							</Text>
							<Text
								style={{
									textAlign: 'center',
									marginTop: 5,
									fontSize: 12,
								}}
							>
								Current Date:{' '}
								{moment(this.getLastDate(this.props.center.centerData.attendance).date).format('dddd, ll')}
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
									number={this.sift(this.getRecentData(), 'attendance_number').reduce(this.reducer)}
								/>
								<AnimatedNumber
									title='REH'
									number={this.sift(this.getRecentData(), 'rehearsed_number').reduce(this.reducer)}
								/>
								<AnimatedNumber
									title='MIN'
									number={this.sift(this.getRecentData(), 'ministered_number').reduce(this.reducer)}
								/>
							</View>

							<TouchableOpacity
								style={{
									...styles.errorMessage,
									backgroundColor: '#9d0d0e',
								}}
								onPress={() =>
									this.props.navigation.navigate('FullSontaData', {
										data: this.getRecentData(),
										center: this.checkLeader(),
										date: moment(this.getLastDate(this.props.center.centerData.attendance).date).format('Do MMMM YYYY'),
									})
								}
							>
								<Text style={{ ...styles.buttonTitle }}>VIEW SONTA DATA</Text>
							</TouchableOpacity>
						</Card>
					</Animatable.View>
				) : (
					<Animatable.View animation='fadeInDown' delay={130} duration={1700}>
						<Card containerStyle={{ ...styles.card, height: 90 }}>
							<Text
								style={{
									textAlign: 'center',
									fontWeight: 'bold',
									marginTop: 15,
									fontSize: 20,
								}}
							>
								There is no data to be displayed
							</Text>
						</Card>
					</Animatable.View>
				)}
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

SontaHome['navigationOptions'] = screenProps => ({
	title: 'Sonta Home',
});

export default connect(mapStateToProps, { AddCenterData, AddLeadersData })(SontaHome);
