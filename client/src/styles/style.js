import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	title: {},
	logo: {
		flex: 1,
		height: 100,
		width: 160,
		alignSelf: 'center',
		margin: 30,
	},
	input: {
		height: 48,
		fontFamily: 'Avenir',
		overflow: 'hidden',
		borderBottomColor: '#808080',
		borderBottomWidth: 1,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 15,
		paddingLeft: 16,
	},
	image: {
		width: 200,
		height: 200,
		alignSelf: 'center',
	},

	homePageImage: {
		width: 200,
		height: 100,
		marginBottom: 30,
		alignSelf: 'center',
	},
	card: {
		height: 150,
		marginLeft: 16,
		borderRadius: 10,
		shadowColor: '#d3d3d3',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
	},
	smallerCard: {
		height: 180,
		marginLeft: 16,
		borderRadius: 10,
		shadowColor: '#d3d3d3',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
	},
	button: {
		marginLeft: 30,
		marginRight: 30,
		marginTop: 25,
		height: 40,
		borderRadius: 5,
		width: 300,
		alignSelf: 'center',
		backgroundColor: '#9d0d0e',
		fontFamily: 'Avenir',
		alignItems: 'center',
		justifyContent: 'center',
	},

	flashErrorMessage: {
		fontFamily: 'Avenir',
		color: 'red',
		textAlign: 'center',
		marginTop: 10,
		fontSize: 15,
	},
	errorMessage: {
		backgroundColor: 'red',
		marginLeft: 30,
		marginRight: 30,
		marginTop: 20,
		color: '#ffffff',
		height: 48,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		fontFamily: 'Avenir',
	},
	footerView: {
		flex: 1,
		alignItems: 'center',
		marginTop: 20,
		flexDirection: 'row',
		alignSelf: 'center',
		height: 40,
	},
	footerText: {
		fontSize: 12,
		fontFamily: 'Avenir',
		textDecorationLine: 'underline',
	},
	footerLink: {
		fontFamily: 'Avenir',
		color: '#788eec',
		fontWeight: 'bold',
		fontSize: 12,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#dcdcdc',
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		padding: 5,
		justifyContent: 'space-between',
	},
});
