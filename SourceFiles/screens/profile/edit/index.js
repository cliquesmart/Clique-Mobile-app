import React, {useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Text, ImageComponent, Button} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import NeuView from '../../../common/neu-element/lib/NeuView';
import NeuButton from '../../../common/neu-element/lib/NeuButton';
import NeuInput from '../../../common/neu-element/lib/NeuInput';
import {useNavigation, useRoute} from '@react-navigation/core';
import {
  strictValidArray,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/commonUtils';
import {APIURL} from '../../../Constants/APIURL';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ValidationMsg from '../../../Constants/ValidationMsg';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Webservice from '../../../Constants/API';
import {showAlert} from '../../../utils/mobile-utils';
import LoadingView from '../../../Constants/LoadingView';
import Slider from '@react-native-community/slider';
import {CommonColors} from '../../../Constants/ColorConstant';
import moment from 'moment';
import {Modalize} from 'react-native-modalize';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditProfile = () => {
  const {params} = useRoute();
  const {profile} = params;
  const [activeOptions, setactiveOptions] = useState('social');
  const {goBack} = useNavigation();
  const [name, setName] = useState(profile.name || '');
  const [company, setcompany] = useState(profile.bio || '');
  const [email, setEmail] = useState(profile.email || '');
  const [dob, setDob] = useState(profile.date_of_birth || '');
  const [gender, setGender] = useState(profile.gender || '');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const modalizeRef = useRef();
  const [profileImage, setProfileImage] = useState('');
  const [loading, setloading] = useState(false);
  const [deleteSocialLoading, setDeleteSocialLoading] = useState(false);
  const submitadata = async (values) => {
    const user_id = await AsyncStorage.getItem('user_id');
    setloading(true);
    Webservice.post(APIURL.userprofileupdate, {
      user_id: user_id,
      name: name,
      bio: company,
      avatar: profileImage.base64,
      gender: gender,
      date_of_birth: dob,
      // type: activeOptions,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          Alert.alert(response.originalError.message);

          return;
        }
        console.log('Get Social Icons Response : ' + response);

        if (response.data.status === true) {
          setloading(false);
          goBack();
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setloading(false);
        Alert.alert(error.message, '', {cancelable: false});
      });
  };
  const btnSelectImage = () => {
    Alert.alert(
      ValidationMsg.AppName,
      'Choose your Suitable Option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  console.log('User cancelled photo picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.errorCode);

                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  ImagePicker.openCropper({
                    compressImageQuality: 0.7,
                    path: response.uri,
                    width: 300,
                    includeBase64: true,
                    cropperCircleOverlay: true,
                    height: 300,
                  })
                    .then((image) => {
                      console.log(image);

                      var dict = {};
                      dict.base64 = image.data;
                      dict.uri = image.path;
                      dict.type = image.mime;
                      setProfileImage(dict);
                    })
                    .catch((e) => {
                      // alert(e);

                      console.log(' Error :=>  ' + e);
                    });
                }
              },
            );
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  console.log('User cancelled photo picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.error);

                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  ImagePicker.openCropper({
                    compressImageQuality: 0.7,
                    path: response.uri,
                    width: 300,
                    includeBase64: true,
                    cropperCircleOverlay: true,
                    height: 300,
                  })
                    .then((image) => {
                      console.log(image);

                      var dict = {};
                      dict.base64 = image.data;
                      dict.uri = image.path;
                      dict.type = image.mime;
                      setProfileImage(dict);
                    })
                    .catch((e) => {
                      // alert(e);

                      console.log(' Error :=>  ' + e);
                    });
                }
              },
            );
          },
        },
        {
          text: 'Cancel',
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };
  const renderHeader = () => {
    return (
      <Block center padding={[hp(2), wp(3)]} space="between" flex={false} row>
        <Text white semibold size={18}>
          {'      '}
        </Text>
        <Text white semibold size={18}>
          {'Edit your profile'}
        </Text>
        <TouchableOpacity onPress={() => goBack()}>
          <NeuView
            concave
            color="#E866B6"
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#BD64CE', '#AE28A1']}>
            <ImageComponent
              resizeMode="contain"
              height={14}
              width={14}
              name={'close_icon'}
              color="#fff"
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };

  const renderProfileImagePath = () => {
    if (profileImage.uri) {
      return profileImage.uri;
    }
    if (
      strictValidObjectWithKeys(profile) &&
      strictValidString(profile.avatar)
    ) {
      return `${APIURL.ImageUrl}${profile.avatar}`;
    }

    return 'demouser';
  };
  const renderProfile = () => {
    return (
      <Block alignSelf="center" padding={[0, wp(3)]} flex={false}>
        <ImageComponent
          isURL
          name={renderProfileImagePath()}
          height={80}
          width={80}
          radius={80}
        />
        <TouchableOpacity
          onPress={() => btnSelectImage()}
          style={{
            position: 'absolute',
            top: 0,
          }}>
          <NeuView color="#F2F0F7" height={30} width={30} borderRadius={30}>
            <ImageComponent
              resizeMode="contain"
              height={18}
              width={18}
              name={'edit_icon'}
              color="#6F3AC8"
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };
  const renderOptions = () => {
    return (
      <Block middle center margin={[hp(2), 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(45)}
          borderRadius={16}
          containerStyle={styles.neoContainer}
          inset>
          {activeOptions === 'social' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(20)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                Social
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(1)}]}
              onPress={() => setactiveOptions('social')}
              grey
              regular
              center
              size={13}>
              Social
            </Text>
          )}
          {activeOptions === 'business' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(20)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text
                semibold
                onPress={() => setactiveOptions('business')}
                purple
                center
                size={13}>
                Business
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginLeft: wp(1)}]}
              onPress={() => setactiveOptions('business')}
              grey
              regular
              size={13}>
              Business
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };
  const deleteSocialAccount = async (data) => {
    const user_id = await AsyncStorage.getItem('user_id');
    setDeleteSocialLoading(true);
    Webservice.post(APIURL.socialIcons, {
      user_id: user_id,
      id: data.id,
      action: 'delete',
    })
      .then(async (response) => {
        if (response.data == null) {
          setDeleteSocialLoading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setDeleteSocialLoading(false);
          // setIcons(response.data.data);
          // setAction('');
          // setField('');
          // getProfile();
          goBack();
        } else {
          setDeleteSocialLoading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setDeleteSocialLoading(false);
        showAlert(error.message);
      });
  };

  const fomatDOB = (a) => {
    return moment(a).format('MM/DD/YYYY');
  };
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setDob(fomatDOB(date));
    console.log('A date has been picked: ', date);
    hideDatePicker();
  };

  const renderSocialIcons = (data, type) => {
    return (
      <FlatList
        contentContainerStyle={styles.flexStyle}
        numColumns={4}
        bounces={false}
        data={data}
        renderItem={({item}) => {
          return (
            <>
              <Block
                style={{paddingHorizontal: wp(1), marginTop: hp(2)}}
                flex={false}
                row>
                {strictValidObjectWithKeys(item.icone) && (
                  <ImageComponent
                    isURL
                    name={`${APIURL.iconUrl}${item.icone.url}`}
                    height={Platform.OS === 'ios' ? 85 : 80}
                    width={Platform.OS === 'ios' ? 85 : 80}
                    resizeMode="contain"
                  />
                )}
                <TouchableOpacity
                  style={styles.deleteAccountButton}
                  onPress={() => deleteSocialAccount(item)}>
                  <ImageComponent
                    resizeMode="contain"
                    height={40}
                    width={40}
                    name={'delete_icon'}
                  />
                </TouchableOpacity>
              </Block>
            </>
          );
        }}
      />
    );
  };
  const closeModal = (val) => {
    setGender(val);
    modalizeRef.current?.close();
  };
  return (
    <>
      <Block linear>
        <StatusBar barStyle="light-content" />
        <SafeAreaView />
        {renderHeader()}
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
          <Block
            style={{flexGrow: 1}}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            padding={[hp(2), wp(3)]}
            color="#F2EDFA">
            {renderProfile()}
            <Block margin={[hp(1), 0]} alignSelf="center" flex={false}>
              <Text uppercase grey semibold center margin={[0, 0, hp(2)]}>
                {name}
              </Text>
              <NeuInput
                width={wp(80)}
                height={hp(5)}
                borderRadius={16}
                containerStyle={{paddingVetical: hp(1)}}
                color="#eef2f9"
                onChangeText={(a) => setName(a)}
                value={name}
                placeholder="Enter Name"
                placeholderTextColor="grey"
              />
            </Block>
            <Block margin={[hp(1), 0]} alignSelf="center" flex={false}>
              <NeuInput
                width={wp(80)}
                height={hp(5)}
                borderRadius={16}
                containerStyle={{paddingVetical: hp(1)}}
                color="#eef2f9"
                onChangeText={(a) => setEmail(a)}
                value={email}
                placeholder="Email"
                placeholderTextColor="grey"
                editable={false}
              />
            </Block>
            <Block center flex={false} margin={[hp(1), 0]}>
              <NeuButton
                onPress={() => setIsDatePickerVisible(true)}
                color="#eef2f9"
                width={wp(80)}
                height={hp(5)}
                containerStyle={styles.buttonStyle}
                borderRadius={16}>
                <Text
                  grey={!strictValidString(dob)}
                  black={strictValidString(dob)}
                  size={14}>
                  {strictValidString(dob) ? dob : 'MM/DD/YYYY'}
                </Text>
                <Block flex={false} margin={[0, wp(2), 0, 0]}>
                  <ImageComponent
                    name="down_arrow_icon"
                    height={10}
                    width={16}
                  />
                </Block>
              </NeuButton>
            </Block>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              inline
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Block center flex={false} margin={[hp(1), 0]}>
              <NeuButton
                onPress={() => modalizeRef.current?.open()}
                color="#eef2f9"
                width={wp(80)}
                height={hp(5)}
                containerStyle={styles.buttonStyle}
                borderRadius={16}>
                <Text
                  capitalize
                  grey={!strictValidString(gender)}
                  black={strictValidString(gender)}
                  size={14}>
                  {strictValidString(gender) ? gender : 'Select Gender'}
                </Text>
                <Block flex={false} margin={[0, wp(2), 0, 0]}>
                  <ImageComponent
                    name="down_arrow_icon"
                    height={10}
                    width={16}
                  />
                </Block>
              </NeuButton>
            </Block>
            <Block margin={[hp(1), 0]} alignSelf="center" flex={false}>
              <NeuInput
                width={wp(80)}
                height={hp(15)}
                borderRadius={16}
                containerStyle={{paddingVetical: hp(1), height: hp(15)}}
                color="#eef2f9"
                onChangeText={(a) => setcompany(a)}
                value={company}
                placeholder="ex. UX/UI Designer at Atom 6"
                placeholderTextColor="grey"
                maxLength={280}
                multiline={true}
                style={{height: hp(15)}}
                textAlignVertical={'top'}
                textStyle={{height: hp(15)}}
              />
              <Text margin={[hp(1.5), 0, 0]} right regular size={14} purple>
                {company.length}/280
              </Text>
            </Block>

            {renderOptions()}
            <Text grey semibold center margin={[hp(2), 0]}>
              Accounts
            </Text>
            {strictValidObjectWithKeys(profile) &&
              strictValidArray(profile.social) &&
              activeOptions === 'social' &&
              renderSocialIcons(profile.social, 'social')}
            {strictValidObjectWithKeys(profile) &&
              strictValidArray(profile.business) &&
              activeOptions === 'business' &&
              renderSocialIcons(profile.business, 'business')}
          </Block>
        </ScrollView>
        <Block flex={false} color="#F2EDFA" padding={[0, wp(3), hp(4)]}>
          <Button
            isLoading={loading}
            onPress={() => submitadata()}
            color="primary"
            linear>
            Save
          </Button>
        </Block>
      </Block>
      {deleteSocialLoading ? <LoadingView /> : null}
      <Modalize
        adjustToContentHeight={true}
        tapGestureEnabled={false}
        handlePosition="inside"
        handleStyle={{backgroundColor: '#6B37C3'}}
        modalStyle={[{backgroundColor: '#F2F0F7'}]}
        ref={modalizeRef}>
        <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
          <Text semibold purple margin={[0, 0, hp(2)]} size={16} center>
            Select Gender
          </Text>
          <Block flex={false} margin={[hp(1), 0, 0]} center>
            <NeuButton
              onPress={() => {
                closeModal('male');
              }}
              color="#eef2f9"
              width={wp(90)}
              height={hp(5)}
              // containerStyle={styles.buttonStyle}
              borderRadius={16}>
              <Text grey size={14}>
                Male
              </Text>
            </NeuButton>
          </Block>
          <Block center flex={false} margin={[hp(2), 0, 0]}>
            <NeuButton
              onPress={() => {
                closeModal('female');
              }}
              color="#eef2f9"
              width={wp(90)}
              height={hp(5)}
              borderRadius={16}>
              <Text grey size={14}>
                Female
              </Text>
            </NeuButton>
          </Block>
          <Block center flex={false} margin={[hp(2), 0, 0]}>
            <NeuButton
              onPress={() => {
                closeModal('transgender');
              }}
              color="#eef2f9"
              width={wp(90)}
              height={hp(5)}
              borderRadius={16}>
              <Text grey size={14}>
                Transgender
              </Text>
            </NeuButton>
          </Block>
        </Block>
      </Modalize>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2EDFA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  neomorphStyle: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeNeomorph: {
    borderRadius: 10,
    shadowRadius: 6,
    backgroundColor: '#F2F0F7',
    padding: hp(1),
  },
  inactiveText: {
    width: wp(20),
  },
  containerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  neoContainer: {flexDirection: 'row'},
  deleteAccountButton: {position: 'absolute', top: 0, right: 0},
  flexStyle: {
    flexGrow: 1,
    paddingHorizontal: wp(1),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    flexDirection: 'row',
  },
});
export default EditProfile;
