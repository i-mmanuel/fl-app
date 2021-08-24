import { combineReducers } from 'redux';
import authReducer from './authReducer';
import centerReducer from './centerReducer';

export default combineReducers({
	auth: authReducer,
	center: centerReducer,
});
