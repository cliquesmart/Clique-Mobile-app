/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SectionList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Block,
  Text,
  ImageComponent,
  Button,
  CustomButton,
} from '../../components';
import {hp, wp} from '../../components/responsive';
import NeuView from '../../common/neu-element/lib/NeuView';
import NeuButton from '../../common/neu-element/lib/NeuButton';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import {Modalize} from 'react-native-modalize';
import NeoInputField from '../../components/neo-input';
import Webservice from '../../Constants/API';
import {APIURL} from '../../Constants/APIURL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OpenLinks, showAlert} from '../../utils/mobile-utils';
import LoadingView from '../../Constants/LoadingView';
import {
  strictValidArray,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {t2} from '../../components/theme/fontsize';
import {light} from '../../components/theme/colors';
import {profileRequest} from './action';
import {useDispatch} from 'react-redux';

const Profile = () => {
  const {navigate} = useNavigation();
  const [activeOptions, setactiveOptions] = useState('social');
  const [modalType, setModalType] = useState('social');
  const [toggle, setToggle] = useState(true);
  const [action, setAction] = useState(null);
  const modalizeRef = useRef();
  const [profile, setprofile] = useState({});
  const [loading, setloading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [deleteSocialLoading, setDeleteSocialLoading] = useState(false);
  const [Icons, setIcons] = useState([]);
  const [newState, setNewState] = useState({});
  const [field, setField] = useState('');
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      callProfile();
    }, []),
  );

  const callProfile = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    dispatch(profileRequest(user_id));
  };

  const openPhoneNumber = async (phone) => {
    let phoneNumber = '';
    const replacePhone = phone.replace('tel:', '');
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${replacePhone}`;
    } else {
      phoneNumber = `telprompt:${replacePhone}`;
    }

    Linking.openURL(phoneNumber);
  };

  const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  const openMessages = async (phone) => {
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${phone}${separator}body=${'Hi'}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log('Unsupported url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const openFacebook = (url) => {
    return Linking.openURL(`fb://profile/${url}`).catch(() => {
      Linking.openURL('https://www.facebook.com/' + url);
    });
  };

  const openLink = async (url, name) => {
    // Checking if the link is supported for links with custom URL scheme.

    switch (name) {
      case 'Phone':
        return openPhoneNumber(url);
      case 'Messages':
        return openMessages(url);
      default:
        return openUrl(url);
    }
  };

  const getProfile = async (values) => {
    const user_id = await AsyncStorage.getItem('user_id');
    setloading(true);
    Webservice.post(APIURL.getTempProfile, {
      user_id: user_id,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setloading(false);
          setprofile(response.data.data.user);
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                getProfile();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  const getSocialAndBusinessIcon = async (values) => {
    const user_id = await AsyncStorage.getItem('user_id');
    setSocialLoading(true);
    Webservice.post(APIURL.socialIcons, {
      user_id: user_id,
      type: activeOptions,
    })
      .then(async (response) => {
        if (response.data == null) {
          setSocialLoading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setSocialLoading(false);
          setIcons(response.data.data);

          modalizeRef.current?.open();
          setAction('add_account');
        } else {
          setSocialLoading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setSocialLoading(false);
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                getSocialAndBusinessIcon();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };
  const renderHeader = () => {
    return (
      <Block
        center
        padding={[hp(2), wp(3), 0]}
        space="between"
        flex={false}
        row>
        <Text white semibold size={18}>
          {'      '}
        </Text>
        <ImageComponent
          resizeMode="contain"
          height={55}
          width={159}
          name={'nameBg'}
        />
        <TouchableOpacity
          onPress={() =>
            navigate('ScanCard', {
              card: true,
              nfc: false,
            })
          }>
          <NeuView
            concave
            color="#E866B6"
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#BD64CE', '#AE28A1']}>
            <ImageComponent
              resizeMode="contain"
              height={20}
              width={20}
              name={'nfc_icon'}
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };
  const renderProfile = () => {
    return (
      <Block padding={[hp(2), wp(3)]} space="between" flex={false} row>
        <Block center flex={false} row>
          {strictValidObjectWithKeys(profile) &&
          strictValidString(profile.avatar) ? (
            <Block
              flex={false}
              borderWidth={3}
              borderRadius={80}
              borderColor={profile.is_pro === '0' ? '#fff' : '#FFDF00'}>
              <ImageComponent
                isURL
                name={`${APIURL.ImageUrl}${profile.avatar}`}
                height={80}
                width={80}
                radius={80}
              />
            </Block>
          ) : (
            <ImageComponent name="demouser" height={100} width={100} />
          )}
          <Block margin={[0, 0, 0, wp(3)]} flex={false}>
            <Block center flex={false} row>
              <Text margin={[0, wp(2), 0, 0]} capitalize white bold size={24}>
                {strictValidObjectWithKeys(profile) && profile.name}
              </Text>
              <ImageComponent
                name="user_verified_icon"
                height={25}
                width={25}
              />
            </Block>
            {strictValidObjectWithKeys(profile) &&
              strictValidString(profile.bio) && (
                <Text
                  style={{width: wp(55)}}
                  margin={[hp(0.5), 0, 0]}
                  size={14}
                  white
                  numberOfLines={3}
                  regular>
                  {profile.bio}
                </Text>
              )}
            <Text margin={[hp(0.5), 0, 0]} size={16} semibold white>
              {profile.my_connections} Connections
            </Text>
          </Block>
        </Block>
        <Block flex={false} right>
          <TouchableOpacity
            onPress={() =>
              navigate('EditProfile', {
                profile: profile,
              })
            }>
            <NeuView
              concave
              color="#E866B6"
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#BD64CE', '#AE28A1']}>
              <ImageComponent
                resizeMode="contain"
                height={20}
                width={20}
                name={'edit_icon'}
                color="#fff"
              />
            </NeuView>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: hp(2)}}>
            <NeuView
              concave
              color="#E866B6"
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#BD64CE', '#AE28A1']}>
              <ImageComponent
                resizeMode="contain"
                height={20}
                width={20}
                name={'profile_share_icon'}
              />
            </NeuView>
          </TouchableOpacity>
        </Block>
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
              style={[styles.inactiveText]}
              onPress={() => setactiveOptions('business')}
              grey
              regular
              center
              size={13}>
              Business
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };

  const onOpen = (type) => {
    if (type === 'business' && profile.is_pro === '0') {
      navigate('ProCard');
    } else {
      getSocialAndBusinessIcon(type);
    }
  };
  const _renderFooter = (type) => {
    return (
      <NeuButton
        onPress={() => onOpen(type)}
        active
        color="#eef2f9"
        height={hp(9.3)}
        width={wp(19.3)}
        borderRadius={16}
        style={{marginHorizontal: wp(1.1), marginTop: hp(2.5)}}>
        <ImageComponent name="add_icon" height={25} width={25} />
      </NeuButton>
    );
  };
  const renderSocialIcons = (data, type) => {
    return (
      <FlatList
        ListFooterComponent={_renderFooter(type)}
        contentContainerStyle={styles.socialIcons}
        numColumns={4}
        bounces={false}
        data={data}
        renderItem={({item}) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  modalizeRef.current?.open();
                  setAction('open_link');
                  setNewState(item);
                  setField(item.username);
                }}
                style={{paddingHorizontal: wp(1), marginTop: hp(2)}}>
                {strictValidObjectWithKeys(item.icone) && (
                  <ImageComponent
                    isURL
                    name={`${APIURL.iconUrl}${item.icone.url}`}
                    height={Platform.OS === 'ios' ? 90 : 85}
                    width={Platform.OS === 'ios' ? 90 : 85}
                  />
                )}
              </TouchableOpacity>
            </>
          );
        }}
      />
    );
  };
  const AddSocialIcons = () => {
    return (
      <SectionList
        scrollEnabled={false}
        contentContainerStyle={{
          paddingVertical: hp(2),
          paddingHorizontal: wp(2),
        }}
        showsVerticalScrollIndicator={false}
        sections={Icons}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({section}) => (
          <>
            <Text center bold margin={[t2, 0, 0]} capitalize grey size={20}>
              Add {section.title}
            </Text>
            {strictValidArrayWithLength(section.data) && (
              <FlatList
                numColumns={5}
                data={section.data}
                renderItem={({item}) => {
                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          if (item.is_pro === '1') {
                            navigate('ProCard');
                            setAction('');
                            modalizeRef.current?.close();
                          } else {
                            setAction('select_account');
                            setNewState(item);
                          }
                        }}
                        style={{paddingHorizontal: wp(1), marginTop: hp(2)}}>
                        <ImageBackground
                          source={{uri: `${APIURL.iconUrl}${item.url}`}}
                          style={styles.bgImage}>
                          {item.is_pro === '1' && (
                            <Block style={styles.pro}>
                              <ImageComponent
                                name={'pro_icon'}
                                height={40}
                                width={40}
                              />
                            </Block>
                          )}
                        </ImageBackground>
                      </TouchableOpacity>
                    </>
                  );
                }}
              />
            )}
          </>
        )}
        renderItem={({item}) => {
          return null;
        }}
      />
    );
  };
  const saveSocialAccount = async (data) => {
    const user_id = await AsyncStorage.getItem('user_id');
    setSocialLoading(true);
    Webservice.post(APIURL.socialIcons, {
      user_id: user_id,
      id: data.id,
      type: activeOptions,
      link: field,
    })
      .then(async (response) => {
        if (response.data == null) {
          setSocialLoading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setSocialLoading(false);
          setIcons(response.data.data);
          setField('');
          setAction('');
          modalizeRef.current?.close();
          getProfile();
        } else {
          setSocialLoading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setSocialLoading(false);
        showAlert(error.message);
      });
  };
  const updateSocialAccount = async (data) => {
    const user_id = await AsyncStorage.getItem('user_id');
    setSocialLoading(true);
    Webservice.post(APIURL.socialIcons, {
      user_id: user_id,
      id: data.icone_id,
      type: activeOptions,
      link: field,
    })
      .then(async (response) => {
        if (response.data == null) {
          setSocialLoading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setSocialLoading(false);
          setIcons(response.data.data);
          setAction('');
          setField('');
          modalizeRef.current?.close();
          getProfile();
        } else {
          setSocialLoading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setSocialLoading(false);
        showAlert(error.message);
      });
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
          setIcons(response.data.data);
          setAction('');
          setField('');
          modalizeRef.current?.close();
          getProfile();
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

  return (
    <Block linear>
      <SafeAreaView />
      {renderHeader()}

      {strictValidObjectWithKeys(profile) && renderProfile()}

      <Block
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        padding={[hp(2), wp(2)]}
        color="#F2EDFA">
        <Text grey regular size={16} center>
          Swipe to choose a type of account{' '}
        </Text>
        {renderOptions()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          bounces={false}>
          <Block flex={false}>
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
      </Block>
      <Modalize
        adjustToContentHeight={action === 'add_account' ? !toggle : toggle}
        tapGestureEnabled={false}
        modalStyle={[
          {backgroundColor: '#F2F0F7'},
          // action === 'add_account' ? {flexGrow: 1} : {flexGrow: 0},
        ]}
        scrollViewProps={{
          scrollEnabled: true,
          showsVerticalScrollIndicator: false,
          contentContainerStyle: {
            paddingBottom: hp(3),
          },
        }}
        ref={modalizeRef}
        onClose={() => {
          setNewState({});
          setField('');
        }}
        handleStyle={{backgroundColor: '#6B37C3', marginTop: hp(1)}}
        handlePosition="inside">
        {action === 'add_account' && (
          <>
            <CustomButton
              onPress={() => {
                modalizeRef.current?.close();
                setAction('');
              }}
              margin={[hp(4), wp(3), 0]}
              flex={false}
              style={{alignSelf: 'flex-end'}}>
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
                  name={'close_icon'}
                  color={light.purple}
                />
              </NeuView>
            </CustomButton>
            {AddSocialIcons()}
          </>
        )}
        {action === 'select_account' && (
          <>
            <Block margin={[hp(4), 0]} flex={false} center>
              <ImageComponent
                isURL
                name={`${APIURL.iconUrl}${newState.url}`}
                height={95}
                width={95}
              />
              <Text capitalize purple semibold margin={[hp(1), 0]}>
                {newState.name}
              </Text>
              <Block flex={false} margin={[hp(2), 0, 0]}>
                <NeoInputField
                  placeholder={`${newState.name} account`}
                  fontColor="#707070"
                  icon=""
                  width={70}
                  onChangeText={(a) => setField(a)}
                  value={field}
                />
                <Block flex={false} margin={[hp(2), 0, 0]} />
                <Button
                  disabled={!field}
                  isLoading={socialLoading}
                  onPress={() => saveSocialAccount(newState)}
                  linear
                  color="primary">
                  Save
                </Button>
              </Block>
            </Block>
          </>
        )}
        {action === 'open_link' && (
          <>
            <TouchableOpacity
              onPress={() => {
                modalizeRef.current?.close();
                setNewState({});
                setField('');
              }}>
              <Block flex={false} right margin={[hp(2), wp(3), 0, 0]}>
                <ImageComponent
                  color="#ED5E69"
                  name={'cancel_icon'}
                  height={20}
                  width={20}
                />
              </Block>
            </TouchableOpacity>
            <Block margin={[hp(2), 0]} flex={false} center>
              {strictValidObjectWithKeys(newState.icone) && (
                <ImageComponent
                  isURL
                  name={`${APIURL.iconUrl}${newState.icone.url}`}
                  height={95}
                  width={95}
                />
              )}
              {strictValidObjectWithKeys(newState.icone) && (
                <Text capitalize purple semibold margin={[hp(1), 0]}>
                  {newState.icone.name}
                </Text>
              )}
              <Block flex={false} margin={[hp(2), 0, 0]}>
                {strictValidObjectWithKeys(newState.icone) && (
                  <NeoInputField
                    placeholder={`${newState.icone.name} account`}
                    fontColor="#707070"
                    icon=""
                    width={70}
                    onChangeText={(a) => setField(a)}
                    value={field}
                  />
                )}
                <Block flex={false} margin={[hp(2), 0, 0]}>
                  <Button
                    // style={{width: wp(32)}}
                    linear
                    onPress={() =>
                      OpenLinks(newState.icone.name, newState.username)
                    }
                    color="primary">
                    Open Link
                  </Button>
                </Block>
                <Button
                  disabled={!field}
                  isLoading={socialLoading}
                  onPress={() => updateSocialAccount(newState)}
                  linear
                  color="primary">
                  Update Account
                </Button>
              </Block>
            </Block>
          </>
        )}
      </Modalize>
      {loading || socialLoading ? <LoadingView /> : null}
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: hp(3),
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
    alignItems: 'center',
  },
  neoContainer: {
    flexDirection: 'row',
  },
  bgImage: {
    height: Platform.OS === 'ios' ? hp(8) : 67,
    width: Platform.OS === 'ios' ? hp(8) : 67,
  },
  pro: {position: 'absolute', right: -10, top: -15, zIndex: 99},
  socialIcons: {
    flexGrow: 1,
    paddingHorizontal: wp(1),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
export default Profile;
