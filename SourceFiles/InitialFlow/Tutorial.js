/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import AppIntroSlider from 'react-native-app-intro-slider';
import {images} from '../Assets/Images/images';
import {Button} from '../components';
import {wp} from '../components/responsive';
import {useEffect} from 'react';
import {showAlert} from '../utils/mobile-utils';
import Geolocation from '@react-native-community/geolocation';
import {locationRequest} from '../redux/location/action';
import {useDispatch} from 'react-redux';

const slides = [
  {
    key: 1,
    title: 'Welcome to Clique',
    text: 'The first thing you will need\nis your Clique card.',
    image: images.onboarding1,
  },
  {
    key: 2,
    title: 'Take Your Card',
    text: 'Scan your card with your\nphone to activate it',
    image: images.onboarding2,
  },
  {
    key: 3,
    title: 'Put it Behind Your Phone',
    text: 'Scan your card with your\nphone to activate it',
    image: images.onboarding3,
  },
];

const Tutorial = () => {
  const introRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const goToRegister = () => {
    const props = props;
    navigation.navigate('RegisterName', {isFromTutorial: true});
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        dispatch(locationRequest(position.coords));
      },
      (error) => {},
      {
        enableHighAccuracy: false,
        timeout: 15000,
      },
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Clique App Location Permission',
          message:
            'Clique App App needs access to your location ' +
            'so you can access the geolocation service.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('never ask again');
        showAlert(
          "You can't acess the Geolocation Service. Please give access to Location service from the app settings",
        );
        setTimeout(() => {
          Linking.openSettings();
        }, 2000);
      } else {
        console.log('never ask again 2');
        showAlert(
          "You can't acess the Geolocation Service. Please give access to Location service",
        );
        requestCameraPermission();
        console.log('Location permission denied');
      }
    } catch (err) {
      console.log('never ask again 3', err);
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      requestCameraPermission();
    }
    callProfile();
  }, []);

  const _renderItem = ({item}) => {
    return (
      <ImageBackground
        // imageStyle={{
        //   resizeMode: 'stretch', // works only here!
        // }}
        source={item.image}
        style={styles.slide}>
        <View style={{paddingBottom: 40, marginHorizontal: wp(5)}}>
          <Button onPress={() => goToRegister()} linear color="primary">
            Sign Up
          </Button>

          <Text style={styles.txtAlreadyAccount}>
            Already have an account?{' '}
            <Text style={styles.txtLogin} onPress={() => goToLogin()}>
              Log In
            </Text>
          </Text>
        </View>
      </ImageBackground>
    );
  };

  const callProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('user_id');
      if (value !== null) {
        // value previously stored
        navigation.navigate('Dashboard');
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  const _renderPagination = (activeIndex) => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {slides.length > 1 &&
            slides.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? {backgroundColor: '#945FEC', width: 23}
                    : {backgroundColor: '#E4D6FD'},
                ]}
                onPress={() => introRef.current?.goToSlide(i, true)}
              />
            ))}
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={CommonColors.primaryColor}
      />
      <AppIntroSlider
        ref={introRef}
        renderItem={_renderItem}
        data={slides}
        keyExtractor={(item, index) => index.toString()}
        showNextButton={false}
        showDoneButton={false}
        renderPagination={_renderPagination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    height:
      Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : Dimensions.get('window').height,
    width: Dimensions.get('screen').width,
    justifyContent: 'flex-end',
    // backgroundColor: CommonColors.primaryColor,
  },
  image: {
    flex: 1,
  },
  btnSignUp: {
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    backgroundColor: CommonColors.PurpleColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSignUp: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },
  txtAlreadyAccount: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 25,
    fontFamily: ConstantKeys.Averta_REGULAR,
    fontSize: SetFontSize.ts14,
    color: CommonColors.secondaryText,
  },
  txtLogin: {
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts14,
    color: CommonColors.secondaryText,
  },
  viewClique: {
    backgroundColor: '#F2F0F7',
    width: 135,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: {width: 5, height: 5},
    borderRadius: 20,
  },
  txtIntoTitle: {
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontSize: SetFontSize.ts30,
    fontFamily: ConstantKeys.Averta_BOLD,
    color: CommonColors.whiteColor,
  },
  txtIntroDesc: {
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontSize: SetFontSize.ts14,
    marginTop: 10,
    fontFamily: ConstantKeys.Averta_REGULAR,
    color: CommonColors.whiteColor,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  paginationDots: {
    height: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
});
export default Tutorial;
