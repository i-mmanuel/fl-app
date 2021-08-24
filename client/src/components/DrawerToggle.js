import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { withNavigation } from 'react-navigation';

class DrawerToggle extends Component {
	render() {
		return (
			<TouchableOpacity
				onPress={() =>
					this.props.navigation.dispatch(DrawerActions.openDrawer())
				}
			>
				<Image
					style={{ marginTop: 50, marginLeft: 20, width: 40, height: 30 }}
					source={require('../assets/images/menu-icon.png')}
				/>
			</TouchableOpacity>
		);
	}
}

export default withNavigation(DrawerToggle);
