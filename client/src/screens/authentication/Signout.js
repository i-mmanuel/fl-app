import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from '../../styles/style';
import { clearMessage, SignOut } from '../../actions';
import DrawerToggle from '../../components/DrawerToggle';

const Signout = props => {
	return (
		<View
			style={{
				justifyContent: 'center',
				flex: 1,
			}}
		>
			<TouchableOpacity style={styles.errorMessage} onPress={props.SignOut}>
				<Text style={styles.buttonTitle}>SIGN OUT</Text>
			</TouchableOpacity>
			<DrawerToggle />
		</View>
	);
};

Signout['navigationOptions'] = screenProps => ({
	title: 'Sign Out',
	headerTintColor: '#fff',
	headerStyle: {
		backgroundColor: '#9f0606',
	},
});

export default connect(null, { SignOut, clearMessage })(Signout);
