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

class FullSontaData extends Component {
	state = {
		showReminderLoading: false,
		showReminderButton: true,
		errorMessage: null,
	};

	disableButton = () => {
		this.timer = setTimeout(() => {
			this.setState({ showReminderButton: true });
		}, 600000);
	};

	showDialog = () => {
		Alert.alert('SEND OUT REMINDER', 'Do you want to send the notification now?', [
			{
				text: 'NO',
				onPress: () => false,
				style: 'cancel',
			},
			{
				text: 'YES',
				onPress: async () => {
					this.setState({ showReminderLoading: true });
					try {
						let response = serverRequests.get(
							`/api/${
								this.props.auth.user.center.includes('Constituency')
									? this.props.navigation.getParam('center')
									: this.props.auth.user.center
							}/attendance/reminder`
						);
						this.setState({ showReminderButton: false, showReminderLoading: false });
						this.disableButton();
					} catch (error) {
						console.log(`error reminding Homepage:`, error);
						this.setState({ showReminderButton: true, showReminderLoading: false });
					}
				},
			},
		]);
	};

	reducer = (accumulator, current_value) => accumulator + current_value;

	getAverage = param => {
		const list = this.props.center.centerData.attendance.map(obj => Number(obj[param]));

		return Math.round(list.reduce(this.reducer) / list.length);
	};

	returnLeaderName = id => {
		let name = '';
		this.props.center.leadersData.find(el => {
			if (el._id === id) {
				name = `${el.first_name} ${el.last_name}`;
			}
		});

		return name;
	};

	returnDetails = (id, param) => {
		let data = this.props.center.centerData.attendance.find(
			element =>
				element.leader_id === id &&
				moment(this.props.navigation.getParam('data')[0].date).format('Do MMMM YYYY') ===
					moment(element.date).format('Do MMMM YYYY')
		);

		return data ? data[param] : '-';
	};

	returnData = id => {
		let data = this.props.navigation.getParam('data').find(element => element.leader_id === id);

		return data ? data : {};
	};

	componentWillUnmount() {
		clearTimeout(this.timer);
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
					<Image
						style={{ ...styles.homePageImage, marginTop: 100 }}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300} delay={200}>
					<Card containerStyle={{ ...styles.card, height: 320, marginTop: -50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 15,
								fontWeight: 'bold',
								marginBottom: 20,
							}}
						>
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center')
								: this.props.auth.user.center}{' '}
							Data For {this.props.navigation.getParam('date')}
						</Text>

						<View style={styles.row}>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Leader's Name</Text>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance</Text>
						</View>

						<View style={{ height: 190 }} showsVerticalScrollIndicator={false}>
							<FlatList
								data={this.props.center.leadersData.filter(obj => obj.membership_type)}
								style={{ height: 300 }}
								renderItem={({ item }) => {
									return this.returnDetails(item._id, 'attendance_number') === '-' ? (
										<View style={styles.row}>
											<Text
												style={{
													color: this.returnDetails(item._id, 'attendance_number') === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnLeaderName(item._id)}
											</Text>

											<Text
												style={{
													color: this.returnDetails(item._id, 'attendance_number') === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnDetails(item._id, 'attendance_number')}
											</Text>
										</View>
									) : (
										<TouchableOpacity
											onPress={() =>
												this.props.navigation.navigate('ViewSontaLeaderData', {
													item: this.returnData(item._id),
													center: this.props.navigation.getParam('center'),
												})
											}
											style={styles.row}
										>
											<Text
												style={{
													color: this.returnDetails(item._id, 'attendance_number') === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnLeaderName(item._id)}
											</Text>

											<Text
												style={{
													color: this.returnDetails(item._id, 'attendance_number') === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnDetails(item._id, 'attendance_number')}
											</Text>
										</TouchableOpacity>
									);
								}}
								keyExtractor={item => item._id}
								ItemSeparatorComponent={this.renderSeparator}
							/>
						</View>
					</Card>
				</Animatable.View>

				{/* SENDING NOTIFICATIONS */}
				<Animatable.View animation='fadeInDown' duration={1500} delay={300}>
					{this.state.showReminderButton ? (
						this.state.showReminderLoading ? (
							<ActivityIndicator />
						) : (
							<TouchableOpacity
								style={{
									...styles.errorMessage,
									marginTop: 0,
									marginTop: 20,

									backgroundColor: '#9d0d0e',
								}}
								onPress={this.showDialog}
							>
								<Text style={{ ...styles.buttonTitle }}>SEND OUT REMINDER</Text>
							</TouchableOpacity>
						)
					) : (
						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: 0,
								marginTop: 20,
								backgroundColor: 'grey',
							}}
							onPress={() => Alert.alert('Request sent', 'Please wait a couple of minutes to send another')}
						>
							<Text style={{ ...styles.buttonTitle }}>SEND OUT REMINDER</Text>
						</TouchableOpacity>
					)}
					{this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}
					{/* <Card containerStyle={{ ...styles.card, height: 80 }}>
					</Card> */}
				</Animatable.View>

				{/* AVERAGE DATA */}
				<Animatable.View animation='fadeInDown' duration={1700} delay={300}>
					<Card containerStyle={{ ...styles.card, height: 250, marginBottom: 20 }}>
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
							Average Data for{' '}
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center')
								: this.props.auth.user.center}
						</Text>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('DataHistory')}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									marginVertical: 10,
								}}
							>
								<AnimatedNumber title='ATT' number={this.getAverage('attendance_number')} />
								<AnimatedNumber title='REH' number={this.getAverage('rehearsed_number')} />
								<AnimatedNumber title='MIN' number={this.getAverage('ministered_number')} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: 30,
								backgroundColor: '#9d0d0e',
							}}
							onPress={() =>
								this.props.navigation.navigate('SontaDataHistory', { center: this.props.navigation.getParam('center') })
							}
						>
							<Text style={{ ...styles.buttonTitle }}>FULL DATA HISTORY</Text>
						</TouchableOpacity>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

FullSontaData['navigationOptions'] = screenProps => ({
	title: 'All Sonta Data',
});

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, null)(FullSontaData);
