//lắng nghe từ alert
//gửi thông báo mỗi lần có thông báo mới
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

import {firebaseApp} from '../firebaseConfig'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default function NotificationScreen() {
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response);
		});

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	return (
		<View>
		
		</View>
		);
	}

var alert = {}

firebaseApp.database().ref('Users').child('wbquswyP16TPO4xEBAu36P1d5P13').child('alerts').on('value', snap => {
	snap.forEach(item => {
		if (item.val().read === false) {
			alert = item.val()
		}
	})
})

if (alert !== {}) {
	schedulePushNotification()
}

async function schedulePushNotification() {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: alert.title,
			body: alert.content,
			data: { data: 'goes here' },
		},
		trigger: { seconds: 2 },
	});
}

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
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
