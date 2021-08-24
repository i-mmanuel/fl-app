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

class ViewSontaLeaderData extends Component {
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
					<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>{title}</Text>
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
							{this.props.auth.user.center.includes('Constituency')
								? this.props.navigation.getParam('center')
								: this.props.auth.user.center}
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1300} delay={250}>
					<Card containerStyle={{ ...styles.card, height: 600, marginBottom: 50 }}>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								marginVertical: 12,
								fontSize: 18,
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
							Submitted on {moment(this.returnDetails('createdAt')).format('LLLL')}
						</Text>

						<View style={{ height: 600 }} showsVerticalScrollIndicator={false}>
							{this.renderData('NUMBER OF MEMBERS WHO ATTTENDED:', 'attendance_number')}
							{this.renderData('NAMES OF MEMBERS WHO ATTENDED:', 'attendance_names')}
							{this.renderData('NUMBER OF MEMBERS WHO REHEARSED:', 'rehearsed_number')}
							{this.renderData('NAMES OF MEMBERS WHO REHEARSED:', 'rehearsed_names')}
							{this.renderData('NUMBER OF MEMBERS WHO MINISTERED:', 'ministered_number')}
							{this.renderData('NAMES OF MEMBERS WHO MINISTERED:', 'ministered_names')}
						</View>
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

export default connect(mapStateToProps, null)(ViewSontaLeaderData);
