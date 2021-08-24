import React from 'react';
import { Card } from 'react-native-elements';
import { Image, Text, View, ActivityIndicator, Platform } from 'react-native';
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
// import CustomMultiPicker from 'react-native-multiple-select-list';
import ValidationComponent from 'react-native-form-validator';
import styles from '../../styles/style';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { connect } from 'react-redux';
import serverRequests from '../../api/serverRequests';
import { AddAttendance, AddCenterData } from '../../actions';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class SontaDataSubmit extends ValidationComponent {
	constructor(props) {
		super(props);

		this.state = {
			attendance_number: '',
			attended_names: '',
			ministered_names: '',
			ministered_number: '',
			rehearsed_names: '',
			rehearsed_number: '',
			showLoading: false,
			showDatePicker: false,
			hideDatePicker: false,
			showLoading: false,
			date: moment().format(),
			errorMessage: null,
			isIos: false,
		};
	}

	showErrorMessage = errorMessage => {
		const showMessage = message => {
			if (message.includes('mandatory')) {
				return 'This field is mandatory';
			} else if (message.includes('valid number')) {
				return 'This field is requires a valid number';
			} else if (message.includes('must be greater than')) {
				return 'Your input is too short';
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

	handleSubmit = async () => {
		const url = `/api/${this.props.auth.user.center}/attendance/new`;

		this.validate({
			attendance_number: { required: true, numbers: true },
			attended_names: { required: true, minlength: 2 },
			rehearsed_number: { required: true, numbers: true },
			rehearsed_names: { required: true, minlength: 2 },
			ministered_number: { required: true, numbers: true },
			ministered_names: { required: true, minlength: 2 },
		});

		if (this.isDateUnique()) {
			if (this.isFormValid()) {
				this.setState({ showLoading: true });

				try {
					let response = await serverRequests.post(url, {
						date: this.state.date,
						attendance_number: this.state.attendance_number.trim(),
						attendance_names: this.state.attended_names.trim(),
						ministered_names: this.state.ministered_names.trim(),
						ministered_number: this.state.ministered_number.trim(),
						rehearsed_number: this.state.rehearsed_number.trim(),
						rehearsed_names: this.state.rehearsed_names.trim(),
						leader_id: this.props.auth.user._id,
					});

					if (
						this.props.auth.user.membership_type === 'Admin' ||
						this.props.auth.user.membership_type === 'Centre leader'
					) {
						let center = await serverRequests.get(`/api/${this.props.auth.user.center}`);

						this.props.AddCenterData(center.data);
					}

					this.setState({ showLoading: false });
					this.props.AddAttendance(response.data);
					this.props.navigation.navigate('Home');
				} catch (error) {
					this.setState({ showLoading: false });
					this.setState({ errorMessage: error.message });
					console.log(`error from data form`, error.message);
				}
			}
		} else {
			Alert.alert('DUPLICATE DATE', 'You have a submission for this date', [
				{
					text: 'Cancel',
					onPress: () => false,
					style: 'cancel',
				},
				{
					text: 'Change',
					onPress: () => this.setState({ showDatePicker: true }),
				},
			]);
		}
	};

	isDateUnique = () => {
		let dates = this.props.center.attendanceData.filter(
			obj =>
				moment(obj.date).format('Do MMMM YYYY') === moment(this.state.date).format('Do MMMM YYYY') &&
				obj.leader_id === this.props.auth.user._id
		);

		return dates.length < 1 ? true : false;
	};

	handleConfirm = date => {
		this.setState({ date: date, showDatePicker: false });
	};

	render() {
		return (
			<KeyboardAwareScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1500}
					delay={150}
				>
					<Image
						source={require('../../assets/images/whitelogowithoutchurch.png')}
						style={[styles.homePageImage, { marginTop: 100 }]}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1000} style={{ marginTop: -70 }}>
					<Card containerStyle={[styles.card, { height: 700, marginBottom: 50 }]}>
						<View>
							<Text
								style={{
									textAlign: 'center',
									marginBottom: 10,
									color: 'black',
									fontSize: 24,
									fontWeight: 'bold',
								}}
							>
								SUBMIT DATA
							</Text>

							<View>
								{/* <Button onPress={()=>{this.setState({showDatePicker: true})}} title="Open Date Picker"></Button> */}
								<TextInput
									style={{ ...styles.input }}
									placeholder='Date Of Service'
									placeholderTextColor='#aaaaaa'
									onTouchStart={() => {
										Platform.OS === 'ios'
											? this.setState({ showDatePicker: true, isIos: true })
											: this.setState({ showDatePicker: true, isIos: false });
									}}
									value={String(moment(this.state.date).calendar())}
									underlineColorAndroid='transparent'
									autoCapitalize='words'
								/>
								<DateTimePickerModal
									isVisible={this.state.showDatePicker}
									mode='date'
									onConfirm={this.handleConfirm}
									onCancel={() => {
										this.setState({ showDatePicker: false });
									}}
								/>

								{this.state.showDatePicker && this.state.isIos === false ? (
									<DateTimePicker
										value={moment(this.state.date).toDate()}
										mode={'date'}
										is24Hour={true}
										onChange={(event, date) => {
											this.setState({ showDatePicker: false, date: date });
										}}
									/>
								) : null}

								<TextInput
									style={styles.input}
									placeholder='Attendance Number'
									placeholderTextColor='#aaaaaa'
									ref='attendance_number'
									value={this.state.attendance_number}
									underlineColorAndroid='transparent'
									keyboardType='numeric'
									onChangeText={attendance_number =>
										this.setState({ attendance_number }, () => {
											this.validate({
												attendance_number: { required: true, numbers: true },
											});
										})
									}
								/>
								{this.isFieldInError('attendance_number') &&
									this.getErrorsInField('attendance_number').map(errorMessage => this.showErrorMessage(errorMessage))}

								<TextInput
									style={{ ...styles.input }}
									multiline={true}
									placeholder='Names Of Members Who Attended'
									placeholderTextColor='#aaaaaa'
									onChangeText={attended_names =>
										this.setState({ attended_names }, () => {
											this.validate({
												attended_names: { required: true, minlength: 2 },
											});
										})
									}
									ref='attended_names'
									value={this.state.attended_names}
									underlineColorAndroid='transparent'
								/>
								{this.isFieldInError('attended_names') &&
									this.getErrorsInField('attended_names').map(errorMessage => this.showErrorMessage(errorMessage))}

								<TextInput
									style={{ ...styles.input }}
									placeholder='Number Of Members Who Rehearsed'
									placeholderTextColor='#aaaaaa'
									onChangeText={rehearsed_number =>
										this.setState({ rehearsed_number }, () => {
											this.validate({
												rehearsed_number: { required: true, numbers: true },
											});
										})
									}
									ref='rehearsed_number'
									keyboardType='numeric'
									value={this.state.rehearsed_number}
									underlineColorAndroid='transparent'
								/>
								{this.isFieldInError('rehearsed_number') &&
									this.getErrorsInField('rehearsed_number').map(errorMessage => this.showErrorMessage(errorMessage))}

								<TextInput
									style={{ ...styles.input }}
									multiline={true}
									placeholder='Names Of Members Who Rehearsed'
									placeholderTextColor='#aaaaaa'
									onChangeText={rehearsed_names =>
										this.setState({ rehearsed_names }, () => {
											this.validate({
												rehearsed_names: { required: true, minlength: 2 },
											});
										})
									}
									ref='rehearsed_names'
									value={this.state.rehearsed_names}
									underlineColorAndroid='transparent'
								/>
								{this.isFieldInError('rehearsed_names') &&
									this.getErrorsInField('rehearsed_names').map(errorMessage => this.showErrorMessage(errorMessage))}

								<TextInput
									style={{ ...styles.input }}
									placeholder='Number Of Members Who Ministered'
									placeholderTextColor='#aaaaaa'
									onChangeText={ministered_number =>
										this.setState({ ministered_number }, () => {
											this.validate({
												ministered_number: { required: true, numbers: true },
											});
										})
									}
									ref='num_converts'
									value={this.state.ministered_number}
									keyboardType='numeric'
									underlineColorAndroid='transparent'
									autoCapitalize='none'
								/>
								{this.isFieldInError('ministered_number') &&
									this.getErrorsInField('ministered_number').map(errorMessage => this.showErrorMessage(errorMessage))}

								<TextInput
									style={{ ...styles.input }}
									multiline={true}
									placeholder='Names Of Members Who Ministered'
									placeholderTextColor='#aaaaaa'
									onChangeText={ministered_names =>
										this.setState({ ministered_names }, () => {
											this.validate({
												ministered_names: { required: true, minlength: 2 },
											});
										})
									}
									ref='ministered_names'
									value={this.state.ministered_names}
									underlineColorAndroid='transparent'
								/>
								{this.isFieldInError('ministered_names') &&
									this.getErrorsInField('ministered_names').map(errorMessage => this.showErrorMessage(errorMessage))}

								{this.state.showLoading ? (
									<ActivityIndicator />
								) : (
									<TouchableOpacity style={styles.button} onPress={() => this.handleSubmit()}>
										<Text style={{ color: 'white' }}>SUBMIT </Text>
									</TouchableOpacity>
								)}

								{this.state.errorMessage && (
									<Animatable.View animation='flash'>
										<Text style={styles.flashErrorMessage}>{this.state.errorMessage}</Text>
									</Animatable.View>
								)}
							</View>
						</View>
					</Card>
				</Animatable.View>
			</KeyboardAwareScrollView>
		);
	}
}

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, { AddAttendance, AddCenterData })(SontaDataSubmit);
