/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Block, Text, ImageComponent, CustomButton} from '../components';
import {hp, wp} from '../components/responsive';
import {APIURL} from '../Constants/APIURL';
import {CommonColors} from '../Constants/ColorConstant';
import {ConstantKeys} from '../Constants/ConstantKey';
import {SetFontSize} from '../Constants/FontSize';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../utils/commonUtils';
import * as Animatable from 'react-native-animatable';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Snackbar from 'react-native-snackbar';
import Webservice from '../Constants/API';
import ValidationMsg from '../Constants/ValidationMsg';
import FastImage from 'react-native-fast-image';
import NeuView from '../common/neu-element/lib/NeuView';
import {light} from '../components/theme/colors';
import LottieView from 'lottie-react-native';

const Nearby = () => {
  const [profile] = useSelector((v) => [v.profile.data]);

  const [loading, setLoading] = useState(false);
  const [arrNearbyPeople, setArNearbyPeople] = useState([]);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const {navigate, goBack} = useNavigation();
  const logoanimation2 = {
    0: {
      opacity: 1,
      scale: 1,
    },
    0.2: {
      opacity: 1,
      scale: 0.8,
    },
    0.4: {
      opacity: 1,
      scale: 0.6,
    },
    0.6: {
      opacity: 1,
      scale: 0.6,
    },
    0.8: {
      opacity: 1,
      scale: 0.8,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };
  const easing = 'ease-in-out-sine';

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    API_NEARBY_USERS(true);
  };
  useFocusEffect(
    React.useCallback(() => {
      requestLocationPermission();
    }, []),
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
        } else {
          console.log('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });

        // set Timeout for display animation jkp
        setTimeout(() => {
          API_NEARBY_USERS(true);
        }, 1000);
      },
      (error) => {
        getOneTimeLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 100000,
        maximumAge: 3600000,
      },
    );
  };

  const showAlert = (text) => {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  // API NEARBY USER CALL
  const API_NEARBY_USERS = async (isload) => {
    // setArNearbyPeople([]);
    setLoading(isload);
    const user_id = await AsyncStorage.getItem('user_id');
    const data = {
      user_id: user_id,
      lat: location.latitude,
      long: location.longitude,
    };
    Webservice.post(APIURL.nearbyUsers, {
      user_id: user_id,
      lat: location.latitude,
      long: location.longitude,
    })

      .then((response) => {
        if (response.data == null) {
          setLoading(false);
          // alert('error');
          showAlert(response.originalError.message);
          return;
        }

        if (response.data.status === true) {
          // Already User
          var nearByData = response.data.data;

          setTimeout(() => {
            setLoading(false);
            setArNearbyPeople(nearByData);
          }, 5000);
        } else {
          setLoading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                API_NEARBY_USERS(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  // API Add Constact
  const API_ADD_CONTACT = async (isload, contact_id) => {
    setLoading(isload);
    const user_id = await AsyncStorage.getItem('user_id');
    Webservice.post(APIURL.addContact, {
      user_id: user_id,
      contact_id: contact_id,
    })
      .then((response) => {
        if (response.data == null) {
          setLoading(false);
          // alert('error');
          showAlert(response.originalError.message);
          return;
        }
        setLoading(false);

        if (response.data.status === true) {
          showAlert(response.data.message);
          API_NEARBY_USERS(false);
        } else {
          setLoading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  //Action Methods
  const btnAddContactTap = (user) => {
    requestAnimationFrame(() => {
      Alert.alert(
        ValidationMsg.AppName,
        'Are you sure you add this contact?',
        [
          {
            text: 'Yes',
            onPress: () => {
              API_ADD_CONTACT(false, user.user_id);
            },
          },
          {
            text: 'No',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    });
  };

  const selectProfileTap = (item) => {
    requestAnimationFrame(() => {
      navigate('UserProfile', {profile_id: item.user_id});
    });
  };

  const EmptyFile = () => {
    return (
      <Block center middle>
        <Text size={16} grey>
          No Data Found
        </Text>
      </Block>
    );
  };

  const renderProfile = () => {
    return (
      // <Block center middle>
      //   <Animatable.View
      //     animation={logoanimation2}
      //     delay={2000}
      //     duration={2000}
      //     iterationCount="infinite"
      //     style={styles.animation4}
      //     easing={easing}>
      //     <Animatable.View
      //       animation={logoanimation2}
      //       delay={2000}
      //       duration={2000}
      //       iterationCount="infinite"
      //       style={styles.animation}
      //       easing={easing}>
      //       <Animatable.View
      //         animation={logoanimation2}
      //         delay={2000}
      //         duration={2000}
      //         iterationCount="infinite"
      //         style={styles.animation1}
      //         easing={easing}>
      //         <Animatable.View
      //           animation={logoanimation2}
      //           delay={2000}
      //           duration={2000}
      //           iterationCount="infinite"
      //           style={styles.animation2}
      //           easing={easing}>
      //           <Animatable.View
      //             animation={logoanimation2}
      //             delay={2000}
      //             duration={2000}
      //             iterationCount="infinite"
      //             style={styles.animation3}
      //             easing={easing}>
      //             <ImageComponent
      //               isURL
      //               name={`${APIURL.ImageUrl}${profile.avatar}`}
      //               height={130}
      //               width={130}
      //               radius={130}
      //             />
      //           </Animatable.View>
      //         </Animatable.View>
      //       </Animatable.View>
      //     </Animatable.View>
      //   </Animatable.View>
      // </Block>
      <Block center flex={false}>
        <LottieView
          source={require('../Assets/animation.json')}
          autoPlay
          loop
        />
      </Block>
    );
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Block flex={false} row padding={[hp(2), wp(3)]}>
          <TouchableOpacity onPress={() => goBack()}>
            <NeuView
              concave
              color="#eef2f9"
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#FAF8F8', '#DCC8FA']}>
              <ImageComponent
                resizeMode="contain"
                height={14}
                width={14}
                name={'BackIcon'}
                color={light.purple}
              />
            </NeuView>
          </TouchableOpacity>
        </Block>
        <Text margin={[hp(5), 0, hp(2)]} center grey size={16}>
          {arrNearbyPeople.length > 0
            ? `We've found ${arrNearbyPeople.length} users that you might know`
            : 'Looking for people near by ...'}
        </Text>
        {arrNearbyPeople.length === 0 && loading === true ? (
          strictValidObjectWithKeys(profile) &&
          strictValidString(profile.avatar) && (
            <LottieView
              source={require('../Assets/animation.json')}
              autoPlay
              loop
              style={{
                marginTop: hp(5),
              }}
            />
          )
        ) : (
          <FlatList
            data={arrNearbyPeople}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            refreshControl={
              <RefreshControl
                tintColor={light.purple}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={{flexGrow: 1, paddingBottom: hp(4)}}
            ListEmptyComponent={<EmptyFile />}
            renderItem={({item}) => {
              return (
                <CustomButton
                  onPress={() => selectProfileTap(item)}
                  activeOpacity={1}
                  flex={false}
                  margin={[hp(2), wp(1), 0, wp(5)]}>
                  <NeuView
                    // containerStyle={styles.helpView}
                    height={hp(16)}
                    color="#F2F0F7"
                    width={wp(42)}
                    borderRadius={16}>
                    <FastImage
                      style={{
                        height: 64,
                        width: 64,
                        borderRadius: 64,
                      }}
                      source={{
                        uri: `${APIURL.ImageUrl}${item.avatar}`,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text size={16} purple semibold margin={[hp(1.5), 0, 0]}>
                      {item.name}
                    </Text>
                  </NeuView>
                </CustomButton>
              );
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDFA',
  },
  headerView: {
    height: 74,
    width: '100%',
    backgroundColor: CommonColors.appBarColor,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    flex: 1,
    textAlign: 'center',
  },
  txtNoData: {
    fontFamily: ConstantKeys.POPPINS_REGULAR,
    fontSize: SetFontSize.ts18,
    color: CommonColors.whiteColor,
  },
  animation: {
    borderColor: '#CFD8DC',
    borderWidth: 3,
    borderRadius: 300,
    height: 240,
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation1: {
    borderColor: '#CFD8DC',
    borderWidth: 3,
    borderRadius: 300,
    height: 210,
    width: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation2: {
    borderColor: '#CFD8DC',
    borderWidth: 3,
    borderRadius: 300,
    height: 170,
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation3: {
    borderColor: '#CFD8DC',
    borderWidth: 3,
    borderRadius: 300,
    height: 130,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation4: {
    borderColor: '#CFD8DC',
    borderWidth: 3,
    borderRadius: 300,
    height: 280,
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Nearby;
