import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import serverRequests from '../../api/serverRequests';
import { AddLeadersData } from '../../actions';
import moment from 'moment';

class AllSontaLeaders extends Component {
	state = {
		showLoading: false,
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

	returnAttendance = leader => {
		const data = this.props.navigation.getParam('data');

		let obj = this.props.center.centerData.attendance.filter(
			obj => moment(obj.date).format('Do MM YY') === moment(data.date).format('Do MM YY') && obj.leader_id === leader
		);

		return obj[0] ? obj[0] : {};
	};

	verifyLeader = async id => {
		this.setState({ showLoading: true });
		try {
			await serverRequests.patch(`user/edit/${id}`, {
				membership_type: 'Bacenta leader',
			});

			let leaders = await serverRequests.get(`/api/${this.props.auth.user.center}/all-leaders`);
			this.setState({ showLoading: false });
			this.props.AddLeadersData(leaders.data);
		} catch (error) {
			this.setState({ showLoading: false });
			console.log(`error verifying member:`, error);
		}
	};

	denyLeader = async id => {
		this.setState({ showLoading: true });

		try {
			await serverRequests.delete(`user/delete/${id}`);
			let leaders = await serverRequests.get(`/api/${this.props.auth.user.center}/all-leaders`);
			this.setState({ showLoading: false });
			this.props.AddLeadersData(leaders.data);

			this.setState({ showLoading: false });
		} catch (error) {
			this.setState({ showLoading: false });
			console.log(`error deleting member:`, error);
		}
	};

	render() {
		return (
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1000}
					delay={150}
				>
					<Image
						style={[styles.homePageImage, { marginTop: 80 }]}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1000}>
					<Card
						containerStyle={{
							...styles.card,
							height: 100,
							marginTop: -50,
							alignItems: 'center',
						}}
					>
						<Text
							style={{
								fontWeight: 'bold',
								fontSize: 25,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center')
								: this.props.auth.user.center}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							All{' '}
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center')
								: this.props.auth.user.center}{' '}
							Leaders
						</Text>
					</Card>

					<Animatable.View animation='fadeInDown' duration={1300}>
						<Card
							containerStyle={{
								...styles.card,
								height: 300,
							}}
						>
							<View style={styles.row}>
								<Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Names Of leaders</Text>
							</View>

							{this.props.center.leadersData && (
								<FlatList
									style={{ height: 190 }}
									showsVerticalScrollIndicator={false}
									data={this.props.center.leadersData.filter(obj => obj.membership_type)}
									keyExtractor={item => item._id}
									renderItem={({ item }) => {
										return (
											<TouchableOpacity
												onPress={() =>
													this.props.navigation.navigate('AllSontaLeaderData', {
														data: item,
														center: this.props.navigation.getParam('center'),
													})
												}
											>
												<View style={styles.row}>
													<Text style={{ color: 'black', marginVertical: 15 }}>{this.returnLeaderName(item._id)}</Text>
													<Text style={{ color: 'grey' }}>View Leader Data</Text>
												</View>
											</TouchableOpacity>
										);
									}}
								/>
							)}
						</Card>
					</Animatable.View>

					{!this.props.auth.user.center.includes('Constituency') && (
						<Animatable.View animation='fadeInDown' duration={1300}>
							<Card
								containerStyle={{
									...styles.card,
									height: 230,
									marginBottom: 20,
								}}
							>
								<Text
									style={{
										textAlign: 'center',
										marginVertical: 10,
										fontWeight: 'bold',
									}}
								>
									LEADER VERIFICATION
								</Text>

								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Names Of leaders</Text>
								</View>

								{this.props.center.leadersData && (
									<FlatList
										data={this.props.center.leadersData.filter(obj => !obj.membership_type)}
										style={{ height: 150 }}
										keyExtractor={item => item._id}
										renderItem={({ item }) => {
											return (
												<View style={styles.row}>
													<Text style={{ color: 'black', marginVertical: 15 }}>{this.returnLeaderName(item._id)}</Text>
													{!this.state.showLoading ? (
														<>
															<TouchableOpacity onPress={() => this.verifyLeader(item._id)} style={{ marginLeft: 120 }}>
																<Text style={{ color: 'green' }}>VERIFY</Text>
															</TouchableOpacity>
															<TouchableOpacity onPress={() => this.denyLeader(item._id)}>
																<Text style={{ color: 'red' }}>DECLINE</Text>
															</TouchableOpacity>
														</>
													) : (
														<ActivityIndicator />
													)}
												</View>
											);
										}}
									/>
								)}
							</Card>
						</Animatable.View>
					)}
				</Animatable.View>

				{/* <Animatable.View animation='fadeInDown' duration={1000}>
					
					
					
					<FlatList
					data={this.props.center.leadersData}
					style={{ height: 460 }}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate('SingleLeaderData', {
									data: item,
								})
							}
							>
							<View style={styles.row}>
							<Text style={{ color: 'black', marginVertical: 10 }}>
							{this.returnLeaderName(item._id)}
							</Text>
							</View>
							</TouchableOpacity>
							);
						}}
						keyExtractor={item => item._id}
						ItemSeparatorComponent={this.renderSeparator}
						/>
						</Card>
					</Animatable.View> */}

				{/* {console.log(this.getDates(this.props.center.centerData.attendance))} */}
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ auth, center }) => {
	return { auth, center };
};

AllSontaLeaders['navigationOptions'] = screenProps => ({
	title: 'All Leaders',
});

export default connect(mapStateToProps, { AddLeadersData })(AllSontaLeaders);
