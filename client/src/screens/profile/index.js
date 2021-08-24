import React, { Component } from 'react';
import { Text, Image, View, Alert, Platform } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import DrawerToggle from '../../components/DrawerToggle';
import { Avatar } from 'react-native-paper';
import _ from 'lodash';
import { AddUserData, clearMessage, SignOut } from '../../actions';
import styles from '../../styles/style';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import FormData from 'form-data';

class Profile extends Component {
	state = {
		errorMessage: null,
		photo: this.props.auth.user.profile_image,
	};

	showDialog = () => {
		Alert.alert('SIGN OUT', 'Are you sure you want to sign out?', [
			{
				text: 'NO',
				onPress: () => false,
				style: 'cancel',
			},
			{ text: 'YES', onPress: () => this.props.SignOut() },
		]);
	};

	setPermissions = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();

		if (status !== 'granted') {
			alert('Permission denied');
		}
	};

	pickImage = async () => {
		this.setPermissions();

		let imageSel = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!imageSel.cancelled) {
			const image = {
				uri: imageSel.uri,
				type: imageSel.type,
				name: Platform.OS === 'ios' ? imageSel.uri.replace('file://', '') : imageSel.uri,
			};

			const payload = new FormData();
			payload.append('image', image);

			try {
				let response = await axios({
					url: `https://fl-app-v1.herokuapp.com/api/user/profile/image/${this.props.auth.user._id}`,
					data: payload,
					method: 'POST',
				});

				this.props.AddUserData(response.data);
				this.setState({ photo: 'uploads/nxx3e8jajg541.jpg' });
				this.setState({ photo: response.data.profile_image });
				// this.setState({ photo: response.data.profile_image });
			} catch (error) {
				console.log(error);
			}
		}
	};

	componentDidMount() {}

	render() {
		return (
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
				<View style={{ backgroundColor: '#9d0d0e', height: 280 }}>
					<DrawerToggle />
					<Image style={[styles.homePageImage]} source={require('../../assets/images/whitelogowithoutchurch.png')} />
				</View>

				<Animatable.View animation='fadeInDown' duration={1000} delay={100}>
					<Card
						containerStyle={{
							...styles.card,
							height: 200,
							marginTop: -50,
							paddingTop: 30,
							alignItems: 'center',
						}}
					>
						{/* <TouchableOpacity onPress={this.pickImage}> */}
						<TouchableOpacity>
							{this.state.photo ? (
								<Avatar.Image
									size={100}
									source={{
										uri: `https://fl-app-v1.herokuapp.com/api/user/profile/image/${this.state.photo}`,
									}}
									style={{ marginBottom: 10, alignSelf: 'center' }}
								/>
							) : (
								<Avatar.Image
									size={100}
									source={require('../../assets/images/sophie_passport.jpg')}
									style={{ marginBottom: 10, alignSelf: 'center' }}
								/>
							)}
						</TouchableOpacity>

						<Text
							style={{
								fontWeight: 'bold',
								fontSize: 25,
								fontFamily: 'Avenir',
							}}
						>
							{this.props.auth.user.first_name} {this.props.auth.user.last_name}
						</Text>
					</Card>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1200} delay={10}>
					<Card
						containerStyle={{
							...styles.card,
							height: 400,
							marginVertical: 10,
							marginBottom: 20,
						}}
					>
						<ListItem key={22}>
							<Text>Email: {this.props.auth.user.email}</Text>
						</ListItem>
						<ListItem>
							<Text>Phone number: {this.props.auth.user.phone_number}</Text>
						</ListItem>
						<ListItem>
							<Text>Centre: {this.props.auth.user.center}</Text>
						</ListItem>
						<ListItem>
							<Text>Email confirmed: {this.props.auth.user.email_confirmed ? 'Yes' : 'No'}</Text>
						</ListItem>
						<TouchableOpacity style={styles.errorMessage} onPress={this.showDialog}>
							<Text style={styles.buttonTitle}>SIGN OUT</Text>
						</TouchableOpacity>
						{this.props.auth.user.membership_type === 'Admin' && (
							<TouchableOpacity
								style={{ ...styles.errorMessage, backgroundColor: 'green' }}
								onPress={() => this.props.navigation.navigate('AdminHome')}
							>
								<Text style={styles.buttonTitle}>Switch account</Text>
							</TouchableOpacity>
						)}
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return { auth: state.auth };
};

Profile['navigationOptions'] = screenProps => ({
	title: 'PROFILE',
	headerStyle: {
		shadowColor: 'transparent',
	},
});

export default connect(mapStateToProps, { SignOut, clearMessage, AddUserData })(Profile);
