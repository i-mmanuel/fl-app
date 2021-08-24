import moment from 'moment';
import {
	ADD_ALL_CENTER_DATA,
	ADD_ATTENDANCE,
	ADD_CENTER_DATA,
	ADD_CENTER_LEADERS,
	ADD_USER_DETAILS,
	SIGN_OUT,
} from '../actions/types';
const INITIAL_STATE = { userDetails: new Array() };

export default centerReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_ATTENDANCE:
			return { ...state, attendanceData: action.payload };
		case ADD_CENTER_DATA:
			return { ...state, centerData: action.payload };
		case ADD_ALL_CENTER_DATA:
			return { ...state, allCenterData: action.payload };
		case ADD_CENTER_LEADERS:
			return { ...state, leadersData: action.payload };
		case ADD_USER_DETAILS:
			return { ...state, userDetails: action.payload };
		case SIGN_OUT:
			return INITIAL_STATE;
		default:
			return state;
	}
};
