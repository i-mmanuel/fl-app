import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import moment from 'moment';

class ViewSontaLeaderDataHistory extends Component {
	returnLeaderName = id => {
		let name = '';
		this.props.center.leadersData.find(el => {
			if (el._id === id) {
				name = `${el.first_name} ${el.last_name}`;
			}
		});

		return name;
	};

	returnDetails = leader => {
		// let data = this.props.center.centerData.attendance.find(
		// 	element => element.leader_id === id
		//     );
		const data = this.props.navigation.getParam('data');

		let obj = this.props.center.centerData.attendance.filter(
			obj => moment(obj.date).format('Do MM YY') === moment(data.date).format('Do MM YY') && obj.leader_id === leader
		);

		return obj[0] ? obj[0].attendance_number : '-';
	};

	returnAttendance = leader => {
		const data = this.props.navigation.getParam('data');

		let obj = this.props.center.centerData.attendance.filter(
			obj => moment(obj.date).format('Do MM YY') === moment(data.date).format('Do MM YY') && obj.leader_id === leader
		);

		return obj[0] ? obj[0] : {};
	};

	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1000}
					delay={150}
				>
					<Image
						style={{ ...styles.homePageImage, marginTop: 100 }}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300}>
					<Card
						containerStyle={{
							...styles.card,
							height: 500,
							marginTop: -50,
							marginBottom: 20,
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								marginVertical: 10,
							}}
						>
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center').replace('Sonta', '')
								: this.props.auth.user.center.replace('Sonta', '')}{' '}
							Data For {this.props.navigation.getParam('date')}
						</Text>

						<View style={styles.row}>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Leader's Name</Text>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance Number</Text>
						</View>

						<FlatList
							style={{ height: 320 }}
							data={this.props.center.leadersData.filter(obj => obj.membership_type)}
							renderItem={({ item }) => {
								return this.returnDetails(item._id) === '-' ? (
									<View style={styles.row}>
										<Text
											style={{
												color: this.returnDetails(item._id) === '-' ? 'red' : 'green',
												marginVertical: 10,
											}}
										>
											{this.returnLeaderName(item._id)}
										</Text>

										<Text
											style={{
												color: this.returnDetails(item._id) === '-' ? 'red' : 'green',
												marginVertical: 10,
											}}
										>
											{this.returnDetails(item._id)}
										</Text>
									</View>
								) : (
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate('ViewSontaLeaderData', {
												item: this.returnAttendance(item._id),
												center: this.props.navigation.getParam('center'),
											})
										}
									>
										<View style={styles.row}>
											<Text
												style={{
													color: this.returnDetails(item._id) === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnLeaderName(item._id)}
											</Text>

											<Text
												style={{
													color: this.returnDetails(item._id) === '-' ? 'red' : 'green',
													marginVertical: 10,
												}}
											>
												{this.returnDetails(item._id)}
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

ViewSontaLeaderDataHistory['navigationOptions'] = screenProps => ({
	title: 'Leader History Data',
});

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, null)(ViewSontaLeaderDataHistory);
