import React, {useState} from 'react'
import {
	View, Text, TouchableOpacity, TextInput, StyleSheet
} from 'react-native'
import {firebaseApp} from '../firebaseConfig'

export default function ManagerScreen({navigation}){

	const [user, setUser] = useState(0)
	const [book, setBook] = useState(0)
	const [vip, setVip] = useState(0)
	const [down, setDown] = useState(0)

	const [userData, setUserData] = useState([])

	//Lấy số lượng người dùng
	var countUser = 0
	var countVip = 0
	firebaseApp.database().ref('Users').once('value', snapuser => {
		snapuser.forEach(itemuser => {
			countUser += 1

			if (itemuser.val().medCoin !== 0) {
				countVip += 1
			}

			var userDetail = {}
			userDetail = itemuser.val()
			userDetail.key = itemuser.key

			userData.push(userDetail)
		})

		setUser(countUser)
		setVip(countVip)
	})

	//Lấy số lượng sách
	var countBook = 0
	var countDown = 0
	firebaseApp.database().ref('Ebooks').once('value', snapbook => {
		snapbook.forEach(itembook => {
			countBook += 1
			countDown += itembook.val().countDown
		})

		setBook(countBook)
		setDown(countDown)
	})

	return(
		<View style={{padding: 10, backgroundColor: '#fafafa', flex: 1}}>
			<View style={styles.content}>
				<TouchableOpacity style={styles.item}
					onPress={() => navigation.navigate('Danh sách người dùng', {data: userData})}>
					<Text>Tổng số người dùng</Text>
					<Text style={styles.text}>{user}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.item}>
					<Text>Người dùng VIP</Text>
					<Text style={styles.text}>{vip}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.item}>
					<Text>Tổng số sách</Text>
					<Text style={styles.text}>{book}</Text>
				</TouchableOpacity>

				<View style={styles.item}>
					<Text>Tổng lượt tải</Text>
					<Text style={styles.text}>{down}</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	content:{
		padding: 8,
	},

	title: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
		color: '#676767',
		marginBottom: 10
	},

	item:{
		flexDirection: 'row',
		paddingVertical: 8,
		borderBottomColor: "#e0e0e0",
		borderBottomWidth: 1
	},

	text:{
		flex: 1,
		textAlign: 'right',
		fontWeight: 'bold'
	}
})