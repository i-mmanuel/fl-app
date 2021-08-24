import React from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image, TextInput, ActivityIndicator, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import ValidationComponent from 'react-native-form-validator';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../../styles/style';
import serverRequests from '../../api/serverRequests';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { AddAttendance, AddCenterData } from '../../actions';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class EditDataForm extends ValidationComponent {
	constructor(props) {
		super(props);

		this.state = {
			name_firsttimers: this.props.navigation.getParam('data').names_first_timers,
			attendance_num: this.props.navigation.getParam('data').attendance_number,
			num_converts: this.props.navigation.getParam('data').number_of_converts,
			attended_names: this.props.navigation.getParam('data').attendance_names,
			name_converts: this.props.navigation.getParam('data').names_of_converts,
			num_firsttimers: this.props.navigation.getParam('data').number_first_timers,
			num_startednbs: this.props.navigation.getParam('data').started_nbs,
			num_finishednbs: this.props.navigation.getParam('data').finished_nbs,
			showLoading: false,
			members: [],
			showDatePicker: false,
			hideDatePicker: false,
			showLoading: false,
			isIos: false,
			date: this.props.navigation.getParam('data').date,
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

	handleSubmit = async () => {
		const url =
			'/api/' +
			this.props.auth.user.center +
			'/attendance/edit/' +
			this.props.navigation.getParam('data')._id +
			'/' +
			this.props.auth.user._id;

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
					this.setState({ showLoading: false });
				} catch (error) {
					this.setState({ showLoading: false });
					console.log(error.message);
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
				obj.leader_id === this.props.navigation.getParam('data').leader_id
		);

		return dates.length < 1 || dates.filter(obj => obj._id === this.props.navigation.getParam('data')._id).length === 1
			? true
			: false;
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
						style={[styles.homePageImage, { marginTop: 100 }]}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1000} style={{ marginTop: -70 }}>
					<Card containerStyle={{ ...styles.card, height: 850, marginBottom: 50 }} showsVerticalScrollIndicator={false}>
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
								EDIT DATA
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
								{String(moment(this.state.date).format('Do MMMM YYYY'))}
							</Text> */}
							<View style={{ width: '100%' }}>
								{/* <Button onPress={()=>{this.setState({showDatePicker: true})}} title="Open Date Picker"></Button> */}
								<Text style={{ marginBottom: -15, marginLeft: 15, color: 'grey' }}>Date</Text>
								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
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
									defaultValue={this.props.navigation.getParam('data').date}
								/>
								<DateTimePickerModal
									isVisible={this.state.showDatePicker && this.state.isIos}
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
											this.setState({ showDatePicker: false, date });
										}}
									/>
								) : null}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}>
									Attendance Number
								</Text>
								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									placeholder='Attendance Number'
									placeholderTextColor='#aaaaaa'
									onChangeText={attendance_num => this.setState({ attendance_num })}
									ref='attendance_num'
									value={this.state.attendance_num}
									underlineColorAndroid='transparent'
									keyboardType='numeric'
									defaultValue={this.props.navigation.getParam('data').attendance_number}
								/>
								{this.showErrorMessage('attendance_num')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}>Names of Members</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									multiline={true}
									placeholder='Names Of Members That Attended'
									placeholderTextColor='#aaaaaa'
									onChangeText={attended_names => this.setState({ attended_names })}
									ref='attended_names'
									value={this.state.attended_names}
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									defaultValue={this.props.navigation.getParam('data').attendance_names}
								/>
								{this.showErrorMessage('attended_names')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}>
									{' '}
									Number of FirstTimers
								</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									placeholder='Number Of First Timers'
									placeholderTextColor='#aaaaaa'
									onChangeText={num_firsttimers => this.setState({ num_firsttimers })}
									ref='num_firsttimers'
									keyboardType='numeric'
									value={this.state.num_firsttimers}
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									defaultValue={this.props.navigation.getParam('data').number_first_timers}
								/>
								{this.showErrorMessage('num_firsttimers')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}>
									{' '}
									Names of FirstTimers
								</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									placeholder='Names Of First Timers'
									placeholderTextColor='#aaaaaa'
									onChangeText={name_firsttimers => this.setState({ name_firsttimers })}
									ref='name_firsttimers'
									value={this.state.name_firsttimers}
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									multiline={true}
									defaultValue={this.props.navigation.getParam('data').names_first_timers}
								/>
								{this.showErrorMessage('name_firsttimers')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}>
									{' '}
									Number of Converts
								</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									placeholder='Number Of New Converts'
									placeholderTextColor='#aaaaaa'
									onChangeText={num_converts => this.setState({ num_converts })}
									ref='num_converts'
									value={this.state.num_converts}
									keyboardType='numeric'
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									defaultValue={this.props.navigation.getParam('data').number_of_converts}
								/>
								{this.showErrorMessage('num_converts')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}>
									{' '}
									Names of Converts
								</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									multiline={true}
									placeholder='Names Of New Converts'
									placeholderTextColor='#aaaaaa'
									onChangeText={name_converts => this.setState({ name_converts })}
									ref='name_converts'
									value={this.state.name_converts}
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									defaultValue={this.props.navigation.getParam('data').names_of_converts}
									multiline={true}
								/>
								{this.showErrorMessage('name_converts')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}> Started NBS</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									placeholder='Started NBS'
									placeholderTextColor='#aaaaaa'
									onChangeText={num_startednbs => this.setState({ num_startednbs })}
									ref='num_startednbs'
									keyboardType='numeric'
									value={this.state.num_startednbs}
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									defaultValue={this.props.navigation.getParam('data').started_nbs}
								/>
								{this.showErrorMessage('num_startednbs')}

								<Text style={{ marginBottom: -15, marginLeft: 15, marginTop: 5, color: 'grey' }}> Finished NBS</Text>

								<TextInput
									style={{ ...styles.input, marginLeft: 15, marginRight: 15 }}
									placeholder='Finished NBS'
									placeholderTextColor='#aaaaaa'
									onChangeText={num_finishednbs => this.setState({ num_finishednbs })}
									ref='num_finishednbs'
									keyboardType='numeric'
									value={this.state.num_finishednbs}
									underlineColorAndroid='transparent'
									autoCapitalize='none'
									defaultValue={this.props.navigation.getParam('data').finished_nbs}
								/>
								{this.showErrorMessage('num_finishednbs')}

								{this.state.showLoading ? (
									<ActivityIndicator />
								) : (
									<TouchableOpacity style={styles.button} onPress={() => this.handleSubmit()}>
										<Text style={{ color: 'white' }}>UPDATE</Text>
									</TouchableOpacity>
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

export default connect(mapStateToProps, { AddAttendance, AddCenterData })(EditDataForm);
