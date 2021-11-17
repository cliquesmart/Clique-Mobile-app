import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

//Constants
import {CommonColors} from '../../Constants/ColorConstant';
import {ConstantKeys} from '../../Constants/ConstantKey';
import {SetFontSize} from '../../Constants/FontSize';
import LoadingView from '../../Constants/LoadingView';
import Webservice from '../../Constants/API';
import {APIURL} from '../../Constants/APIURL';
import ValidationMsg from '../../Constants/ValidationMsg';

//Third Party
import Snackbar from 'react-native-snackbar';
import Clipboard from '@react-native-clipboard/clipboard';
import {Block, Button, ImageComponent, Text} from '../../components';
import {
  strictValidArray,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {hp, wp} from '../../components/responsive';
import NeuView from '../../common/neu-element/lib/NeuView';
import {OpenLinks} from '../../utils/mobile-utils';
import {light} from '../../components/theme/colors';
import NeuButton from '../../common/neu-element/lib/NeuButton';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},
      profileID: props.route.params.profile_id,
      isContact: 0,
      profileData: null,

      SocialData: [],
      MusicData: [],
      CompanyData: [],
      PaymentData: [],
      ExternalLinkData: [],
      activeOptions: 'social',
    };
  }

  componentDidMount() {
    this.API_USERDETAILS(true);
  }

  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  // API Get Country
  API_USERDETAILS = async (isload) => {
    this.setState({isloading: isload});

    Webservice.post(APIURL.usersDetails, {
      user_id: this.state.profileID,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          this.showAlert(response.originalError.message);
          return;
        }
        this.setState({isloading: false});

        if (response.data.status === true) {
          console.log(response.data.data, 'response.data.data');
          var userData = response.data.data;
          var user = response.data.data.user;
          this.setState({profileData: user, isContact: userData.is_contact});
        } else {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        this.setState({isloading: false});
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                this.API_USERDETAILS(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  // API Add Constact
  API_ADD_CONTACT = async (isload, contact_id) => {
    this.setState({isloading: isload});

    Webservice.post(APIURL.addContact, {
      contact_id: contact_id,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});

        if (response.data.status === true) {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
          this.props.navigation.goBack();
        } else {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({isloading: false});
      });
  };

  API_REMOVE_CONTACT = async (isload, contact_id) => {
    this.setState({isloading: isload});
    Webservice.post(APIURL.removeContact, {
      action: 'remove',
      contact_id: contact_id,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);

        console.log(
          'Get Remove Contact Response : ' + JSON.stringify(response.data),
        );

        if (response.data.status) {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
          this.props.navigation.goBack();
        } else {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        this.setState({isloading: false});
      });
  };

  //Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  btnAddContactTap = () => {
    requestAnimationFrame(() => {
      Alert.alert(
        ValidationMsg.AppName,
        'Are you sure you add this contact?',
        [
          {
            text: 'Yes',
            onPress: () => {
              this.API_ADD_CONTACT(false, this.state.profileID);
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

  btnRemoveContactTap = () => {
    requestAnimationFrame(() => {
      Alert.alert(
        ValidationMsg.AppName,
        'Are you sure you remove this contact?',
        [
          {
            text: 'Yes',
            onPress: () => {
              this.API_REMOVE_CONTACT(false, this.state.profileID);
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

  //For Copy Text From Long Press
  CopyTextToClipBoard = (item) => {
    requestAnimationFrame(() => {
      Clipboard.setString(item.media_value);
      this.showAlert('Coppied!');
    });
  };

  renderHeader = () => {
    return (
      <Block center padding={[hp(2), wp(3)]} space="between" flex={false} row>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <NeuView
            concave
            color={'#775DF2'}
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#775DF2', '#5A28AE']}>
            <ImageComponent
              resizeMode="contain"
              height={14}
              width={14}
              name={'BackIcon'}
              color="#F2EDFA"
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };
  renderProfile = () => {
    return (
      <Block margin={[0, wp(3), hp(2)]} center flex={false} row>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('PreviewProfile', {
              profile: this.state.profileData,
            });
          }}>
          {strictValidObjectWithKeys(this.state.profileData) &&
            strictValidString(this.state.profileData.avatar) && (
              <Block
                flex={false}
                borderWidth={3}
                borderRadius={80}
                borderColor={'#fff'}>
                <ImageComponent
                  isURL
                  name={`${APIURL.ImageUrl}${this.state.profileData.avatar}`}
                  height={80}
                  width={80}
                  radius={80}
                />
              </Block>
            )}
        </TouchableOpacity>
        <Block margin={[0, 0, 0, wp(3)]} flex={false}>
          <Text capitalize white bold size={24}>
            {strictValidObjectWithKeys(this.state.profileData) &&
              this.state.profileData.name}
          </Text>
          {strictValidObjectWithKeys(this.state.profileData) &&
            strictValidString(this.state.profileData.bio) && (
              <Text
                style={{width: wp(55)}}
                capitalize
                margin={[hp(0.5), 0, 0]}
                size={14}
                white
                numberOfLines={3}
                regular>
                {this.state.profileData.bio}
              </Text>
            )}
        </Block>
      </Block>
    );
  };
  openPhoneNumber = async (phone) => {
    let phoneNumber = '';
    const replacePhone = phone.replace('tel:', '');
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${replacePhone}`;
    } else {
      phoneNumber = `telprompt:${replacePhone}`;
    }

    Linking.openURL(phoneNumber);
  };

  openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  openMessages = async (phone) => {
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${phone}${separator}body=${'Hi'}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  openFacebook = (url) => {
    return Linking.openURL(`fb://profile/${url}`).catch(() => {
      Linking.openURL('https://www.facebook.com/' + url);
    });
  };

  openLink = async (url, name) => {
    // Checking if the link is supported for links with custom URL scheme.
    switch (name) {
      case 'Phone':
        return this.openPhoneNumber(url);
      case 'Messages':
        return this.openMessages(url);
      default:
        return this.openUrl(url, name);
    }
  };
  renderSocialIcons = (data, type) => {
    return (
      <FlatList
        contentContainerStyle={styles.socialIcons}
        numColumns={4}
        bounces={false}
        data={data}
        renderItem={({item}) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => OpenLinks(item.icone.name, item.username)}
                style={{paddingHorizontal: wp(1), marginTop: hp(2)}}>
                {strictValidObjectWithKeys(item.icone) && (
                  <ImageComponent
                    isURL
                    name={`${APIURL.iconUrl}${item.icone.url}`}
                    height={Platform.OS === 'ios' ? hp(10) : 67}
                    width={Platform.OS === 'ios' ? hp(10) : 67}
                  />
                )}
              </TouchableOpacity>
            </>
          );
        }}
      />
    );
  };

  setActiveState = (val) => {
    this.setState({
      activeOptions: val,
    });
  };

  renderOptions = () => {
    const {activeOptions} = this.state;
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
              onPress={() => this.setActiveState('social')}
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
                onPress={() => this.setActiveState('business')}
                purple
                center
                size={13}>
                Business
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText]}
              onPress={() => this.setActiveState('business')}
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

  render() {
    const {profileData, activeOptions} = this.state;
    return (
      <Block linear>
        <SafeAreaView />
        {this.renderHeader()}
        {this.renderProfile()}
        <Block
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          padding={[hp(2), wp(2)]}
          color="#F2EDFA">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            bounces={false}>
            <Text margin={[hp(1), 0]} grey regular size={16} center>
              {strictValidObjectWithKeys(this.state.profileData) &&
                `${this.state.profileData.name}'s${' Contacts:'}`}
            </Text>
            {strictValidObjectWithKeys(profileData) &&
              strictValidObjectWithKeys(profileData.my_connection) &&
              profileData.my_connection.type === 'public' &&
              !this.state.isloading && (
                <>
                  {profileData.my_connection.status === 'request' && (
                    <Button
                      onPress={() => this.btnAddContactTap()}
                      color="primary"
                      linear>
                      Request for Connection
                    </Button>
                  )}
                  {profileData.my_connection.status === 'approve' && (
                    <Button
                      onPress={() => this.btnRemoveContactTap()}
                      color="primary"
                      linear>
                      Remove from Connection
                    </Button>
                  )}
                  {profileData.my_connection.status === 'pending' && (
                    <Button activeOpacity={1} color="primary" linear>
                      Pending
                    </Button>
                  )}
                </>
              )}
            {strictValidObjectWithKeys(profileData) &&
            profileData.account_flag === 'social' ? (
              <Block flex={false}>
                {strictValidObjectWithKeys(profileData) &&
                  strictValidObjectWithKeys(profileData.my_connection) &&
                  (profileData.my_connection.status === 'approve' ||
                    profileData.my_connection.type === 'private') &&
                  strictValidObjectWithKeys(profileData) &&
                  strictValidArray(profileData.social) &&
                  this.renderSocialIcons(profileData.social, 'social')}
              </Block>
            ) : (
              <Block flex={false}>
                {strictValidObjectWithKeys(profileData) &&
                  strictValidObjectWithKeys(profileData.my_connection) &&
                  (profileData.my_connection.status === 'approve' ||
                    profileData.my_connection.type === 'private') &&
                  strictValidObjectWithKeys(profileData) &&
                  strictValidArray(profileData.business) &&
                  this.renderSocialIcons(profileData.business, 'business')}
              </Block>
            )}

            {strictValidObjectWithKeys(profileData) &&
              strictValidObjectWithKeys(profileData.my_connection) &&
              profileData.my_connection.status !== 'approve' &&
              profileData.my_connection.type !== 'private' && (
                <Block style={{flexGrow: 1}} center middle>
                  <ImageComponent
                    name={'lock_icon'}
                    height={80}
                    width={80}
                    color={light.subtitleColor}
                  />
                  <Text margin={[hp(2), 0, 0]} grey semibold>
                    This account is Private
                  </Text>
                  <Text grey semibold>
                    Request to see their Account
                  </Text>
                </Block>
              )}
          </ScrollView>
        </Block>
        {this.state.isloading ? <LoadingView /> : null}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headerView: {
    height: 74,
    width: '100%',
    backgroundColor: CommonColors.appBarColor,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    flex: 1,
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    textAlign: 'center',
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  inactiveText: {
    width: wp(20),
  },
  neoContainer: {
    flexDirection: 'row',
  },
});
