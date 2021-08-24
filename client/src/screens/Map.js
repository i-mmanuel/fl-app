import React, { Component } from 'react';
import { Text } from 'react-native';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import styles from '../styles/style';

const churches = [
	{
		title: 'Peckham Church',
		latlng: { latitude: 37.3369, longitude: -122.0123 },
		description: 'Meets in Aparche',
	},
	{
		title: 'Stratford Church',
		latlng: { latitude: 37.332904, longitude: -122.012666 },
		description: 'Meets at the stadium',
	},
	{
		title: 'Greenwich Church',
		latlng: { latitude: 37.330874, longitude: -122.007456 },
		description: 'Meets at the O2',
	},
	{
		title: 'Stratford City Church',
		latlng: { latitude: 37.328606, longitude: -122.006625 },
		description: 'Meets at the Copper Box',
	},
	{
		title: 'Brixton Church',
		latlng: { latitude: 37.332835, longitude: -122.005354 },
		description: 'Meets at the O2 Brixton',
	},
];

class Map extends Component {
	emailConfirmed = () => {
		return this.props.auth.user.email_confirmed ? (
			<MapView
				style={styles.container}
				showsUserLocation={true}
				// showsMyLocationButton={true}
				followsUserLocation={true}
				initialRegion={{
					...churches[0].latlng,
					longitudeDelta: 0.01,
					latitudeDelta: 0.01,
				}}
			>
				{churches.map((marker, index) => (
					<Marker
						key={index}
						coordinate={marker.latlng}
						title={marker.title}
						description={marker.description}
					/>
				))}
				<Marker coordinate={{ latitude: 37.3349, longitude: -122.00902 }} />
			</MapView>
		) : (
			<View style={{ ...styles.container, flex: 1, justifyContent: 'center' }}>
				<Text>CHECK EMAIL AND CONFIRM!</Text>
				<Text>
					Hi there. You need to comfirm your email to be able to view this page.
				</Text>
			</View>
		);
	};

	render() {
		return this.emailConfirmed();
	}
}

const mapStateToProps = state => {
	return { auth: state.auth };
};

export default connect(mapStateToProps, null)(Map);
