import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

import styles from '../../styles/style';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';

class CentresDataHistory extends Component {
	returnUniqueArray = a => {
		let arr = [];

		a.slice().map(e => {
			if (arr.find(i => moment(i.date).format('Do MMMM YYYY') === moment(e.date).format('Do MMMM YYYY'))) {
			} else {
				arr.push(e);
			}
		});

		return arr;
	};

	getDataForDate = date => {
		// console.log(
		// 	this.props.center.centerData.attendance.filter(
		// 		obj => obj.date === lastDate.date
		// 	)
		// );

		return this.props.center.centerData
			.filter(obj => !obj.location.includes('Sonta'))
			.attendance.filter(obj => moment(obj.date).format('Do MM YY') === moment(date).format('Do MM YY'));
	};

	returnDataLabels = () => {
		if (
			_.isEmpty(
				this.props.center.centerData
					.filter(obj => !obj.location.includes('Sonta'))
					.filter(obj => !obj.location.includes('Sonta')).attendance
			)
		) {
			return ['0/0'];
		}

		const dates = this.returnUniqueArray(
			this.props.center.centerData
				.filter(obj => !obj.location.includes('Sonta'))
				.attendance.slice()
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

	returnDataSets = () => {
		if (_.isEmpty(this.props.center.filter(obj => !obj.location.includes('Sonta')).centerData.attendance)) {
			return [0];
		}

		const dates = this.returnUniqueArray(
			this.props.center
				.filter(obj => !obj.location.includes('Sonta'))
				.centerData.attendance.slice()
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

				<Animatable.View animation='fadeInDown' duration={1000} delay={200}>
					<Card
						containerStyle={{
							...styles.card,
							height: 100,
							alignItems: 'center',
							marginTop: -50,
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
							{this.props.auth.user.center}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							View Individual Centres
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1500} delay={250}>
					<Card containerStyle={{ ...styles.card, height: 500, marginBottom: 50 }}>
						<View style={styles.row}>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Name Of Centre</Text>
						</View>
						<FlatList
							data={this.props.center.allCenterData.filter(obj => !obj.location.includes('Sonta'))}
							style={{ height: 470 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => {
								return (
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
											<Text style={{ color: 'black', marginVertical: 10 }}>{item.location + ' Centre'}</Text>
											<Text style={{ color: 'grey', marginVertical: 10 }}>View</Text>
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

CentresDataHistory['navigationOptions'] = screenProps => ({
	title: 'Constituency History',
});

const mapStateToProps = state => {
	return { center: state.center, auth: state.auth };
};

export default connect(mapStateToProps, null)(CentresDataHistory);
