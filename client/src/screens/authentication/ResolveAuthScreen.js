import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { tryLocalSignIn } from '../../actions';
import { Image, Text, View } from 'react-native';
// https://github.com/oblador/react-native-animatable
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

const ResolveAuthScreen = props => {
	useEffect(() => {
		axios
			.get('https://fl-app-v1.herokuapp.com/')
			.then(function (response) {
				// handle success
				// console.log(response);
				return;
			})
			.catch(function (error) {
				// handle error
				// console.log(error);
				return;
			});

		setTimeout(() => {
			props.tryLocalSignIn();
		}, 3000);
	}, []);

	return (
		<View
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
				Hello! First Lover
			</Text>
			<Animatable.View animation='pulse' iterationCount='infinite' direction='normal'>
				<Image
					style={{ width: 200, height: 200, alignSelf: 'center' }}
					source={require('../../assets/images/redlogo.png')}
				/>
			</Animatable.View>
		</View>
	);
};

ResolveAuthScreen['navigationOptions'] = screenProps => ({
	headerShown: false,
});

export default connect(null, { tryLocalSignIn })(ResolveAuthScreen);
