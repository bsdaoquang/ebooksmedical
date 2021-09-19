import React, {useEffect, useState} from 'react'
import { 
	Text, View, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, Alert, TextInput, ToastAndroid
} from 'react-native'

import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import {firebaseApp} from '../firebaseConfig'

export default function SearchScreen({navigation}){
	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: () => (
		      	<View style={{flexDirection: 'row', justifyContents: 'center', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: 5}}>
		      		<AntDesign name="search1" size={20} color="#34495e" />
		      		<TextInput
		      			style={{flex: 1, padding: 5}}
		      			placeholder = 'Tìm Ebooks'
		      			autoCapitalize = 'none'
		      			onChangeText = {key => goSearch(key)}
		      		/>
		      	</View>
	      	),
	    });
  	}, [navigation]);
	//vùng hiển thị sách
	const [keysearch, setKeysearch] = useState('')
	
	function goSearch(key){
		//cài đặt nút tìm kiếm để đổi màn hình
		setKeysearch(key)
		//Chạy hàm tìm kiếm
	}

	function removeAccents(str) {
  		return str.normalize('NFD')
    	.replace(/[\u0300-\u036f]/g, '')
    	.replace(/đ/g, 'd').replace(/Đ/g, 'D');
	}

	var keysq = removeAccents(keysearch).toLowerCase().replace(/ /g, "-")

	function SearchResult(){

		const [loadResult, setLoadResult] = useState(false)

		setTimeout(() => {
			setLoadResult(true)
		}, 1000)

		//bắt đầu tìm kiếm
		var slugBook = []
		var slugTag = []
		var displayName = []

		//lấy về các slug book
		firebaseApp.database().ref('Ebooks').on('value', snap => {
			snap.forEach(item => {
				if (item.val().slug.includes(keysq)) {
					var slugs = {}
					slugs = item.val()
					slugs.key = item.key

					slugBook.push(slugs)
				}
			})
		})

		//lấy về các chuyên mục
		firebaseApp.database().ref('chuyenMuc').on('value', snap => {
			snap.forEach(item => {
				if (item.val().slug.includes(keysq)) {
					var slugs = {}
					slugs = item.val()
					slugs.key = item.key
					slugTag.push(slugs)
				}
			})
		})

		//danh sách người dùng
		firebaseApp.database().ref('Users').on('value', snap => {
			snap.forEach(item => {
				if (item.val().displayName !== undefined) {
					//có một số người không cập nhật tên nên sẽ bị undefined
					var name = removeAccents(item.val().displayName).toLowerCase().replace(/ /g, "-")
					if (name.includes(keysq)) {
						var names = {}
						names = item.val()
						names.key = item.key

						displayName.push(names)
					}
				}	

			})
		})

		const [select, setSelect] = useState('book')
		return(
			<View style={{flex: 1}}>
				<View style={{width: '100%', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'}}>
					<TouchableOpacity
						style={{flex: 1, paddingVertical: 15, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: select === 'book' ? '#3498db' : '#34495e'}}
						onPress={() => setSelect('book')}>
						<Text style={{color: select === 'book' ? '#3498db' : '#34495e'}}><FontAwesome name="book" size={18} color="#34495e" /> Ebook</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{flex: 1,paddingVertical: 15, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: select === 'tags' ? '#3498db' : '#34495e'}}
						onPress={() => setSelect('tags')}>
						<Text style={{color: select === 'tags' ? '#3498db' : '#34495e'}}><Ionicons name="md-pricetags" size={18} color="#34495e" /> Chuyên mục</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{flex: 1, paddingVertical: 15, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: select === 'user' ? '#3498db' : '#34495e'}}
						onPress={() => setSelect('user')}>
						<Text  style={{color: select === 'user' ? '#3498db' : '#34495e'}} ><FontAwesome name="user-circle-o" size={18} color="#34495e" /> Kênh</Text>
					</TouchableOpacity>
				</View>
				<View style={{backgroundColor: '#fff'}}>
					{
						select === 'book' ?
						<FlatList style={styles.containerBook}
				  			data={slugBook} 
				  			renderItem={({ item }) => (
					            <View style={{...styles.bookContain, marginVertical: 8}}>
					                <TouchableOpacity
					                	style={{flexDirection: 'row'}}
					                   	onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title:item.title})}>
						            	<Image style={{width: 75, height: 95, marginRight: 8, borderRadius: 3}} source={{uri: item.image}}/>
						            	<View style={{flex: 1}}>
						            		<Text style={{fontWeight: 'bold', width: '100%'}}>{item.title}</Text>
						              		<Text>{item.author}</Text>
						            	</View>
					                </TouchableOpacity>
					            </View>
					        )}
				  	 		keyExtractor={item => item.key}
			  	 		/>
						: select === 'tags' ?
						<FlatList style={styles.containerBook}
							data={slugTag} 
							renderItem={({ item }) => (
								<TouchableOpacity style={styles.catList} onPress={() => navigation.navigate('Chuyên mục', {title: item.title, id: item.key})}>
									<AntDesign name="tags" size={24} color="#34495e" style={{marginRight: 15}}/>
									<Text>{item.title}</Text>
								</TouchableOpacity>
							)}
				  			//inverted={true}
				  			keyExtractor={item => item.key}
				  		/>
						:
						<FlatList style={styles.containerBook}
							data={displayName} 
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => navigation.navigate('Thành viên', {name: item.displayName, key: item.key})}
									style={{...styles.catList, alignItems: 'center'}}>
									<Image style={{width: 30, height: 30, borderRadius: 50, marginRight: 10}} source={{uri: item.photoURL}}/>
									<Text>{item.displayName}</Text>
								</TouchableOpacity>
							)}
				  			//inverted={true}
				  			keyExtractor={item => item.key}
				  		/>
					}
				</View>				
			</View>
		)
	}

	function TopSearch(){
		var keyTop = []
		firebaseApp.database().ref('searchKey').orderByChild('count').limitToLast(20).on('value', snap => {
			snap.forEach(item => {
				var keys = {}

				keys = item.val()
				keys.key = item.key

				keyTop.unshift(keys)
			})
		})

		const [load, setLoad] = useState(false)
		setTimeout(() => {
			setLoad(true)
		}, 1000)

		return(
			<View style={{flex: 1, padding: 20}}>
				<Text style={{fontStyle: 'italic'}}>Mọi người cũng tìm: </Text>
				<FlatList 
					style = {{flex: 1, marginTop: 20}}
					data={keyTop} 
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => goSearch(item.keyword)}
							style={{paddingVertical: 15, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
							<AntDesign name="search1" size={20} color="#34495e" />
							<Text style={{flex: 1, paddingHorizontal: 20}}>{item.keyword} <Text style={{fontStyle: 'italic', color: '#3498db'}}>{item.count}</Text></Text>
							<FontAwesome name="angle-right" size={24} color="#34495e" />
						</TouchableOpacity>
					)}
		  			//inverted={true}
		  			keyExtractor={item => item.key}
		  		/>
			</View>
		)
	}

	return(
		<View style={styles.container}>
			{
				keysearch === '' ?
				<TopSearch />
				:
				<SearchResult />
			}
		</View>
	)
}



const styles = StyleSheet.create({

	container:{
		flex: 1,
	},

	containerBook:{
		padding: 8,
	},

	catList:{
		paddingVertical: 15,
		marginHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		flexDirection: 'row'
	},
})