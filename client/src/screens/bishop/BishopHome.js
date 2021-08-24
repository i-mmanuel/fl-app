import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import DrawerToggle from '../../components/DrawerToggle';
import AnimatedNumber from '../../components/AnimatedNumber';
import serverRequests from '../../api/serverRequests';
import { AddAllCenterData, AddCenterData, AddLeadersData, AddUserDetails } from '../../actions';
import moment from 'moment';

class BishopHome extends Component {
	fetchLeaderDetails = async () => {
		try {
			let response = await serverRequests.get(`/api/pastors-centre-leaders`);

			// return ;
			// let userList = _.uniqBy([...this.props.center.userDetails, response.data], '_id');
			this.props.AddUserDetails(response.data);
		} catch (error) {
			// console.log(this.props.center.userDetails);
			console.log(`error adding user details:`, error);
		}
	};

	fetchData = async () => {
		try {
			let response = await serverRequests.get(`/api/all-centers/`);
			this.props.AddAllCenterData(response.data);
			let usersWithLeaders = response.data.filter(obj => obj._leader_id);

			await this.fetchLeaderDetails();
		} catch (error) {
			console.log(`error from fetchData: `, error);
		}
	};

	getLastDate = array => {
		let dates = array.slice().sort(function (a, b) {
			// return a > b ? 1 : a < b ? -1 : 0;
			if (a.date) {
				return a.date.localeCompare(b.date);
			}
		});

		return _.last(dates);
	};

	returnSontaData = (sonta = false) => {
		return sonta
			? this.props.center.allCenterData.filter(obj => obj.location.includes('Sonta'))
			: this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta'));
	};

	getRecentData = (sonta = false) => {
		const data = sonta
			? this.props.center.allCenterData.filter(obj => obj.location.includes('Sonta'))
			: this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta'));

		const lastDate = this.getLastDate(data.map(el => el.attendance).flat());

		return data
			.map(el => el.attendance)
			.flat()
			.filter(obj => moment(obj.date).format('Do MM YY') === moment(lastDate.date).format('Do MM YY'));
	};

	reducer = (accumulator, current_value) => accumulator + current_value;

	sift = (arr, param) => arr.map(element => (Number(element[param]) ? Number(element[param]) : 0));

	componentDidMount() {
		this.fetchData();

		if (this.props.auth.user.membership_type === 'Admin' || this.props.auth.user.membership_type === 'Bishop') {
			this.timer = setInterval(() => {
				this.fetchData();
				console.log(`bishopflow fetched new data`);
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
					duration={500}
					delay={150}
				>
					<DrawerToggle />
					<Image style={[styles.homePageImage]} source={require('../../assets/images/whitelogowithoutchurch.png')} />
				</Animatable.View>
				{/* {console.log(
					'list',
					this.props.center.allCenterData
						? this.props.center.allCenterData
								.map(obj => obj.attendance)
								.flat()
								.map(obj => `${obj.leader_id} ${obj.date}`)
						: ''
				)} */}
				<Animatable.View animation='fadeInDown' duration={1000} delay={200}>
					<Card containerStyle={{ ...styles.card, height: 300, marginTop: -50 }}>
						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: 60,
								backgroundColor: '#9d0d0e',
							}}
							onPress={() =>
								this.props.navigation.navigate('BishopConstituencies', {
									data: this.getRecentData(),
									date: moment(
										this.getLastDate(this.props.center.allCenterData.map(el => el.attendance).flat()).date
									).format('Do MMMM YYYY'),
								})
							}
						>
							<Text style={{ ...styles.buttonTitle }}>CONSTITUENCIES</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: 50,
								// backgroundColor: 'grey',
								backgroundColor: '#9d0d0e',
							}}
							onPress={() =>
								this.props.navigation.navigate('BishopSontas', {
									data: this.getRecentData(),
									date: moment(
										this.getLastDate(this.props.center.allCenterData.map(el => el.attendance).flat()).date
									).format('Do MMMM YYYY'),
								})
							}
						>
							<Text style={{ ...styles.buttonTitle }}>LONDON SONTAS</Text>
						</TouchableOpacity>
					</Card>
				</Animatable.View>

				{this.props.center.allCenterData &&
				this.props.center.allCenterData.map(el => el.attendance).flat().length > 0 ? (
					<Animatable.View animation='fadeInDown' delay={200} duration={1200}>
						{/* {console.log(
							this.props.center.allCenterData
								.map(obj => obj.attendance)
								.flat()
								.map(obj => {
									return `${moment(obj.date).format('Do MMMM YYYY')} ${obj.leader_id}`;
								})
						)} */}
						<Card
							containerStyle={{
								...styles.card,
								height: 280,
								marginBottom: 20,
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
								{this.props.auth.user.center}
							</Text>
							<Text
								style={{
									textAlign: 'center',
									marginTop: 5,
									fontSize: 12,
								}}
							>
								Current Date:{' '}
								{moment(
									this.getLastDate(
										this.returnSontaData(false)
											.map(el => el.attendance)
											.flat()
									).date
								).format('dddd, ll')}
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
								<AnimatedNumber
									title='NBS'
									number={this.sift(this.getRecentData(), 'started_nbs').reduce(this.reducer)}
								/>
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
									this.props.navigation.navigate('BishopData', {
										data: this.getRecentData(),
										date: moment(
											this.getLastDate(
												this.returnSontaData()
													.map(el => el.attendance)
													.flat()
											).date
										).format('Do MMMM YYYY'),
									})
								}
							>
								<Text style={{ ...styles.buttonTitle }}>VIEW CONSTITUENCY DATA</Text>
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

BishopHome['navigationOptions'] = screenProps => ({
	title: 'Home',
});

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

export default connect(mapStateToProps, { AddCenterData, AddAllCenterData, AddLeadersData, AddUserDetails })(
	BishopHome
);
