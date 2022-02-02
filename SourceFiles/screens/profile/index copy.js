/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SectionList,
  Share,
} from 'react-native';
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
import {OpenLinks, showAlert, viewFile} from '../../utils/mobile-utils';
import LoadingView from '../../Constants/LoadingView';
import {
  strictValidArray,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {t2} from '../../components/theme/fontsize';
import {profileRequest} from './action';
import {useDispatch} from 'react-redux';
import Neomorph from '../../common/shadow-src/Neomorph';
import {CommonColors} from '../../Constants/ColorConstant';
import DocumentPicker from 'react-native-document-picker';
import UploadFile from '../../components/upload-file';
import {styles} from './profile-style';

const Profile = () => {
  const {navigate} = useNavigation();
  const [activeOptions, setactiveOptions] = useState('social');
  const [toggle, setToggle] = useState(true);
  const [action, setAction] = useState(null);
  const modalizeRef = useRef();
  const [profile, setprofile] = useState({});
  const [loading, setloading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [Icons, setIcons] = useState([]);
  const [newState, setNewState] = useState({});
  const [field, setField] = useState('');
  const [more, setMore] = useState({});
  const dispatch = useDispatch();
  const [file, setFile] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const updateTypeOfAccount = async () => {
    const val = (await AsyncStorage.getItem('flag')) || profile.account_flag;
    setactiveOptions(val);
  };

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      callProfile();
    }, []),
  );
  useFocusEffect(
    React.useCallback(() => {
      updateTypeOfAccount();
    }, [profile]),
  );

  const callProfile = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    dispatch(profileRequest(user_id));
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
          await AsyncStorage.setItem(
            'flag',
            response.data.data.user.account_flag,
          );
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
                callProfile();
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
      deviceType: Platform.OS === 'ios' ? 'I' : 'A',
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

  const openPreview = () => {
    if (strictValidObjectWithKeys(profile.activeAccount)) {
      if (profile.activeAccount.icone.name === 'File') {
        viewFile(
          profile.activeAccount.username,
          profile.activeAccount.username.substring(14),
        );
      } else {
        OpenLinks(
          profile.activeAccount.icone.name,
          profile.activeAccount.username,
        );
      }
    } else {
      navigate('ViewProfile', {
        data: profile,
      });
    }
  };
  const renderHeader = () => {
    return (
      <Block
        center
        padding={[hp(2), wp(3), 0]}
        space="between"
        flex={false}
        row>
        <TouchableOpacity onPress={() => openPreview()}>
          <NeuView
            concave
            color={'#775DF2'}
            width={70}
            height={40}
            borderRadius={20}
            customGradient={['#5542B6', '#7653DB']}>
            <Text semibold white size={12}>
              Preview
            </Text>
          </NeuView>
        </TouchableOpacity>
        <Block flex={false} margin={[0, wp(4), 0, 0]}>
          <ImageComponent
            resizeMode="contain"
            height={55}
            width={159}
            name={'nameBg'}
          />
        </Block>
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

  const onShare = async () => {
    if (profile.is_card_assign === 0) {
      Alert.alert(
        'Info Message',
        'Please proceed to buy the clique product',
        [
          {text: 'Cancel', style: 'destructive'},
          {
            text: 'Buy Now',
            onPress: () => {
              Linking.openURL('https://cliquesocial.co/');
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      const user_id = await AsyncStorage.getItem('custom_id');
      let url = 'http://admin.cliquesocial.co/user/profile/' + user_id;
      try {
        const result = await Share.share({
          message: 'My Clique Profile ' + url,
          // url: url,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
            console.log(result, 'result');
          } else {
            console.log(result, 'result');
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const renderProfile = () => {
    return (
      <Block padding={[hp(2), wp(3)]} space="between" flex={false} row>
        <Block center flex={false} row>
          {strictValidObjectWithKeys(profile) &&
          strictValidString(profile.avatar) ? (
            <CustomButton
              onPress={() => {
                navigate('PreviewProfile', {
                  profile: profile,
                });
              }}
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
            </CustomButton>
          ) : (
            <ImageComponent name="demouser" height={100} width={100} />
          )}
          <Block style={{width: wp(55)}} margin={[0, 0, 0, wp(3)]} flex={false}>
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
                  regular>
                  {profile.bio}
                </Text>
              )}
            <Text
              onPress={() => navigate('Chat')}
              margin={[hp(0.5), 0, 0]}
              size={16}
              semibold
              white>
              {profile.my_connections} Connections
            </Text>
          </Block>
        </Block>
        <Block flex={false} right>
          <TouchableOpacity
            onPress={() => {
              navigate('EditProfile', {
                profile: profile,
              });
            }}>
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
          <TouchableOpacity
            onPress={() => onShare()}
            style={{marginTop: hp(2)}}>
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
  const activeFlagValue = async (type) => {
    // setloading(true);
    Webservice.post(APIURL.flagValue, {
      flag: type,
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
          showAlert(response.data.message);
          setactiveOptions(type);
          await AsyncStorage.setItem('flag', type);
          callProfile();
          // getProfile();
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        showAlert(error.message);
      });
  };
  const renderOptions = () => {
    return (
      <Block middle center margin={[hp(2), 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(66)}
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
              onPress={() => activeFlagValue('social')}
              grey
              regular
              center
              size={13}>
              Social
            </Text>
          )}
          {activeOptions === 'business' ? (
            <NeuButton
              onPress={() => activeFlagValue('business')}
              color="#F2F0F7"
              width={wp(20)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text semibold purple center size={13}>
                Business
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText]}
              onPress={() => activeFlagValue('business')}
              grey
              regular
              center
              size={13}>
              Business
            </Text>
          )}
          {activeOptions === 'hospital' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(20)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                Hospital
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(1)}]}
              onPress={() => activeFlagValue('hospital')}
              grey
              regular
              center
              size={13}>
              Hospital
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
        style={{marginHorizontal: wp(1.5), marginTop: hp(2.5)}}>
        <ImageComponent name="add_icon" height={25} width={25} />
      </NeuButton>
    );
  };

  const activeSocialAndBusinessIcon = async (values, flagValue) => {
    setloading(true);
    Webservice.post(APIURL.ActiveSocialAccount, {
      id: values,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          // setloading(false);
          getProfile();
          callProfile();
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        Alert.alert(error.message, '', {cancelable: false});
      });
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
                disabled={item.fade_out === 0}
                onLongPress={() =>
                  activeSocialAndBusinessIcon(item.id, item.fade_out)
                }
                onPress={() => {
                  modalizeRef.current?.open();
                  setAction('open_link');
                  setNewState(item);
                  setField(item.username);
                }}
                style={{
                  paddingHorizontal: wp(1),
                  marginTop: hp(2),
                }}>
                {strictValidObjectWithKeys(item.icone) && (
                  <ImageComponent
                    isURL
                    name={`${APIURL.iconUrl}${item.icone.url}`}
                    height={Platform.OS === 'ios' ? hp(10) : 88}
                    width={Platform.OS === 'ios' ? hp(10) : 88}
                    styles={item.fade_out === 1 ? {opacity: 1} : {opacity: 0.1}}
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
                        <ImageComponent
                          isURL
                          name={`${APIURL.iconUrl}${item.url}`}
                          height={68}
                          width={68}
                        />
                        {item.is_pro === '1' && (
                          <Block style={styles.pro}>
                            <ImageComponent
                              name={'pro_icon'}
                              height={40}
                              width={40}
                            />
                          </Block>
                        )}
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
      action: 'add',
      socialId: 0,
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
          setUploadedFiles({});
          setFile({});
          modalizeRef.current?.close();
          getProfile();
          callProfile();
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
      action: 'update',
      socialId: data.id,
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
          setFile({});
          setUploadedFiles({});
          modalizeRef.current?.close();
          getProfile();
          callProfile();
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
  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  const deleteMemberFromHospital = async (act, id) => {
    setloading(true);
    Webservice.post(APIURL.DeleteMember, {
      action: act,
      id: id,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          // setloading(false);
          getProfile();
          callProfile();
          showAlert(response.data.message);
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        showAlert(error.message);
      });
  };

  const deleteMemberAlert = (act, id) => {
    modalizeRef.current?.close();
    Alert.alert(
      'Info Message',
      'Are you sure you want to delete the member profile?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            deleteMemberFromHospital(act, id);
          },
        },
      ],
    );
  };
  const renderHospital = (data) => {
    return (
      <Block flex={false}>
        <FlatList
          data={data}
          contentContainerStyle={{paddingBottom: hp(2)}}
          renderItem={({item}) => {
            return (
              <CustomButton
                disabled={item.by_default === 1}
                onPress={() => deleteMemberFromHospital('default', item.id)}
                activeOpacity={0.8}
                flex={false}
                center>
                <Neomorph
                  style={[
                    styles.neoSubContainer,
                    item.by_default === 1 ? styles.activeHospital : {},
                  ]}>
                  <Block
                    space="between"
                    center
                    row
                    padding={[hp(2)]}
                    flex={false}>
                    <Block row flex={false}>
                      {strictValidString(item.photo) ? (
                        <ImageComponent
                          isURL={strictValidString(item.photo)}
                          name={
                            strictValidString(item.photo)
                              ? `${APIURL.ImageUrl}/${item.photo}`
                              : 'default_profile'
                          }
                          height={50}
                          width={50}
                          radius={50}
                        />
                      ) : (
                        <ImageComponent
                          name={'default_profile'}
                          height={50}
                          width={50}
                          radius={50}
                        />
                      )}
                      <Block
                        style={{width: wp(55)}}
                        margin={[0, 0, 0, wp(3)]}
                        flex={false}>
                        <Text capitalize semibold grey size={18}>
                          {item.start_name} {item.first_name} {item.last_name}
                        </Text>
                        <Text
                          capitalize
                          margin={[hp(0.8), 0, 0]}
                          regular
                          grey
                          size={14}>
                          {item.relation} | {getAge(item.date_of_birth)} Years
                          {item.by_default === 1 ? (
                            <Text
                              color={CommonColors.gradientEnd}
                              size={12}
                              semibold
                              margin={[0, 0, 0, wp(3)]}>
                              {'   '} Default
                            </Text>
                          ) : null}
                        </Text>
                      </Block>
                    </Block>
                    <Block flex={false}>
                      <TouchableOpacity
                        onPress={() => {
                          modalizeRef.current?.open();
                          setAction('more-option');
                          setMore(item);
                        }}>
                        <ImageComponent
                          name="more_icon"
                          height={20}
                          width={20}
                          color={CommonColors.gradientEnd}
                        />
                      </TouchableOpacity>
                    </Block>
                  </Block>
                </Neomorph>
              </CustomButton>
            );
          }}
        />
        <Block padding={[0, wp(3)]}>
          <Button
            onPress={() => {
              navigate('AddFamilyMember', {
                profile: profile,
              });
            }}
            size={14}
            style={{width: wp(40)}}
            color="primary"
            linear>
            Add Family Member
          </Button>
        </Block>
      </Block>
    );
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
            {strictValidObjectWithKeys(profile) &&
              strictValidArray(profile.hospital) &&
              activeOptions === 'hospital' &&
              renderHospital(profile.hospital)}
          </Block>
        </ScrollView>
      </Block>
      <Modalize
        adjustToContentHeight={action === 'add_account' ? !toggle : toggle}
        overlayStyle={styles.overlayStyle}
        tapGestureEnabled={false}
        modalStyle={styles.modalStyle}
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
          setUploadedFiles({});
        }}
        handleStyle={styles.handleStyle}
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
              style={styles.flexEnd}
            />
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
                {newState.name === 'File' ? (
                  <>
                    <NeuButton
                      onPress={async () => {
                        try {
                          const res = await DocumentPicker.pick({
                            type: [
                              DocumentPicker.types.csv,
                              DocumentPicker.types.doc,
                              DocumentPicker.types.docx,
                              DocumentPicker.types.images,
                              DocumentPicker.types.pdf,
                              DocumentPicker.types.ppt,
                              DocumentPicker.types.pptx,
                              DocumentPicker.types.xls,
                              DocumentPicker.types.xlsx,
                            ],
                          });
                          setFile(res);
                        } catch (err) {
                          if (DocumentPicker.isCancel(err)) {
                            // User cancelled the picker, exit any dialogs or menus and move on
                          } else {
                            throw err;
                          }
                        }
                      }}
                      color="#eef2f9"
                      width={wp(80)}
                      height={hp(5)}
                      containerStyle={styles.buttonStyle}
                      borderRadius={16}>
                      <Text
                        capitalize
                        grey={!strictValidObjectWithKeys(uploadedFiles)}
                        black={strictValidObjectWithKeys(uploadedFiles)}
                        size={14}>
                        {strictValidObjectWithKeys(uploadedFiles)
                          ? uploadedFiles.name
                          : 'Upload Files'}
                      </Text>
                      <Block flex={false} margin={[0, wp(2), 0, 0]}>
                        <ImageComponent
                          name="down_arrow_icon"
                          height={10}
                          width={16}
                        />
                      </Block>
                    </NeuButton>
                    <UploadFile
                      file={file}
                      onProgressChange={(v) => console.log(v)}
                      onUploadComplete={(data) => {
                        setUploadedFiles(file);
                        setField(data.uplod_file);
                      }}
                    />
                  </>
                ) : (
                  <NeoInputField
                    placeholder={`${newState.name} account`}
                    fontColor="#707070"
                    icon=""
                    width={70}
                    onChangeText={(a) => setField(a)}
                    value={field}
                  />
                )}
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
        {action === 'more-option' && (
          <Block
            flex={false}
            margin={[hp(1), 0, 0]}
            padding={[hp(4), 0, hp(2)]}>
            <Text semibold purple margin={[0, 0, hp(2)]} size={16} center>
              Select Action
            </Text>
            <Block flex={false} margin={[hp(1), 0, 0]} center>
              <NeuButton
                onPress={() => {
                  modalizeRef.current?.close();
                  navigate('AddFamilyMember', {
                    item: more,
                  });
                }}
                color="#eef2f9"
                width={wp(90)}
                height={hp(5)}
                // containerStyle={styles.buttonStyle}
                borderRadius={16}>
                <Text grey size={14}>
                  Edit Profile
                </Text>
              </NeuButton>
            </Block>
            <Block center flex={false} margin={[hp(2), 0, 0]}>
              <NeuButton
                onPress={() => {
                  deleteMemberAlert('delete', more.id);
                }}
                color="#EC5F5F"
                width={wp(90)}
                height={hp(5)}
                noShadow
                borderRadius={16}>
                <Text white size={14}>
                  Delete Member
                </Text>
              </NeuButton>
            </Block>
          </Block>
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
                {strictValidObjectWithKeys(newState.icone) &&
                newState.icone.name === 'File' ? (
                  <>
                    <NeuButton
                      onPress={async () => {
                        try {
                          const res = await DocumentPicker.pick({
                            type: [
                              DocumentPicker.types.csv,
                              DocumentPicker.types.doc,
                              DocumentPicker.types.docx,
                              DocumentPicker.types.images,
                              DocumentPicker.types.pdf,
                              DocumentPicker.types.ppt,
                              DocumentPicker.types.pptx,
                              DocumentPicker.types.xls,
                              DocumentPicker.types.xlsx,
                            ],
                          });
                          setFile(res);
                        } catch (err) {
                          if (DocumentPicker.isCancel(err)) {
                            // User cancelled the picker, exit any dialogs or menus and move on
                          } else {
                            throw err;
                          }
                        }
                      }}
                      color="#eef2f9"
                      width={wp(80)}
                      height={hp(5)}
                      containerStyle={styles.buttonStyle}
                      borderRadius={16}>
                      <Text
                        capitalize
                        grey={!strictValidObjectWithKeys(uploadedFiles)}
                        black={strictValidObjectWithKeys(uploadedFiles)}
                        size={14}>
                        {strictValidObjectWithKeys(uploadedFiles)
                          ? uploadedFiles.name
                          : strictValidString(field)
                          ? field.substring(14)
                          : 'Upload Files'}
                      </Text>
                      <Block flex={false} margin={[0, wp(2), 0, 0]}>
                        <ImageComponent
                          name="down_arrow_icon"
                          height={10}
                          width={16}
                        />
                      </Block>
                    </NeuButton>
                    <UploadFile
                      file={file}
                      onProgressChange={(v) => console.log(v)}
                      onUploadComplete={(data) => {
                        setUploadedFiles(file);
                        setField(data.uplod_file);
                      }}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}

                {strictValidObjectWithKeys(newState.icone) &&
                newState.icone.name === 'File' ? (
                  <>
                    <Block flex={false} margin={[hp(2), 0, 0]}>
                      <Button
                        // style={{width: wp(32)}}
                        linear
                        onPress={() => viewFile(field, field.substring(14))}
                        color="primary">
                        Download
                      </Button>
                    </Block>
                    <Button
                      disabled={!field}
                      isLoading={socialLoading}
                      onPress={() => updateSocialAccount(newState)}
                      linear
                      color="primary">
                      Update File
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </Block>
            </Block>
          </>
        )}
      </Modalize>
      {loading || socialLoading ? <LoadingView /> : null}
    </Block>
  );
};
export default Profile;
