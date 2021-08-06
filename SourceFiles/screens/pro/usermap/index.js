import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Block, ImageComponent} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {useNavigation} from '@react-navigation/core';
import NeuView from '../../../common/neu-element/lib/NeuView';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import {users} from '../../../utils/constants';
import {
  strictValidArrayWithLength,
  strictValidString,
} from '../../../utils/commonUtils';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Webservice from '../../../Constants/API';
import {APIURL} from '../../../Constants/APIURL';
import {showAlert} from '../../../utils/mobile-utils';
import LoadingView from '../../../Constants/LoadingView';
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const UserMap = () => {
  const {goBack} = useNavigation();
  const [loading, setLoading] = useState(false);
  const [arrNearbyPeople, setArNearbyPeople] = useState([]);
  const [location, setlocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.033737423651551524,
    longitudeDelta: 0.027754828333854675,
  });
  const mapRef = useRef();
  console.log(arrNearbyPeople, 'arrNearbyPeople');

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
  const API_NEARBY_USERS = async (isload) => {
    // setArNearbyPeople([]);
    setLoading(isload);
    const user_id = await AsyncStorage.getItem('user_id');
    const data = {
      user_id: user_id,
      lat: location.latitude,
      long: location.longitude,
      action: 'map',
    };
    console.log(data, 'kk');
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
        console.log('Get Newrby users Response : ' + JSON.stringify(response));

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
        console.log(error.message);
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
  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setlocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.033737423651551524,
          longitudeDelta: 0.027754828333854675,
        });
        setTimeout(() => {
          onCenter(position.coords.latitude, position.coords.longitude);
        }, 500);
        setTimeout(() => {
          API_NEARBY_USERS(true);
        }, 2000);
        console.log('Longitude : ' + position.coords.longitude);
        console.log('Latitude : ' + position.coords.latitude);
      },
      (error) => {
        console.log(error.message);
        getOneTimeLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 100000,
        maximumAge: 3600000,
      },
    );
  };
  const onCenter = (a, b) => {
    console.log('call');
    mapRef.current.animateToRegion({
      latitude: a,
      longitude: b,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={location}
        // showsUserLocation
        // onRegionChangeComplete={async (coords) => {
        //   // console.log(coords);
        //   mapRef.current?.animateCamera(coords);
        // }}
      >
        <Marker coordinate={location}>
          {/* <Block center flex={false}> */}
          {/* <LottieView
            style={{height: 70, width: 70}}
            source={require('../../../Assets/animation.json')}
            autoPlay
            loop
          /> */}
          {/* </Block> */}
          <ImageComponent name={'current_user_icon'} height={50} width={50} />
        </Marker>
        {strictValidArrayWithLength(arrNearbyPeople) &&
          arrNearbyPeople.map((item, index) => {
            const marker = {
              latitude: JSON.parse(item.current_lat),
              longitude: JSON.parse(item.current_long),
            };
            return (
              <Marker coordinate={marker}>
                {strictValidString(item.avatar) ? (
                  <ImageComponent
                    isURL
                    name={`${APIURL.ImageUrl}${item.avatar}`}
                    height={50}
                    width={50}
                    radius={50}
                  />
                ) : (
                  <ImageComponent name="demouser" height={100} width={100} />
                )}
              </Marker>
            );
          })}
      </MapView>
      <Block
        style={{position: 'absolute', top: hp(3), right: 0}}
        center
        padding={[hp(2), wp(3)]}
        right
        flex={false}>
        <TouchableOpacity activeOpacity={1} onPress={() => goBack()}>
          <NeuView
            concave
            color="#BC60CB"
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#AF2DA5', '#BC60CB']}>
            <ImageComponent
              resizeMode="contain"
              height={14}
              width={14}
              name={'close_icon'}
              color={'#fff'}
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
      {loading ? <LoadingView /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default UserMap;
