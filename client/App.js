import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
// import { Navigation } from "react-navigation";
import SignInScreen from './src/screens/authentication/Signin';
// import SignOutScreen from './src/screens/authentication/Signout';
import SignUpScreen from './src/screens/authentication/Signup';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import reducers from './src/reducers';
import Homepage from './src/screens/HomePage';
import { setNavigator } from './src/navigationRef';
import ResolveAuthScreen from './src/screens/authentication/ResolveAuthScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MapScreen from './src/screens/Map';
import PasswordResetScreen from './src/screens/authentication/PasswordReset';
import ProfileScreen from './src/screens/profile';
import NewDataFormScreen from './src/screens/data/NewDataForm';
import EditDataFormScreen from './src/screens/data/EditDataForm';
import AllDataViewScreen from './src/screens/data/AllDataView';
import CenterHomeScreen from './src/screens/center/CenterHome';
import AllCenterDataScreen from './src/screens/center/AllCenterData';
import ViewDataScreen from './src/screens/data/ViewData';
import ViewLeaderDataScreen from './src/screens/center/ViewLeaderData';
import DataHistoryScreen from './src/screens/center/DataHistory';
import ViewLeaderHistoryDataScreen from './src/screens/center/ViewLeaderHistoryData';
import AllLeadersScreen from './src/screens/center/AllLeaders';
import AllLeaderDataScreen from './src/screens/center/AllLeaderData';
import LeaderDataViewScreen from './src/screens/center/LeaderDateView';
import PendingVerificationScreen from './src/screens/authentication/PendingVerification';
import adminPageScreen from './src/screens/admin/adminPage';
import OverseerHome from './src/screens/overseer/OverseerHome';
import CentersData from './src/screens/overseer/CentersData';
import CentresDataHistory from './src/screens/overseer/CentresDataHistory';
import ConstituencyDataHistoryScreen from './src/screens/overseer/ConstituencyDataHistory';
import SingleCentreViewScreen from './src/screens/overseer/SingleCentreView';
import BishopHome from './src/screens/bishop/BishopHome';
import BishopConstituencies from './src/screens/bishop/BishopConstituencies';
import BishopSontas from './src/screens/bishop/BishopSontas';
import BishopData from './src/screens/bishop/BishopData';
import SingleBishopData from './src/screens/bishop/SingleBishopData';
import SontaDataSubmit from './src/screens/basonta/SontaDataSubmit';
import AllSontaData from './src/screens/basonta/AllSontaData';
import SontaEditData from './src/screens/basonta/SontaEditData';
import SingleSontaData from './src/screens/basonta/SingleSontaData';
import SontaHome from './src/screens/sontas/SontaHome';
import BasontaHome from './src/screens/basonta/BasontaHome';
import AllSontaLeaders from './src/screens/sontas/AllSontaLeaders';
import AllSontaLeaderData from './src/screens/sontas/AllSontaLeaderData';
import FullSontaData from './src/screens/sontas/FullSontaData';
import ViewSontaLeaderData from './src/screens/sontas/ViewSontaLeaderData';
import SontaDataHistory from './src/screens/sontas/SontaDataHistory';
import ViewSontaLeaderDataHistory from './src/screens/sontas/ViewSontaLeaderDataHistory';
import SontasDataHistory from './src/screens/overseer/SontasDataHistory';
// import WatchPageScreen from './src/screens/watch-party/WatchPage';

const SomeElement = () => {
	return false;
};

const loginFlow = createStackNavigator(
	{
		ResolveAuthScreen: { screen: ResolveAuthScreen },
		SignIn: { screen: SignInScreen },
		SignUp: { screen: SignUpScreen },
		PasswordReset: { screen: PasswordResetScreen },
	},
	{
		initialRouteName: 'ResolveAuthScreen',
	}
);

const profileFlow = createStackNavigator({
	Profile: {
		screen: ProfileScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const adminFlow = createStackNavigator({
	AdminHome: {
		screen: adminPageScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
		},
	},
});

const bishopFlow = createStackNavigator({
	BishopHome: {
		screen: BishopHome,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	BishopConstituencies: {
		screen: BishopConstituencies,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
		screen: BishopConstituencies,
	},
	BishopSontas: {
		screen: BishopSontas,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	BishopData: {
		screen: BishopData,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SingleBishopData: {
		screen: SingleBishopData,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	CentreView: {
		screen: CenterHomeScreen,
		navigationOptions: { headerTitle: () => <SomeElement />, headerTransparent: true, headerTintColor: 'white' },
	},
	AllCenterData: {
		screen: AllCenterDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllLeaders: {
		screen: AllLeadersScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewLeaderData: {
		screen: ViewLeaderDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	DataHistory: {
		screen: DataHistoryScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewLeaderHistoryData: {
		screen: ViewLeaderHistoryDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllLeaderData: {
		screen: AllLeaderDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	LeaderDateView: {
		screen: LeaderDataViewScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const overseerFlow = createStackNavigator({
	OverseerHome: { screen: OverseerHome, navigationOptions: { headerShown: false } },
	CentersData: {
		screen: CentersData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	CentersDataHistory: {
		screen: CentresDataHistory,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SontasDataHistory: {
		screen: SontasDataHistory,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	FullSontaData: {
		screen: FullSontaData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ConstituencyDataHistory: {
		screen: ConstituencyDataHistoryScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SingleCentreView: {
		screen: SingleCentreViewScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SontaView: {
		screen: SontaHome,
		navigationOptions: { headerTitle: () => <SomeElement />, headerTransparent: true, headerTintColor: 'white' },
	},
	CentreView: {
		screen: CenterHomeScreen,
		navigationOptions: { headerTitle: () => <SomeElement />, headerTransparent: true, headerTintColor: 'white' },
	},
	AllCenterData: {
		screen: AllCenterDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllLeaders: {
		screen: AllLeadersScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewLeaderData: {
		screen: ViewLeaderDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	DataHistory: {
		screen: DataHistoryScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewLeaderHistoryData: {
		screen: ViewLeaderHistoryDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllLeaderData: {
		screen: AllLeaderDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	LeaderDateView: {
		screen: LeaderDataViewScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const homePageFlow = createStackNavigator({
	Home: { screen: Homepage, navigationOptions: { headerShown: false } },
	NewDataForm: {
		screen: NewDataFormScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	EditDataForm: {
		screen: EditDataFormScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllDataView: {
		screen: AllDataViewScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewData: {
		screen: ViewDataScreen,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const centerFlow = createStackNavigator({
	Center: {
		screen: CenterHomeScreen,
		navigationOptions: { headerShown: false },
	},
	AllCenterData: {
		screen: AllCenterDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllLeaders: {
		screen: AllLeadersScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewLeaderData: {
		screen: ViewLeaderDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	DataHistory: {
		screen: DataHistoryScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewLeaderHistoryData: {
		screen: ViewLeaderHistoryDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllLeaderData: {
		screen: AllLeaderDataScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	LeaderDateView: {
		screen: LeaderDataViewScreen,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const sontaFlow = createStackNavigator({
	SontaHome: { screen: SontaHome, navigationOptions: { headerShown: false } },
	SontaDataSubmit: {
		screen: SontaDataSubmit,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllSontaData: {
		screen: AllSontaData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SontaEditData: {
		screen: SontaEditData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SingleSontaData: {
		screen: SingleSontaData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllSontaLeaders: {
		screen: AllSontaLeaders,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	BasontaHome: {
		screen: BasontaHome,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllSontaLeaderData: {
		screen: AllSontaLeaderData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	FullSontaData: {
		screen: FullSontaData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewSontaLeaderData: {
		screen: ViewSontaLeaderData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SontaDataHistory: {
		screen: SontaDataHistory,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	ViewSontaLeaderDataHistory: {
		screen: ViewSontaLeaderDataHistory,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	Basonta: {
		screen: BasontaHome,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const basontaFlow = createStackNavigator({
	Home: { screen: BasontaHome, navigationOptions: { headerShown: false } },
	SontaDataSubmit: {
		screen: SontaDataSubmit,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SontaEditData: {
		screen: SontaEditData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	AllSontaData: {
		screen: AllSontaData,
		navigationOptions: {
			headerTitle: () => <SomeElement />,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
	SingleSontaData: {
		screen: SingleSontaData,
		navigationOptions: {
			headerTitle: () => false,
			headerTransparent: true,
			headerTintColor: 'white',
		},
	},
});

const switchNavigator = createSwitchNavigator({
	loginFlow: loginFlow,
	pendingVerify: { screen: PendingVerificationScreen },
	mainFlow: createDrawerNavigator(
		{
			HOME: homePageFlow,
			// Map: MapScreen,
			// Watch: WatchPageScreen,
			// Signout: SignOutScreen,
			PROFILE: profileFlow,
		},
		{
			contentOptions: {
				activeTintColor: 'red',
				itemsContainerStyle: {
					marginVertical: 20,
				},
			},
		}
	),
	basontaFlow: createDrawerNavigator(
		{
			HOME: basontaFlow,
			// Map: MapScreen,
			// Watch: WatchPageScreen,
			// Signout: SignOutScreen,
			PROFILE: profileFlow,
		},
		{
			contentOptions: {
				activeTintColor: 'red',
				itemsContainerStyle: {
					marginVertical: 20,
				},
			},
		}
	),
	adminFlow: adminFlow,
	bishopFlow: createDrawerNavigator(
		{
			HOME: bishopFlow,
			PROFILE: profileFlow,
		},
		{
			contentOptions: {
				activeTintColor: 'red',
				itemsContainerStyle: {
					marginVertical: 20,
				},
			},
		}
	),
	sontaFlow: createDrawerNavigator(
		{
			SONTA: sontaFlow,
			BASONTA: basontaFlow,
			PROFILE: profileFlow,
		},
		{
			contentOptions: {
				activeTintColor: 'red',
				itemsContainerStyle: {
					marginVertical: 20,
				},
			},
		}
	),
	overseerFlow: createDrawerNavigator(
		{
			OVERSEER: overseerFlow,
			// SONTA: sontaFlow,
			PROFILE: profileFlow,
		},
		{
			contentOptions: {
				activeTintColor: 'red',
				itemsContainerStyle: {
					marginVertical: 20,
				},
			},
		}
	),
	centerFlow: createDrawerNavigator(
		{
			CENTRE: centerFlow,
			BACENTA: homePageFlow,
			PROFILE: profileFlow,
		},
		{
			contentOptions: {
				activeTintColor: 'red',
				itemsContainerStyle: {
					marginVertical: 20,
				},
			},
		}
	),
});

const App = createAppContainer(switchNavigator);

export default () => {
	return (
		<Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
			<App ref={navigator => setNavigator(navigator)} />
		</Provider>
	);
};
