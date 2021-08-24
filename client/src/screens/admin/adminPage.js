import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../../styles/style';
import { connect } from 'react-redux';
import { AddCenterData, AddLeadersData } from '../../actions';

class AdminPage extends Component {
	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 500, paddingTop: 100 }}
					animation='fadeIn'
					duration={1000}
					delay={150}
				>
					<Image style={[styles.homePageImage]} source={require('../../assets/images/whitelogowithoutchurch.png')} />
				</Animatable.View>

				<Animatable.View animation='fadeInDown' duration={1200}>
					<Card containerStyle={{ ...styles.card, height: 300, marginTop: -150 }}>
						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: 50,
								backgroundColor: '#9d0d0e',
							}}
							onPress={() => this.props.navigation.navigate('centerFlow')}
						>
							<Text style={{ ...styles.buttonTitle }}>CENTRE FLOW</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								...styles.errorMessage,
								marginTop: 50,
								backgroundColor: '#9d0d0e',
							}}
							onPress={() => this.props.navigation.navigate('overseerFlow')}
						>
							<Text style={{ ...styles.buttonTitle }}>OVERSEER FLOW</Text>
						</TouchableOpacity>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return { auth: state.auth, center: state.center };
};

export default connect(mapStateToProps, { AddCenterData, AddLeadersData })(AdminPage);
