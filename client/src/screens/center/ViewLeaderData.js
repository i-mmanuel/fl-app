import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { Avatar } from 'react-native-paper';
import _ from 'lodash';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import moment from 'moment';

class ViewLeaderData extends Component {
	state = {
		photo: null,
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

	returnLeaderImage = id => {
		let uri;
		this.props.center.leadersData.find(el => {
			if (el._id === id) {
				uri = el.profile_image;
			}
		});

		return uri;
	};

	returnDetails = param => {
		let data = this.props.navigation.getParam('item');

		return data[param];
	};

	renderData = (title, param) => {
		return (
			<>
				<View style={styles.row}>
					<Text style={{ marginVertical: 10 }}>{title}</Text>
				</View>
				<View>
					<Text style={{ color: 'black', marginVertical: 10 }}>{this.returnDetails(param)}</Text>
				</View>
			</>
		);
	};

	componentDidMount() {
		this.setState({
			photo: this.returnLeaderImage(this.props.navigation.getParam('item').leader_id),
		});
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
						style={[styles.homePageImage, { marginTop: 80 }]}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1000} delay={200}>
					<Card
						containerStyle={{
							...styles.card,
							height: 150,
							alignItems: 'center',
							marginTop: -50,
						}}
					>
						{this.state.photo ? (
							<Avatar.Image
								size={50}
								source={{
									uri: `https://fl-app-v1.herokuapp.com/api/user/profile/image/${this.state.photo}`,
								}}
								style={{ marginBottom: 10, alignSelf: 'center' }}
							/>
						) : (
							<Avatar.Image
								size={50}
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
							{this.returnLeaderName(this.props.navigation.getParam('item').leader_id)}
						</Text>

						<Text
							style={{
								marginTop: 5,
								fontSize: 15,
								fontFamily: 'Avenir',
								textAlign: 'center',
							}}
						>
							{this.props.navigation.getParam('center')} Centre
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300} delay={250}>
					<Card containerStyle={{ ...styles.card, height: 700, marginBottom: 50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								marginVertical: 10,
								fontSize: 15,
							}}
						>
							Data Submitted for {moment(this.returnDetails('date')).format('Do MMMM YYYY')}
						</Text>

						<Text
							style={{
								textAlign: 'center',
								fontStyle: 'italic',
								marginBottom: 10,
								fontSize: 12,
							}}
						>
							Submitted {moment(this.returnDetails('createdAt')).fromNow()}
						</Text>

						{this.renderData('NUMBER OF MEMBERS WHO ATTTENDED:', 'attendance_number')}
						{this.renderData('NAMES OF MEMBERS WHO ATTENDED:', 'attendance_names')}
						{this.renderData('NUMBER OF FIRST TIMERS:', 'number_first_timers')}
						{this.renderData('NUMBER OF CONVERTS:', 'number_of_converts')}
						{this.renderData('NAMES OF CONVERTS:', 'names_of_converts')}
						{this.renderData('NUMBER OF MEMBERS WHO STARTED NBS:', 'started_nbs')}
						{this.renderData('NUMBER OF MEMBERS WHO FINISHED NBS:', 'finished_nbs')}
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return {
		auth: state.auth,
		center: state.center,
	};
};

export default connect(mapStateToProps, null)(ViewLeaderData);
