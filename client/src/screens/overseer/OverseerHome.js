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
import { AddAllCenterData, AddLeadersData, AddUserDetails } from '../../actions';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { Fragment } from 'react';

class OverseerHome extends Component {
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

	fetchData = async () => {
		try {
			let response = await serverRequests.get(`/api/all-centers/${this.props.auth.user._id}`);
			this.props.AddAllCenterData(response.data);
			let usersWithLeaders = response.data.filter(obj => obj._leader_id);

			usersWithLeaders.map(async obj => {
				await this.fetchLeaderDetails(obj._leader_id.toString());
				// console.log('response', response);
			});
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

	getRecentData = (center = '') => {
		const location =
			center === 'sonta'
				? this.props.center.allCenterData.filter(obj => obj.location.includes('Sonta'))
				: this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta'));

		const lastDate = this.getLastDate(location.map(el => el.attendance).flat());
		// console.log(
		// 	this.props.center.centerData.attendance.filter(
		// 		obj => obj.date === lastDate.date
		// 	)
		// );

		return location
			.map(el => el.attendance)
			.flat()
			.filter(obj => moment(obj.date).format('Do MM YY') === moment(lastDate.date).format('Do MM YY'));
	};

	returnDataLabels = () => {
		if (_.isEmpty(this.props.center.allCenterData.map(el => el.attendance).flat())) {
			return ['0/0'];
		}

		const dates = this.returnUniqueArray(
			this.props.center.allCenterData
				.map(el => el.attendance)
				.flat()
				.slice()
				.sort(function (a, b) {
					return a.date.localeCompare(b.date);
				})
		);

		if (dates.length >= 7) {
			return _.slice(dates, dates.length - 8).map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM'));
		} else {
			return dates.map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM'));
		}
	};

	isSonta = () => {
		if (this.props.auth.user.center.includes('Sonta')) {
			return true;
		} else if (
			this.props.center.allCenterData.find(obj => obj.location.includes('Sonta')) &&
			!this.props.auth.user.center.includes('Sonta')
		) {
			return false;
		} else if (!this.props.auth.user.center.includes('Sonta')) {
			return '-';
		}
	};

	filtered = () =>
		this.props.center.allCenterData
			.filter(obj => obj.location.includes('Sonta'))
			.map(el => el.attendance)
			.flat().length > 0;

	returnDataSets = () => {
		if (_.isEmpty(this.props.center.allCenterData.map(el => el.attendance).flat())) {
			return [0];
		}

		const dates = this.returnUniqueArray(
			this.props.center.allCenterData
				.map(el => el.attendance)
				.flat()
				.slice()
				.sort(function (a, b) {
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

	componentDidMount() {
		this.fetchData();

		if (this.props.auth.user.membership_type === 'Admin' || this.props.auth.user.membership_type === 'Overseer') {
			this.timer = setInterval(() => {
				this.fetchData();
				console.log(`overseer fetched new data`);
			}, 30000);
		}
	}

	returnSontas = () => {
		return (
			this.props.center.allCenterData
				.filter(obj => obj.location.includes('Sonta'))
				.map(el => el.attendance)
				.flat().length > 0 && (
				<Card
					containerStyle={{
						...styles.card,
						height: 280,
						marginBottom: 50,
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							borderColor: '#dcdcdc',
							fontSize: 15,
							fontWeight: 'bold',
							marginTop: 20,
						}}
					>
						Data Submission Sontas
					</Text>
					<Text
						style={{
							textAlign: 'center',
							marginTop: 5,
							fontSize: 12,
						}}
					>
						Current Date:{' '}
						{this.props.center.allCenterData
							.filter(obj => obj.location.includes('Sonta'))
							.map(el => el.attendance)
							.flat().length
							? moment(
									this.getLastDate(
										this.props.center.allCenterData
											.filter(obj => obj.location.includes('Sonta'))
											.map(el => el.attendance)
											.flat()
									).date
							  ).format('Do MMMM YYYY')
							: String('No Date Yet')}
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
							number={this.sift(this.getRecentData('sonta'), 'attendance_number').reduce(this.reducer)}
						/>
						<AnimatedNumber
							title='REH'
							number={this.sift(this.getRecentData('sonta'), 'rehearsed_number').reduce(this.reducer)}
						/>
						<AnimatedNumber
							title='MIN'
							number={this.sift(this.getRecentData('sonta'), 'ministered_number').reduce(this.reducer)}
						/>
					</View>
					<TouchableOpacity
						style={{
							...styles.errorMessage,
							backgroundColor: '#9d0d0e',
						}}
						onPress={() =>
							this.props.navigation.navigate('CentersData', {
								data: this.getRecentData('sonta'),
								date: moment(
									this.getLastDate(
										this.props.center.allCenterData
											.filter(obj => obj.location.includes('Sonta'))
											.map(el => el.attendance)
											.flat()
									).date
								).format('Do MMMM YYYY'),
								showSonta: true,
							})
						}
					>
						<Text style={{ ...styles.buttonTitle }}>VIEW SONTA DATA</Text>
					</TouchableOpacity>
				</Card>
			)
		);
	};

	returnCentres = () => {
		return (
			this.props.center.allCenterData
				.filter(obj => !obj.location.includes('Sonta'))
				.map(el => el.attendance)
				.flat().length > 0 && (
				<Card
					containerStyle={{
						...styles.card,
						height: 280,
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							borderColor: '#dcdcdc',
							fontSize: 15,
							fontWeight: 'bold',
							marginTop: 20,
						}}
					>
						Data Submission for {this.props.auth.user.center}
					</Text>
					<Text
						style={{
							textAlign: 'center',
							marginTop: 5,
							fontSize: 12,
						}}
					>
						Current Date:{' '}
						{moment(this.getLastDate(this.props.center.allCenterData.map(el => el.attendance).flat()).date).format(
							'Do MMMM YYYY'
						)}
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
							title='FTS'
							number={this.sift(this.getRecentData(), 'number_first_timers').reduce(this.reducer)}
						/>
						<AnimatedNumber
							title='CON'
							number={this.sift(this.getRecentData(), 'number_of_converts').reduce(this.reducer)}
						/>
						<AnimatedNumber title='NBS' number={this.sift(this.getRecentData(), 'started_nbs').reduce(this.reducer)} />
						<AnimatedNumber
							title='FNBS'
							number={this.sift(this.getRecentData(), 'finished_nbs').reduce(this.reducer)}
						/>
					</View>

					<TouchableOpacity
						style={{
							...styles.errorMessage,
							backgroundColor: '#9d0d0e',
						}}
						onPress={() =>
							this.props.navigation.navigate('CentersData', {
								data: this.getRecentData(),
								date: moment(
									this.getLastDate(this.props.center.allCenterData.map(el => el.attendance).flat()).date
								).format('Do MMMM YYYY'),
								showSonta: false,
							})
						}
					>
						<Text style={{ ...styles.buttonTitle }}>VIEW CONSTITUENCY DATA</Text>
					</TouchableOpacity>
				</Card>
			)
		);
	};

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ backgroundColor: '#9d0d0e', height: 280 }}>
					<DrawerToggle />
					<Animatable.View animation='bounceInDown' duration={2500} delay={500}>
						<Image style={[styles.homePageImage]} source={require('../../assets/images/whitelogowithoutchurch.png')} />
					</Animatable.View>
				</View>

				<Animatable.View animation='fadeInDown' duration={1100} delay={100}>
					<Card containerStyle={{ ...styles.card, height: 100, marginTop: -50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontStyle: 'italic',
								fontWeight: 'bold',
								fontFamily: 'Avenir',
								marginTop: 20,
								fontSize: 25,
							}}
						>
							{this.props.auth.user.center}
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300} delay={100}>
					{(() => {
						if (this.props.center.allCenterData && this.isSonta() === true) {
							return (
								<Card containerStyle={{ ...styles.card, height: 100 }}>
									<TouchableOpacity
										style={{
											...styles.errorMessage,
											marginTop: 10,
											backgroundColor: '#9d0d0e',
											backgroundColor: 'grey',
										}}
										onPress={() => this.props.navigation.navigate('SontasDataHistory')}
									>
										<Text style={{ ...styles.buttonTitle }}>SONTAS</Text>
									</TouchableOpacity>
								</Card>
							);
						} else if (this.props.center.allCenterData && this.isSonta() === false) {
							return (
								<Card containerStyle={{ ...styles.card, height: 300 }}>
									<TouchableOpacity
										style={{
											...styles.errorMessage,
											marginTop: 60,
											backgroundColor: '#9d0d0e',
										}}
										onPress={() => this.props.navigation.navigate('CentersDataHistory')}
									>
										<Text style={{ ...styles.buttonTitle }}>CENTRES</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{
											...styles.errorMessage,
											marginTop: 50,
											backgroundColor: '#9d0d0e',
											// backgroundColor: 'grey',
										}}
										onPress={() => this.props.navigation.navigate('SontasDataHistory')}
									>
										<Text style={{ ...styles.buttonTitle }}>SONTAS</Text>
									</TouchableOpacity>
								</Card>
							);
						} else if (this.props.center.allCenterData && this.isSonta() === '-') {
							return (
								<Card containerStyle={{ ...styles.card, height: 100 }}>
									<TouchableOpacity
										style={{
											...styles.errorMessage,
											marginTop: 10,
											backgroundColor: '#9d0d0e',
										}}
										onPress={() => this.props.navigation.navigate('CentersDataHistory')}
									>
										<Text style={{ ...styles.buttonTitle }}>CENTRES</Text>
									</TouchableOpacity>
								</Card>
							);
						}
					})()}
				</Animatable.View>

				{this.props.center.allCenterData &&
				this.props.center.allCenterData.map(el => el.attendance).flat().length > 0 ? (
					<>
						{/* <Animatable.View animation='fadeInDown' duration={1300} delay={250}>
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
						</Animatable.View> */}

						<Animatable.View animation='fadeInDown' delay={100} duration={1600}>
							{(() => {
								// ONLY A SONTA OVERSEER!!
								if (this.filtered() && this.isSonta() === true) {
									return this.returnSontas();
								} else if (this.props.center.allCenterData && this.isSonta() === false) {
									// ONLY A SONTA OVERSEER + CENTRE OVERSEER!!
									return (
										<Fragment>
											{this.returnCentres()}
											{this.returnSontas()}
										</Fragment>
									);
								} else if (
									this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta')).length > 0 &&
									this.isSonta() === '-'
								) {
									return this.returnCentres();
								}
							})()}
						</Animatable.View>
					</>
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

OverseerHome['navigationOptions'] = screenProps => ({
	title: 'Home',
});

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, { AddAllCenterData, AddLeadersData, AddUserDetails })(OverseerHome);
