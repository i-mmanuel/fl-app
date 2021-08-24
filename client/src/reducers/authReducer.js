import {
	ADD_ERROR_MESSAGE,
	ADD_USER_DATA,
	CLEAR_ERROR_MESSAGE,
	SIGN_IN,
	SIGN_OUT,
	SIGN_UP,
} from '../actions/types';

const INITIAL_STATE = {};

export default authReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SIGN_IN:
			return {
				...state,
				token: action.payload.token,
				user: action.payload.user,
				errorMessage: '',
			};

		case SIGN_UP:
			return {
				...state,
				token: action.payload.token,
				user: action.payload.user,
				errorMessage: '',
			};

		case SIGN_OUT:
			return INITIAL_STATE;

		case CLEAR_ERROR_MESSAGE:
			return { ...state, errorMessage: null };

		case ADD_ERROR_MESSAGE:
			return { ...state, errorMessage: action.payload };

		case ADD_USER_DATA:
			return { ...state, user: action.payload };
		default:
			return state;
	}
};
