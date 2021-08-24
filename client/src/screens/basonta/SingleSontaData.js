import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import _ from 'lodash';
import styles from '../../styles/style';

class SingleSontaData extends Component {
	returnDetails = params => this.props.navigation.getParam('item')[params];

	render() {
		return (
			<ScrollView showsVerticalScrollIndicator={false}>
				<Animatable.View
					style={{ backgroundColor: '#9d0d0e', height: 280 }}
					animation='fadeIn'
					duration={1500}
					delay={150}
				>
					<Image
						style={[styles.homePageImage, { marginTop: 80 }]}
						source={require('../../assets/images/whitelogowithoutchurch.png')}
					/>

					{/* GO TO LINE 11 IF YOU HAVEN'T SEEN IT ALREADY! */}
					<Animatable.View animation='fadeInDown' duration={1000}>
						<Card containerStyle={{ ...styles.card, height: 650, marginBottom: 50 }}>
							<Text
								style={{
									textAlign: 'center',
									borderColor: '#dcdcdc',
									borderBottomWidth: 1,
									fontWeight: 'bold',
									fontSize: 16,
									marginVertical: 10,
								}}
							>
								Data Submitted For {moment(this.returnDetails('date')).format('Do MMMM YYYY')}
							</Text>
							<Text
								style={{
									textAlign: 'center',
									borderColor: '#dcdcdc',
									borderBottomWidth: 1,
									fontSize: 12,
									fontStyle: 'italic',
									marginBottom: 10,
								}}
							>
								Data Submitted on {moment(this.returnDetails('createdAt')).format('dddd, ll')}
							</Text>

							<ScrollView style={{ height: 730 }} showsVerticalScrollIndicator={false}>
								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>NUMBER OF MEMBERS WHO ATTTENDED:</Text>
								</View>
								<View>
									<Text style={{ marginVertical: 10 }}>{this.returnDetails('attendance_number')}</Text>
								</View>

								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>NAMES OF MEMBERS WHO ATTENDED:</Text>
								</View>
								<View>
									<Text style={{ marginVertical: 10 }}>{this.props.navigation.getParam('item').attendance_names}</Text>
								</View>

								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>NUMBER OF MEMBERS WHO REHEARSED:</Text>
								</View>
								<View>
									<Text style={{ marginVertical: 10 }}>{this.props.navigation.getParam('item').rehearsed_number}</Text>
								</View>

								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>NAMES OF MEMBERS WHO REHEARSED:</Text>
								</View>
								<View>
									<Text style={{ marginVertical: 10 }}>{this.props.navigation.getParam('item').rehearsed_names}</Text>
								</View>

								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>NUMBER OF MEMBERS WHO MINISTERED:</Text>
								</View>
								<View>
									<Text style={{ marginVertical: 10 }}>{this.props.navigation.getParam('item').ministered_number}</Text>
								</View>

								<View style={styles.row}>
									<Text style={{ marginVertical: 10, fontWeight: 'bold' }}>NAMES OF MEMBERS WHO MINISTERED:</Text>
								</View>
								<View>
									<Text style={{ marginVertical: 10 }}>{this.props.navigation.getParam('item').ministered_names}</Text>
								</View>
							</ScrollView>
						</Card>
					</Animatable.View>
				</Animatable.View>
			</ScrollView>
		);
	}
}

export default SingleSontaData;
