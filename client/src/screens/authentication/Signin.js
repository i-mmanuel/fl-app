import React, { Component } from 'react';
import Form from '../../components/form';
import { connect } from 'react-redux';
import { clearMessage, SignIn } from '../../actions';
import { navigate } from '../../navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serverRequests from '../../api/serverRequests';

class Signin extends Component {
	state = {
		showLoading: false,
		errorMessage: null,
	};

	formSubmission = async (email, password) => {
		this.setState({ showLoading: true });

		try {
			let response = await serverRequests.post('/signin', {
				email,
				password,
			});
			await AsyncStorage.setItem('token', response.data.token);
			await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

			this.props.SignIn(response);
			this.setState({ showLoading: false });
			if (response.data.user.membership_type === undefined || response.data.user.membership_type === null) {
				navigate('pendingVerify');
			} else if (response.data.user.membership_type === 'Bishop') {
				navigate('bishopFlow');
			} else if (response.data.user.membership_type === 'Admin') {
				navigate('adminFlow');
			} else if (response.data.user.membership_type === 'Overseer') {
				navigate('overseerFlow');
			} else if (response.data.user.membership_type === 'Centre leader') {
				if (response.data.user.center.includes('Sonta')) {
					navigate('sontaFlow');
				} else {
					navigate('centerFlow');
				}
			} else if (response.data.user.membership_type === 'Bacenta leader') {
				if (response.data.user.center.includes('Sonta')) {
					navigate('basontaFlow');
				} else {
					navigate('mainFlow');
				}
			} else {
				navigate('mainFlow');
			}
		} catch (error) {
			this.setState({ errorMessage: error, showLoading: false });
			console.log('error', error);
		}
	};

	render() {
		return (
			<Form
				navigation={this.props.navigation}
				button='Log In'
				LinkText='SIGN UP'
				NavPage='SignUp'
				showLoading={this.state.showLoading}
				submit={this.formSubmission}
				errorMessage={this.state.errorMessage}
			/>
		);
	}
}

Signin['navigationOptions'] = screenProps => ({
	title: 'SIGN IN',
	fontFamily: 'Avenir',
	headerStyle: {
		shadowColor: 'transparent',
	},
	headerLeft: () => null,
});

const mapStateToProps = state => {
	return { auth: state.auth };
};

export default connect(mapStateToProps, { SignIn, clearMessage })(Signin);
