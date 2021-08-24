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

class NewDataForm extends ValidationComponent {
	constructor(props) {
		super(props);

		this.state = {
			name_firsttimers: '',
			attendance_num: '',
			num_converts: '',
			attended_names: '',
			name_converts: '',
			num_firsttimers: '',
			num_startednbs: '',
			num_finishednbs: '',
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
			attendance_num: { required: true, numbers: true },
			attended_names: { required: true, minlength: 2 },
			num_firsttimers: { required: true, numbers: true },
			name_firsttimers: { required: true, minlength: 2 },
			num_converts: { required: true, numbers: true },
			name_converts: { required: true, minlength: 2 },
			num_startednbs: { required: true, numbers: true },
			num_finishednbs: { required: true, numbers: true },
		});

		if (this.isDateUnique()) {
			if (this.isFormValid()) {
				this.setState({ showLoading: true });
				try {
					let response = await serverRequests.post(url, {
						date: this.state.date,
						attendance_number: this.state.attendance_num.trim(),
						attendance_names: this.state.attended_names.trim(),
						number_first_timers: this.state.num_firsttimers.trim(),
						names_first_timers: this.state.name_firsttimers.trim(),
						number_of_converts: this.state.num_converts.trim(),
						names_of_converts: this.state.name_converts.trim(),
						started_nbs: this.state.num_startednbs.trim(),
						finished_nbs: this.state.num_finishednbs.trim(),
						leader_id: this.props.auth.user._id,
					});

					this.props.AddAttendance(response.data);

					if (
						this.props.auth.user.membership_type === 'Admin' ||
						this.props.auth.user.membership_type === 'Centre leader'
					) {
						let center = await serverRequests.get(`/api/${this.props.auth.user.center}`);

						this.props.AddCenterData(center.data);
					}

					this.setState({ showLoading: false });
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
					<Card containerStyle={[styles.card, { height: 800, marginBottom: 50 }]}>
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
						{/* <Text
							style={{
								textAlign: 'center',
								marginBottom: 20,
								color: 'black',
								fontSize: 14,
								fontWeight: 'bold',
							}}
						>
							{moment(this.state.date).format('Do MMMM YYYY')}
						</Text> */}

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
							value={moment(this.state.date).calendar()}
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
							ref='attendance_num'
							value={this.state.attendance_num}
							underlineColorAndroid='transparent'
							keyboardType='numeric'
							autoCapitalize='words'
							onChangeText={attendance_num =>
								this.setState({ attendance_num }, () => {
									this.validate({
										attendance_num: { required: true, numbers: true },
									});
								})
							}
						/>
						{this.isFieldInError('attendance_num') &&
							this.getErrorsInField('attendance_num').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							multiline={true}
							placeholder='Names Of Members That Attended'
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
							autoCapitalize='words'
						/>
						{this.isFieldInError('attended_names') &&
							this.getErrorsInField('attended_names').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							placeholder='Number Of First Timers'
							placeholderTextColor='#aaaaaa'
							onChangeText={num_firsttimers =>
								this.setState({ num_firsttimers }, () => {
									this.validate({
										num_firsttimers: { required: true, numbers: true },
									});
								})
							}
							ref='num_firsttimers'
							keyboardType='numeric'
							value={this.state.num_firsttimers}
							underlineColorAndroid='transparent'
						/>
						{this.isFieldInError('num_firsttimers') &&
							this.getErrorsInField('num_firsttimers').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							multiline={true}
							placeholder='Names Of First Timers'
							placeholderTextColor='#aaaaaa'
							onChangeText={name_firsttimers =>
								this.setState({ name_firsttimers }, () => {
									this.validate({
										name_firsttimers: { required: true, minlength: 2 },
									});
								})
							}
							ref='name_firsttimers'
							value={this.state.name_firsttimers}
							underlineColorAndroid='transparent'
							multiline={true}
							autoCapitalize='words'
						/>
						{this.isFieldInError('name_firsttimers') &&
							this.getErrorsInField('name_firsttimers').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							placeholder='Number Of New Converts'
							placeholderTextColor='#aaaaaa'
							onChangeText={num_converts =>
								this.setState({ num_converts }, () => {
									this.validate({
										num_converts: { required: true, numbers: true },
									});
								})
							}
							ref='num_converts'
							value={this.state.num_converts}
							keyboardType='numeric'
							underlineColorAndroid='transparent'
						/>
						{this.isFieldInError('num_converts') &&
							this.getErrorsInField('num_converts').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							multiline={true}
							placeholder='Names Of New Converts'
							placeholderTextColor='#aaaaaa'
							multiline={true}
							onChangeText={name_converts =>
								this.setState({ name_converts }, () => {
									this.validate({
										name_converts: { required: true, minlength: 2 },
									});
								})
							}
							ref='name_converts'
							value={this.state.name_converts}
							underlineColorAndroid='transparent'
							autoCapitalize='words'
						/>
						{this.isFieldInError('name_converts') &&
							this.getErrorsInField('name_converts').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							placeholder='Started NBS'
							placeholderTextColor='#aaaaaa'
							onChangeText={num_startednbs =>
								this.setState({ num_startednbs }, () => {
									this.validate({
										num_startednbs: { required: true, numbers: true },
									});
								})
							}
							ref='num_startednbs'
							keyboardType='numeric'
							value={this.state.num_startednbs}
							underlineColorAndroid='transparent'
							autoCapitalize='none'
						/>
						{this.isFieldInError('num_startednbs') &&
							this.getErrorsInField('num_startednbs').map(errorMessage => this.showErrorMessage(errorMessage))}

						<TextInput
							style={{ ...styles.input }}
							placeholder='Finished NBS'
							placeholderTextColor='#aaaaaa'
							onChangeText={num_finishednbs =>
								this.setState({ num_finishednbs }, () => {
									this.validate({
										num_finishednbs: { required: true, numbers: true },
									});
								})
							}
							ref='num_finishednbs'
							keyboardType='numeric'
							value={this.state.num_finishednbs}
							underlineColorAndroid='transparent'
							autoCapitalize='none'
						/>
						{this.isFieldInError('num_finishednbs') &&
							this.getErrorsInField('num_finishednbs').map(errorMessage => this.showErrorMessage(errorMessage))}

						{this.state.showLoading ? (
							<ActivityIndicator />
						) : (
							<TouchableOpacity style={styles.button} onPress={() => this.handleSubmit()}>
								<Text style={{ color: 'white' }}>SUBMIT </Text>
							</TouchableOpacity>
						)}

						{this.state.errorMessage && (
							<Animatable.View animation='flash'>
								<Text style={styles.flashErrorMessage}>
									Oops! Your username or password is incorrect, please try again.
								</Text>
							</Animatable.View>
						)}
					</Card>
				</Animatable.View>
			</KeyboardAwareScrollView>
		);
	}
}

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, { AddAttendance, AddCenterData })(NewDataForm);
