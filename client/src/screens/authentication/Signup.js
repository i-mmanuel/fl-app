import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { SignUp } from '../../actions';
import serverRequests from '../../api/serverRequests';
import Form from '../../components/form';
import { navigate } from '../../navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Signup extends Component {
	closeApp = () => {
		setTimeout(() => {
			navigate('SignIn');
		}, 1200000);
	};

	componentDidMount() {
		this.closeApp();
	}

	state = {
		showLoading: false,
		errorMessage: null,
	};

	formSubmission = async (
		email,
		password,
		first_name,
		last_name,
		phone_number,
		center
	) => {
		this.setState({ showLoading: true });

		try {
			const response = await serverRequests.post('/signup', {
				email,
				password,
				first_name,
				last_name,
				phone_number,
				center,
			});
			await AsyncStorage.setItem('token', response.data.token);
			await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

			this.props.SignUp(response);
			this.setState({ showLoading: false });
			navigate('pendingVerify');
		} catch (error) {
			this.setState({ errorMessage: error, showLoading: false });
			console.log(error);
		}
	};

	render() {
		return (
			<Form
				navigation={this.props.navigation}
				button='Sign Up'
				LinkText='SIGN IN'
				NavPage='SignIn'
				submit={this.formSubmission}
				errorMessage={this.state.errorMessage}
			/>
		);
	}
}

Signup['navigationOptions'] = screenProps => ({
	title: 'SIGN UP',
	headerStyle: {
		shadowColor: 'transparent',
	},
});

const mapStateToProps = state => {
	return { auth: state.auth };
};

export default connect(mapStateToProps, { SignUp })(Signup);
