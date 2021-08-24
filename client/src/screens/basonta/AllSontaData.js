import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { Avatar } from 'react-native-paper';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import moment from 'moment';

class AllSontaData extends Component {
	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
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

				<Animatable.View animation='fadeInDown' duration={1000}>
					<Card
						containerStyle={{
							...styles.card,
							height: 200,
							marginTop: -50,
							alignItems: 'center',
						}}
					>
						{this.props.auth.user.profile_image ? (
							<Avatar.Image
								size={80}
								source={{
									uri: `https://fl-app-v1.herokuapp.com/api/user/profile/image/${this.props.auth.user.profile_image}`,
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
							{this.props.auth.user.first_name} {this.props.auth.user.last_name}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							{this.props.auth.user.center}
						</Text>
					</Card>

					<Card containerStyle={{ ...styles.card, marginBottom: 50, height: 350 }}>
						<Text
							style={{
								textAlign: 'center',
								borderColor: '#dcdcdc',
								borderBottomWidth: 1,
								fontWeight: 'bold',
							}}
						>
							DATA HISTORY
						</Text>

						<View style={styles.row}>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Date</Text>
							<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Attendance</Text>
						</View>
						<FlatList
							data={this.props.center.attendanceData
								.slice()
								.sort(function (a, b) {
									// return a > b ? 1 : a < b ? -1 : 0;
									return a.date.localeCompare(b.date);
								})
								.reverse()}
							style={{ height: 260 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => {
								return (
									<TouchableOpacity onPress={() => this.props.navigation.navigate('SingleSontaData', { item })}>
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

export default connect(mapStateToProps, null)(AllSontaData);
