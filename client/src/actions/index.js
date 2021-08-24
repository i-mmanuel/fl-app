import AsyncStorage from '@react-native-async-storage/async-storage';
import serverRequests from '../api/serverRequests';
import { navigate } from '../navigationRef';
import {
	ADD_ERROR_MESSAGE,
	CLEAR_ERROR_MESSAGE,
	SIGN_IN,
	SIGN_UP,
	SIGN_OUT,
	ADD_ATTENDANCE,
	ADD_CENTER_DATA,
	ADD_CENTER_LEADERS,
	ADD_USER_DATA,
	ADD_ALL_CENTER_DATA,
	ADD_USER_DETAILS,
} from './types';

export const tryLocalSignIn = () => {
	return async dispatch => {
		let token = await AsyncStorage.getItem('token');
		let user = await AsyncStorage.getItem('user');
		let details = { token, user: JSON.parse(user) };

		if (token && details) {
			try {
				let response = await serverRequests.post('/signedin', {
					id: details.user._id,
				});

				// await AsyncStorage.setItem('token', response.data.token);
				await AsyncStorage.setItem('user', JSON.stringify(response.data));

				dispatch({
					type: SIGN_IN,
					payload: { ...details, user: response.data },
				});

				if (response.data.membership_type === undefined || response.data.membership_type === null) {
					navigate('pendingVerify');
				} else if (response.data.membership_type === 'Bishop') {
					navigate('bishopFlow');
				} else if (response.data.membership_type === 'Admin') {
					navigate('adminFlow');
				} else if (response.data.membership_type === 'Overseer') {
					navigate('overseerFlow');
				} else if (response.data.membership_type === 'Centre leader') {
					if (response.data.center.includes('Sonta')) {
						navigate('sontaFlow');
					} else {
						navigate('centerFlow');
					}
				} else if (response.data.membership_type === 'Bacenta leader') {
					if (response.data.center.includes('Sonta')) {
						navigate('basontaFlow');
					} else {
						navigate('mainFlow');
					}
				} else {
					navigate('mainFlow');
				}
			} catch (error) {
				// dispatch(addErrorMessage(error));
				// dispatch({ type: SIGN_IN, payload: details });
				console.log(`error from local sign in`, error);
				navigate('SignIn');
			}
		} else {
			navigate('SignIn');
		}
	};
};

export const addErrorMessage = error => {
	return { type: ADD_ERROR_MESSAGE, payload: error };
};

export const clearMessage = () => {
	return dispatch => dispatch({ type: CLEAR_ERROR_MESSAGE, payload: ' ' });
};

export const SignIn = response => {
	return dispatch => {
		dispatch({ type: SIGN_IN, payload: response.data });
	};
};

export const SignUp = response => {
	return dispatch => {
		dispatch({ type: SIGN_UP, payload: response.data });
	};
};

export const SignOut = () => {
	return async dispatch => {
		let user = await AsyncStorage.getItem('user');
		await serverRequests.patch(`/user/edit/${JSON.parse(user)._id}`, { notification_token: '' });

		await AsyncStorage.removeItem('token');

		navigate('SignIn');
		dispatch({ type: SIGN_OUT });
	};
};

export const AddAttendance = data => {
	return dispatch => {
		dispatch({ type: ADD_ATTENDANCE, payload: data });
	};
};

export const AddCenterData = data => {
	return dispatch => {
		dispatch({ type: ADD_CENTER_DATA, payload: data });
	};
};

export const AddAllCenterData = data => {
	return dispatch => {
		dispatch({ type: ADD_ALL_CENTER_DATA, payload: data });
	};
};

export const AddUserData = data => {
	return dispatch => {
		dispatch({ type: ADD_USER_DATA, payload: data });
	};
};

export const AddUserDetails = data => {
	return dispatch => {
		dispatch({ type: ADD_USER_DETAILS, payload: data });
	};
};

export const AddLeadersData = data => {
	return dispatch => {
		dispatch({ type: ADD_CENTER_LEADERS, payload: data });
	};
};
