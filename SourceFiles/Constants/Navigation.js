import React from 'react';
//Navigation Libraries
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createSwitchNavigator} from '@react-navigation/compat';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//Constants
import {navigationRef, isReadyRef} from './NavigationService';
//Initial Flow Files
import Tutorial from '../InitialFlow/Tutorial';
import AutoLogin from '../InitialFlow/AutoLogin';
import Login from '../InitialFlow/Login';
import RegisterName from '../InitialFlow/RegisterName';
import RegisterMobile from '../InitialFlow/RegisterMobile';
import RegisterEmail from '../InitialFlow/RegisterEmail';
import RegisterProfilePic from '../InitialFlow/RegisterProfilePic';
import RegisterBio from '../InitialFlow/RegisterBio';
import Congratulation from '../InitialFlow/Congratulation';
import ForgotPassword from '../screens/forgot/index';
import ForgotMail from '../screens/forgot/mail/index';
import RecoverPassword from '../screens/forgot/recover/index';

//Dashborad Flow Files
import Nearby from '../DashboardFlow/Nearby';
import UserProfile from '../screens/user-profile';

import JobDetail from '../DashboardFlow/JobDetail';
import ChoosePassword from '../screens/choose-password';
import OwnProducts from '../screens/own-products';
import ScanCard from '../screens/own-products/scan-card';
import ActivatedCard from '../screens/own-products/activated-card';
import Contacts from '../screens/messages/contacts';
import BottomTab from '../common/bottom-tab';
import Profile from '../screens/profile';
import Pro from '../screens/pro';
import Messages from '../screens/messages/chat';
import EditProfile from '../screens/profile/edit';
import Settings from '../screens/settings';
import ChangePasswordSettings from '../screens/settings/change-password';
import HelpAndTutorials from '../screens/settings/help-and-tutorials';
import ScanTag from '../screens/own-products/scan-card/tag';
import Payment from '../screens/payments';
import Success from '../screens/success';
import ProfileAnalytics from '../screens/pro/analytics';
import UserMap from '../screens/pro/usermap';
import AnalyticsView from '../screens/pro/analytic-view';
import messaging from '@react-native-firebase/messaging';
import {onDisplayNotification} from '../utils/mobile-utils';
import Splash from '../screens/splash';
import AddFamilyMember from '../screens/profile/family';
import CardList from '../screens/settings/card-list';
import ViewProfile from '../screens/view-profile';
import PreviewProfile from '../screens/profile/preview';

//Constant Variable for navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Deeplink
const linking = {
  prefixes: ['socialclique://'],
  config: {
    screens: {
      Dashboard: 'Dashboard',
    },
  },
};

const animationOptions = {
  animationEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
};
// Initial Flow Navigator
function InitialFlow() {
  return (
    <Stack.Navigator initialRouteName="Tutorial" headerMode="none">
      {/* <Stack.Screen name="Splash" component={Splash} /> */}
      <Stack.Screen
        options={animationOptions}
        name="Tutorial"
        component={Tutorial}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AutoLogin" component={AutoLogin} />
      <Stack.Screen name="RegisterName" component={RegisterName} />
      <Stack.Screen name="RegisterMobile" component={RegisterMobile} />
      <Stack.Screen name="RegisterEmail" component={RegisterEmail} />
      <Stack.Screen name="RegisterProfilePic" component={RegisterProfilePic} />
      <Stack.Screen name="RegisterBio" component={RegisterBio} />
      <Stack.Screen name="Congratulation" component={Congratulation} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotMail" component={ForgotMail} />
      <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
      <Stack.Screen name="ChoosePassword" component={ChoosePassword} />
      <Stack.Screen name="OwnProducts" component={OwnProducts} />
      <Stack.Screen name="ScanCard" component={ScanCard} />
      <Stack.Screen name="ScanTag" component={ScanTag} />
      <Stack.Screen name="ActivatedCard" component={ActivatedCard} />
      <Stack.Screen name="Contacts" component={Contacts} />
    </Stack.Navigator>
  );
}

function NearByStackScreen() {
  return (
    <Stack.Navigator initialRouteName="Nearby">
      <Stack.Screen
        name="Nearby"
        component={Nearby}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ProStack() {
  return (
    <Stack.Navigator initialRouteName="Pro" headerMode="none">
      <Stack.Screen name="Pro" component={ProfileAnalytics} />
      <Stack.Screen
        options={animationOptions}
        name="UserMap"
        component={UserMap}
      />
      <Stack.Screen
        options={animationOptions}
        name="AnalyticsView"
        component={AnalyticsView}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
function ChatStack() {
  return (
    <Stack.Navigator initialRouteName="Chat" headerMode="none">
      <Stack.Screen name="Chat" component={Contacts} />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

//Dashboard Stacks
function DashboardSubStack() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      initialRouteName="Profile">
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Nearby" component={NearByStackScreen} />
      <Tab.Screen name="Pro" component={ProStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Setting" component={Settings} />
    </Tab.Navigator>
  );
}
function ModalStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{animationEnabled: false}}
      mode="modal">
      <Stack.Screen
        name="CreateNew"
        component={Pro}
        options={{animationEnabled: true}}
      />
    </Stack.Navigator>
  );
}
function DashboardStack() {
  return (
    <Stack.Navigator mode="modal" headerMode="none" initialRouteName="Profile">
      <Tab.Screen name="Profile" component={DashboardSubStack} />
      <Stack.Screen
        options={animationOptions}
        name="Messages"
        component={Messages}
      />
      <Stack.Screen
        options={animationOptions}
        name="EditProfile"
        component={EditProfile}
      />
      <Stack.Screen
        options={animationOptions}
        name="AddFamilyMember"
        component={AddFamilyMember}
      />
      <Stack.Screen
        name="ChangePasswordSettings"
        component={ChangePasswordSettings}
        options={animationOptions}
      />
      <Stack.Screen
        name="HelpAndTutorials"
        component={HelpAndTutorials}
        options={animationOptions}
      />
      <Stack.Screen
        name="CardList"
        component={CardList}
        options={animationOptions}
      />
      <Stack.Screen
        options={animationOptions}
        name="ScanCard"
        component={ScanCard}
      />
      <Stack.Screen
        options={animationOptions}
        name="ScanTag"
        component={ScanTag}
      />
      <Stack.Screen
        options={animationOptions}
        name="ActivatedCard"
        component={ActivatedCard}
      />
      <Stack.Screen
        // options={animationOptions}
        name="ProCard"
        component={ModalStack}
      />
      <Stack.Screen
        options={animationOptions}
        name="Payment"
        component={Payment}
      />
      <Stack.Screen
        options={animationOptions}
        name="Success"
        component={Success}
      />
      <Stack.Screen
        options={animationOptions}
        name="ProfileAnalytics"
        component={ProfileAnalytics}
      />
      <Stack.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PreviewProfile"
        component={PreviewProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

//********************** Switch Navigator **********************/

const AppNavigator = createSwitchNavigator(
  {
    Splash: Splash,
    Login: InitialFlow,
    Dashboard: DashboardStack,
  },
  {
    initialRouteName: 'Splash',
  },
);

// export default class Navigation extends Component {
const Navigation = () => {
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      onDisplayNotification({
        type: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      <AppNavigator />
    </NavigationContainer>
  );
};
export default Navigation;
