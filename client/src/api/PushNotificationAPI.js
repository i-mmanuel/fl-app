import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { navigate } from '../navigationRef';
import serverRequests from './serverRequests';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

function PushNotificationAPI(props) {
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
		});

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			navigate('NewDataForm');
		});

		(async function () {
			// await sendPushNotification(expoPushToken);
		})();

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	return null;
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
// async function sendPushNotification(expoPushToken) {
// 	const message = {
// 		to: expoPushToken,
// 		sound: 'default',
// 		title: 'Original Title',
// 		body: 'And here is the body!',
// 		data: { someData: 'goes here' },
// 	};

// 	await fetch('https://exp.host/--/api/v2/push/send', {
// 		method: 'POST',
// 		headers: {
// 			Accept: 'application/json',
// 			'Accept-encoding': 'gzip, deflate',
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify(message),
// 	});
// }

let userID;

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		alert('Must use physical device for Push Notifications');
	}

	if (token) {
		try {
			await serverRequests.patch(`/user/edit/${userID}`, { notification_token: token });
		} catch (error) {
			console.log(`Error setting token in PushNotification`, error);
		}
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return token;
}

const mapStateToProps = state => {
	userID = state.auth.user._id;
	return { auth: state.auth };
};

export default connect(mapStateToProps, null)(PushNotificationAPI);
