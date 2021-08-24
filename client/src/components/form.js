import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/style';
import ValidationComponent from 'react-native-form-validator';
import * as Animatable from 'react-native-animatable';
import A from 'react-native-a';
import { navigate } from '../navigationRef';
import DropDownPicker from 'react-native-dropdown-picker';
import serverRequests from '../api/serverRequests';
import _ from 'lodash';

class Form extends ValidationComponent {
	constructor(props) {
		super(props);

		this.state = {
			first_name: '',
			last_name: '',
			email: '',
			phone_number: '',
			password: '',
			centre: '',
			confirmPassword: '',
			showLoading: false,
			allCenters: null,
		};
	}

	onFooterLinkPress = () => {
		this.props.navigation.navigate(this.props.NavPage);
	};

	showErrorMessage = errorMessage => {
		const showMessage = message => {
			if (message.includes('mandatory')) {
				return 'This field is mandatory';
			} else if (message.includes('valid number')) {
				return 'This field is requires a valid number';
			} else if (message.includes('must be greater than')) {
				return 'Your input is too short';
			} else if (message.includes('email address')) {
				return 'Your email is not a valid email address';
			} else if (message.includes('password')) {
				return _.replace(message, 'The field "password"', 'Your password');
			} else {
				return message;
			}
		};

		return (
			<Animatable.View animation='flash'>
				<Text
					style={{
						color: 'red',
						textAlign: 'center',
						fontFamily: 'Avenir',
					}}
				>
					{showMessage(errorMessage)}
				</Text>
			</Animatable.View>
		);
	};

	fetchCenters = async () => {
		try {
			const response = await serverRequests.get('/api/all-centers');
			this.setState({
				allCenters: response.data.sort().map(obj => {
					return { label: obj.location, value: obj.location };
				}),
			});
		} catch (error) {
			console.log(`error fetching centers:`, error);
		}
	};

	onLoginPress = () => {
		// Call ValidationComponent validate method
		this.props.button === 'Sign Up'
			? this.validate({
					first_name: { minlength: 2, required: true },
					last_name: { minlength: 2, required: true },
					email: { email: true, required: true },
					phone_number: {
						numbers: true,
						maxlength: 11,
						minlength: 11,
						required: true,
					},
					centre: {
						required: true,
					},
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
			  })
			: this.validate({
					email: { email: true, required: true },
					password: {
						hasNumber: true,
						hasLowerCase: true,
						hasUpperCase: true,
						hasSpecialCharacter: true,
						required: true,
					},
			  });

		if (this.isFormValid()) {
			if (this.props.button == 'Log In') {
				this.props.submit(this.state.email.trim(), this.state.password);
			}

			if (this.props.button == 'Sign Up') {
				this.props.submit(
					this.state.email.trim(),
					this.state.password,
					this.state.first_name.trim(),
					this.state.last_name.trim(),
					this.state.phone_number.trim(),
					this.state.centre
				);
			}
		}
	};

	setLoadingButton = () => {
		this.setState({ showLoading: !this.state.showLoading });
	};

	componentDidMount() {
		this.fetchCenters();
	}

	render() {
		return (
			<View
				style={{
					...styles.container,
					backgroundColor: 'white',
				}}
			>
				<KeyboardAwareScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps='always'>
					<Image style={styles.logo} source={require('../assets/images/redlogo.png')} />
					{this.props.button === 'Sign Up' && (
						<>
							<TextInput
								style={styles.input}
								placeholder='First Name'
								placeholderTextColor='#aaaaaa'
								onChangeText={first_name =>
									this.setState({ first_name }, () => {
										this.validate({
											first_name: { required: true, minlength: 2 },
										});
									})
								}
								ref='first_name'
								value={this.state.first_name}
								underlineColorAndroid='transparent'
								autoCapitalize='words'
							/>
							{this.isFieldInError('first_name') &&
								this.getErrorsInField('first_name').map(errorMessage => this.showErrorMessage(errorMessage))}

							<TextInput
								style={styles.input}
								placeholder='Last Name'
								placeholderTextColor='#aaaaaa'
								onChangeText={last_name =>
									this.setState({ last_name }, () => {
										this.validate({
											last_name: { required: true, minlength: 2 },
										});
									})
								}
								ref='last_name'
								value={this.state.last_name}
								underlineColorAndroid='transparent'
								autoCapitalize='words'
							/>
							{this.isFieldInError('last_name') &&
								this.getErrorsInField('last_name').map(errorMessage => this.showErrorMessage(errorMessage))}

							<TextInput
								style={styles.input}
								placeholder='Phone Number'
								placeholderTextColor='#aaaaaa'
								onChangeText={phone_number =>
									this.setState({ phone_number }, () => {
										this.validate({
											phone_number: { required: true, minlength: 11, numbers: true, maxlength: 11 },
										});
									})
								}
								ref='phone_number'
								value={this.state.phone_number}
								keyboardType='phone-pad'
								underlineColorAndroid='transparent'
								autoCapitalize='none'
							/>
							{this.isFieldInError('phone_number') &&
								this.getErrorsInField('phone_number').map(errorMessage => this.showErrorMessage(errorMessage))}

							{this.state.allCenters ? (
								<DropDownPicker
									items={_.sortBy(this.state.allCenters, ['label'])}
									searchable={true}
									searchablePlaceholder='Search for a Centre'
									searchablePlaceholderTextColor='gray'
									containerStyle={{ height: 65, marginHorizontal: 12 }}
									ref='centre'
									style={{
										backgroundColor: '#fefffe',
										borderWidth: 0,
										height: 48,
										fontFamily: 'Avenir',
										borderBottomColor: '#808080',
										borderBottomWidth: 1,
										marginTop: 15,
									}}
									itemStyle={{
										justifyContent: 'center',
										backgroundColor: 'ffffff',
										fontFamily: 'Avenir',
									}}
									placeholder='Select A Centre'
									placeholderStyle={{
										color: '#aaaaaa',
										fontFamily: 'Avenir',
									}}
									dropDownStyle={{
										backgroundColor: '#fafafa',
										width: 400,
										marginTop: 16,
										fontFamily: 'Avenir',
									}}
									onChangeItem={item =>
										this.setState(
											{
												centre: item.value.replace('Centre', '').trim(),
											},
											() => {
												this.validate({
													rehearsed_names: { required: true },
												});
											}
										)
									}
								/>
							) : (
								<ActivityIndicator />
							)}
							{this.isFieldInError('centre') &&
								this.getErrorsInField('centre').map(errorMessage => this.showErrorMessage(errorMessage))}
						</>
					)}
					<TextInput
						style={styles.input}
						placeholder='E-mail'
						placeholderTextColor='#aaaaaa'
						onChangeText={email =>
							this.setState({ email: email.toLowerCase() }, () => {
								this.validate({
									email: { required: true, email: true },
								});
							})
						}
						ref='email'
						keyboardType='email-address'
						value={this.state.email}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					{this.isFieldInError('email') &&
						this.getErrorsInField('email').map(errorMessage => this.showErrorMessage(errorMessage))}

					<TextInput
						style={styles.input}
						placeholderTextColor='#aaaaaa'
						secureTextEntry
						placeholder='Password'
						ref='password'
						onChangeText={password =>
							this.setState({ password }, () => {
								this.validate({
									password: { required: true, minlength: 2 },
								});
							})
						}
						value={this.state.password}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					{this.isFieldInError('password') &&
						this.getErrorsInField('password').map(errorMessage => this.showErrorMessage(errorMessage))}

					{this.props.button === 'Sign Up' && (
						<>
							<TextInput
								style={styles.input}
								placeholderTextColor='#aaaaaa'
								secureTextEntry
								placeholder='Confirm Password'
								ref='confirmPassword'
								onChangeText={confirmPassword =>
									this.setState({ confirmPassword }, () => {
										this.validate({
											confirmPassword: { required: true, minlength: 2 },
										});
									})
								}
								value={this.state.confirmPassword}
								underlineColorAndroid='transparent'
								autoCapitalize='none'
							/>
							{this.isFieldInError('confirmPassword') &&
								this.getErrorsInField('confirmPassword').map(errorMessage => this.showErrorMessage(errorMessage))}
						</>
					)}

					{this.props.button === 'Sign Up' && (
						<Text
							style={{
								width: 360,
								marginLeft: 30,
								marginTop: 10,
								marginBottom: 10,
								fontFamily: 'Avenir',
							}}
						>
							By signing up you agree to First Love Church using your personal data in accordance with our{' '}
							<A href='example.com'>Privacy Policy. </A>
						</Text>
					)}

					{/* Show an activity indicator if server is taking forever.             */}
					{this.props.showLoading && this.isFormValid() ? (
						<ActivityIndicator />
					) : (
						<TouchableOpacity
							placeHolderContent={ActivityIndicator}
							style={styles.button}
							onPress={() => {
								this.onLoginPress();
							}}
						>
							<Text style={styles.buttonTitle}>{this.props.button.toUpperCase()}</Text>
						</TouchableOpacity>
					)}

					{this.props.errorMessage && (
						<Animatable.View animation='flash'>
							<Text style={styles.flashErrorMessage}>
								Oops! Your username or password is incorrect, please try again.
							</Text>
						</Animatable.View>
					)}

					{/* Deciding to log in or sign up  */}
					<View style={styles.footerView}>
						<TouchableOpacity
							onPress={this.onFooterLinkPress}
							style={{
								...styles.footerLink,
								...styles.footerText,
								marginHorizontal: 10,
								textDecorationLine: 'underline',
							}}
						>
							<Text style={styles.footerText}>{this.props.LinkText} INSTEAD?</Text>
						</TouchableOpacity>
						{/* <Text>{this.getErrorMessages()}</Text> */}

						{this.props.button !== 'Sign Up' && (
							<TouchableOpacity
								onPress={() => navigate('PasswordReset')}
								style={{
									...styles.footerLink,
									marginHorizontal: 10,
								}}
							>
								<Text style={styles.footerText}>FORGOTTEN PASSWORD</Text>
							</TouchableOpacity>
						)}
						{/* <Text>{this.getErrorMessages()}</Text> */}
					</View>

					{/* If in Sign up, hide forgotten password */}
				</KeyboardAwareScrollView>
			</View>
		);
	}
}

export default Form;
