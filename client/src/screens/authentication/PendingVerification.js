import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SignOut, tryLocalSignIn } from '../../actions';
import serverRequests from '../../api/serverRequests';
import styles from '../../styles/style';

class PendingVerifacation extends Component {
	fetchData = () => {
		return setInterval(() => {
			console.log('pending verfication');
			this.props.tryLocalSignIn();
		}, 5000);
	};

	componentDidMount() {
		this.timer = this.fetchData();
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	showDialog = () => {
		Alert.alert('SIGN OUT', 'Are you sure you want to sign out?', [
			{
				text: 'NO',
				onPress: () => false,
				style: 'cancel',
			},
			{ text: 'YES', onPress: () => this.props.SignOut() },
		]);
	};

	render() {
		return (
			<Animatable.View
				delay={500}
				animation='fadeIn'
				style={{
					flex: 1,
					justifyContent: 'center',
				}}
			>
				<Text
					style={{
						fontSize: 40,
						textAlign: 'center',
						fontFamily: 'Avenir',
					}}
				>
					Please wait for verification
				</Text>
				<Animatable.View animation='pulse' iterationCount='infinite' direction='normal'>
					<Image
						style={{ width: 200, height: 200, alignSelf: 'center' }}
						source={require('../../assets/images/redlogo.png')}
					/>
				</Animatable.View>
				<TouchableOpacity style={styles.errorMessage} onPress={this.showDialog}>
					<Text style={styles.buttonTitle}>SIGN OUT</Text>
				</TouchableOpacity>
			</Animatable.View>
		);
	}
}

const mapStateToProps = ({ auth }) => {
	return { auth };
};

PendingVerifacation['navigationOptions'] = screenProps => ({
	headerShown: false,
});

export default connect(mapStateToProps, { tryLocalSignIn, SignOut })(PendingVerifacation);
