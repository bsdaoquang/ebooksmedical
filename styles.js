import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
	container:{
		flex: 1,
		padding: 10,
		backgroundColor: '#fafafa'
	},

	itemContainer:{
		flex: 1,
		marginBottom: 5,
		borderBottomColor: '#e0e0e0',
		borderBottomWidth: 1,
		paddingVertical: 8
	},

	itemImage:{
		flex: 1,
		width: '100%',
		height: 200
	},

	countText:{
		fontSize: 14,
		color: 'white'
	},

	buttonContainer:{
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 10,
		justifyContent: 'space-around',
		backgroundColor: '#34495e',
		opacity: 0.8
	}
}) 