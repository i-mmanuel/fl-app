import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import _ from 'lodash';
import styles from '../../styles/style';

class LeaderDataView extends Component {
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
				</Animatable.View>

				{/* GO TO LINE 11 IF YOU HAVEN'T SEEN IT ALREADY! */}
				<Animatable.View animation='fadeInDown' duration={1000}>
					<Card
						containerStyle={{
							...styles.card,
							height: 800,
							marginTop: -50,
							marginBottom: 20,
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								fontWeight: 'bold',
								marginVertical: 15,
								fontSize: 18,
							}}
						>
							Data Submitted For {moment(this.returnDetails('date')).format('Do MMMM YYYY')}
						</Text>
						<Text
							style={{
								textAlign: 'center',
								fontStyle: 'italic',
								marginBottom: 10,
								fontSize: 12,
							}}
						>
							Submitted on {moment(this.returnDetails('createdAt')).format('LLLL')}
						</Text>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NUMBER OF MEMBERS WHO ATTTENDED:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>{this.returnDetails('attendance_number')}</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NAMES OF MEMBERS WHO ATTENDED:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').attendance_names}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NUMBER OF FIRST TIMERS:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').number_first_timers}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NAMES OF FIRST TIMERS:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').names_first_timers}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NUMBER OF CONVERTS:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').number_of_converts}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NAMES OF CONVERTS:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').names_of_converts}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NUMBER OF MEMBERS WHO STARTED NBS:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').started_nbs}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={{ color: 'grey', marginVertical: 10 }}>NUMBER OF MEMBERS WHO FINISHED NBS:</Text>
						</View>
						<View>
							<Text style={{ color: 'black', marginVertical: 10 }}>
								{this.props.navigation.getParam('item').finished_nbs}
							</Text>
						</View>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
}

export default LeaderDataView;
