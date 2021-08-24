import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import NumberTicker from 'react-native-number-ticker';
import * as Animatable from 'react-native-animatable';

class AnimatedNumber extends Component {
	render() {
		return (
			<View
				style={{
					marginHorizontal: 12,
				}}
				animation='fadeInDown'
				delay={250}
				duration={1000}
			>
				<Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>{this.props.title}</Text>
				<NumberTicker
					number={this.props.number}
					textSize={30}
					duration={2000}
					textStyle={{
						color: 'red',
						padding: 0,
						height: 30,
						fontWeight: '450',
					}}
				/>
			</View>
		);
	}
}

export default AnimatedNumber;
