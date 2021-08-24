import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import { Text, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Avatar } from 'react-native-paper';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

class AllSontaLeaderData extends Component {
	returnLeaderData = id => this.props.center.centerData.attendance.filter(obj => obj.leader_id === id);

	returnLeaderName = id => {
		let name = '';
		this.props.center.leadersData.find(el => {
			if (el._id === id) {
				name = `${el.first_name} ${el.last_name}`;
			}
		});

		return name;
	};

	returnDataLabels = () => {
		if (_.isEmpty(this.returnLeaderData(this.props.navigation.getParam('data')._id))) {
			return ['0/0'];
		}

		const leader_data = this.returnLeaderData(this.props.navigation.getParam('data')._id)
			.slice()
			.sort(function (a, b) {
				// return a > b ? 1 : a < b ? -1 : 0;
				return a.date.localeCompare(b.date);
			});

		if (leader_data.length >= 7) {
			return _.slice(leader_data, leader_data.length - 8).map(
				e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM')
			);
		} else {
			return leader_data.map(e => moment(e.date).format('DD') + '/' + moment(e.date).format('MM'));
		}
	};

	returnDataSets = () => {
		if (_.isEmpty(this.returnLeaderData(this.props.navigation.getParam('data')._id))) {
			return [0];
		}
		const leader_data = this.returnLeaderData(this.props.navigation.getParam('data')._id)
			.slice()
			.sort(function (a, b) {
				// return a > b ? 1 : a < b ? -1 : 0;
				return a.date.localeCompare(b.date);
			});

		if (leader_data.length >= 7) {
			return _.slice(leader_data, leader_data.length - 8).map(e => Number(e.attendance_number));
		} else {
			return leader_data.map(e => Number(e.attendance_number));
		}
	};

	render() {
		return (
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1500}
					delay={150}
				>
					<Image
						style={[styles.homePageImage, { marginTop: 80 }]}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1000} delay={200}>
					<Card
						containerStyle={{
							...styles.card,
							height: 200,
							marginTop: -50,
							alignItems: 'center',
						}}
					>
						{this.props.navigation.getParam('data').profile_image ? (
							<Avatar.Image
								size={80}
								source={{
									uri: `https://fl-app-v1.herokuapp.com/api/user/profile/image/${
										this.props.navigation.getParam('data').profile_image
									}`,
								}}
								style={{ marginBottom: 10, alignSelf: 'center' }}
							/>
						) : (
							<Avatar.Image
								size={80}
								source={require('../../assets/images/sophie_passport.jpg')}
								style={{ marginBottom: 10, alignSelf: 'center' }}
							/>
						)}

						<Text
							style={{
								fontWeight: 'bold',
								fontSize: 25,
								fontFamily: 'Avenir',
							}}
						>
							{this.returnLeaderName(this.props.navigation.getParam('data')._id)}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center')
								: this.props.auth.user.center}
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300} delay={230}>
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
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1500} delay={230}>
					<Card containerStyle={{ ...styles.card, height: 450, marginBottom: 20 }}>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								marginBottom: 20,
							}}
						>
							{`${this.returnLeaderName(this.props.navigation.getParam('data')._id)}'s Full Data History`}
						</Text>

						<View style={styles.row}>
							<Text
								style={{
									marginVertical: 10,
									fontWeight: 'bold',
								}}
							>
								Data
							</Text>
							<Text
								style={{
									marginVertical: 10,
									fontWeight: 'bold',
								}}
							>
								Attendance
							</Text>
						</View>
						<FlatList
							data={this.returnLeaderData(this.props.navigation.getParam('data')._id)
								.slice()
								.sort(function (a, b) {
									// return a > b ? 1 : a < b ? -1 : 0;
									return a.date.localeCompare(b.date);
								})
								.reverse()}
							style={{ height: 330 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => {
								return (
									<TouchableOpacity onPress={() => this.props.navigation.navigate('ViewSontaLeaderData', { item })}>
										<View style={styles.row}>
											<Text style={{ color: 'black', marginVertical: 10 }}>{moment(item.date).format('dddd, ll')}</Text>

											<Text style={{ color: 'black', marginVertical: 10 }}>{item.attendance_number}</Text>
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

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

AllSontaLeaderData['navigationOptions'] = screenProps => ({
	title: 'All Leader Data',
});

export default connect(mapStateToProps, null)(AllSontaLeaderData);
