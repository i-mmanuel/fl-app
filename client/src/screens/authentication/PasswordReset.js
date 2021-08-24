import React from 'react';
import ValidationComponent from 'react-native-form-validator';
import { View } from 'react-native';
import { navigate } from '../../navigationRef';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import serverRequests from '../../api/serverRequests';
import style from '../../styles/style';
import { Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native';

class PasswordReset extends ValidationComponent {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			showLoading: false,
		};
	}

	showErrorMessage = field => {
		return (
			this.isFieldInError(field) &&
			this.getErrorsInField(field).map((errorMessage, index) => (
				<Animatable.View animation='flash' key={index * 949493}>
					<Text
						style={{
							color: 'red',
							textAlign: 'center',
							fontFamily: 'Avenir',
						}}
					>
						{errorMessage}
					</Text>
				</Animatable.View>
			))
		);
	};

	onSubmit = async () => {
		this.validate({
			email: { email: true, required: true },
			password: {
				hasNumber: true,
				hasLowerCase: true,
				hasUpperCase: true,
				hasSpecialCharacter: true,
				required: true,
			},
			confirmPassword: {
				equalPassword: this.state.password,
				required: true,
			},
		});

		if (this.isFormValid()) {
			this.setState({ showLoading: true });
			try {
				let response = await serverRequests.post('/password-reset', {
					email: this.state.email,
					password: this.state.password,
				});
				this.setState({ showLoading: false });
				console.log(response.data);
				navigate('SignIn');
			} catch (error) {
				this.setState({ showLoading: false });
				console.log(`error changing password`, error);
			}
		}
	};

	renderForm = () => {
		return (
			<View style={{ ...style.container, backgroundColor: 'white' }}>
				<KeyboardAwareScrollView
					style={{ flex: 1, width: '100%' }}
					keyboardShouldPersistTaps='always'
				>
					<Image
						style={style.logo}
						source={require('../../assets/images/redlogo.png')}
					/>
					<TextInput
						style={style.input}
						placeholder='E-mail'
						placeholderTextColor='#aaaaaa'
						onChangeText={email => this.setState({ email })}
						ref='email'
						value={this.state.email}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					{this.showErrorMessage('email')}

					<TextInput
						style={style.input}
						placeholderTextColor='#aaaaaa'
						secureTextEntry
						placeholder='Password'
						ref='password'
						onChangeText={password => this.setState({ password })}
						value={this.state.password}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					{this.showErrorMessage('password')}

					<TextInput
						style={style.input}
						placeholderTextColor='#aaaaaa'
						secureTextEntry
						placeholder='Confirm Password'
						ref='confirmPassword'
						onChangeText={confirmPassword => this.setState({ confirmPassword })}
						value={this.state.confirmPassword}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					{this.showErrorMessage('confirmPassword')}

					{this.state.showLoading && this.isFormValid() ? (
						<ActivityIndicator />
					) : (
						<TouchableOpacity
							style={style.button}
							onPress={() => this.onSubmit()}
						>
							<Text style={style.buttonTitle}>CHANGE PASSWORD</Text>
						</TouchableOpacity>
					)}
				</KeyboardAwareScrollView>
			</View>
		);
	};

	render() {
		return this.renderForm();
	}
}

PasswordReset['navigationOptions'] = screenProps => ({
	title: 'SIGN UP',
	headerStyle: {
		shadowColor: 'transparent',
	},
});

export default PasswordReset;
