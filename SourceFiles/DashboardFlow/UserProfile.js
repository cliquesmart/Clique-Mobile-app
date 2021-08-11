import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  LogBox,
  Dimensions,
  Alert,
  PermissionsAndroid,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

//Constants
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {ConstantKeys} from '../Constants/ConstantKey';
import {SetFontSize} from '../Constants/FontSize';
import LoadingView from '../Constants/LoadingView';
import Webservice from '../Constants/API';
import {APIURL} from '../Constants/APIURL';
import ValidationMsg from '../Constants/ValidationMsg';

//Third Party
import {DrawerActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {CommonActions} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import {Neomorph, Shadow, NeomorphFlex} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';
import {Block, Button, ImageComponent, Text} from '../components';
import {
  strictValidArray,
  strictValidObjectWithKeys,
  strictValidString,
} from '../utils/commonUtils';
import {hp, wp} from '../components/responsive';
import NeuView from '../common/neu-element/lib/NeuView';
import {OpenLinks} from '../utils/mobile-utils';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props');
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
    };
  }

  componentDidMount() {
    this.API_USERDETAILS(true);
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);

        await this.setState({
          userData: userData,
          user: userData.user,
          is_temp: userData.user.is_temp,
        });

        this.API_USERDETAILS(true);
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

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
    const user_id = await AsyncStorage.getItem('user_id');
    this.setState({isloading: isload});

    Webservice.post(APIURL.usersDetails, {
      user_id: this.state.profileID,
      login_id: user_id,
    })
      .then((response) => {
        console.log(response, 'response', 'response');
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});
        console.log('Get User Detail Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          var userData = response.data.data;
          var user = response.data.data.user;
          this.setState({profileData: user, isContact: userData.is_contact});

          console.log('is Contact : ' + JSON.stringify(userData.is_contact));
          var social_data = userData.user.social_data;

          var social = [];
          var music = [];
          var payment = [];
          var externalLink = [];
          var company = userData.user.company_data;

          for (var i = 0; i < social_data.length; i++) {
            var item = social_data[i];

            if (item.media_value != '') {
              if (item.media_type == 'music') {
                music.push(item);
              } else if (item.media_type == 'payment') {
                payment.push(item);
              } else if (item.media_type == 'externalLink') {
                externalLink.push(item);
              } else if (
                item.media_type != 'externalLink' &&
                item.media_type != 'payment' &&
                item.media_type != 'music'
              ) {
                social.push(item);
              } else {
              }
            } else {
            }
          }

          this.setState({
            SocialData: social,
            MusicData: music,
            CompanyData: company,
            PaymentData: payment,
            ExternalLinkData: externalLink,
          });
        } else {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
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
        console.log('Get Add Contact Response : ' + JSON.stringify(response));

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
    const user_id = await AsyncStorage.getItem('user_id');
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
        console.log(error.message);
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

  //For Tap Social Media Details & Linking
  SocialTap = (item) => {
    requestAnimationFrame(() => {
      if (
        item.media_type == 'homeNumber' ||
        item.media_type == 'workNumber' ||
        item.media_type == 'otherNumber'
      ) {
        Linking.openURL(`tel:${item.media_value}`);
      } else if (item.media_type == 'socialMail') {
        Linking.openURL(`mailto:${item.media_value}`);
      } else if (item.media_type == 'instagram') {
        Linking.openURL(`instagram://user?username=${item.media_value}`).catch(
          () => {
            Linking.openURL('https://www.instagram.com/' + item.media_value);
          },
        );
      } else if (item.media_type == 'facebook') {
        Linking.openURL(`fb://profile/${item.media_value}`).catch(() => {
          Linking.openURL('https://www.facebook.com/' + item.media_value);
        });
      } else if (item.media_type == 'youtube') {
        Linking.openURL(`vnd.youtube://${item.media_value}`).catch(() => {
          Linking.openURL('https://www.youtube.com/' + item.media_value);
        });
      } else if (item.media_type == 'linkdin') {
        Linking.openURL(`linkedin://profile?id=${item.media_value}`).catch(
          () => {
            Linking.openURL('https://www.linkedin.com/in/' + item.media_value);
          },
        );
      } else if (item.media_type == 'twitter') {
        Linking.openURL('twitter://user?screen_name=' + item.media_value).catch(
          () => {
            Linking.openURL('https://www.twitter.com/' + item.media_value);
          },
        );
      } else {
        Linking.openURL('http://' + item.media_value);
      }
    });
  };

  //For Tap Music Details & Linking
  MusicTap = (item) => {
    requestAnimationFrame(() => {
      Linking.canOpenURL(item.media_value).then((supported) => {
        if (supported) {
          Linking.openURL(item.media_value);
        } else {
          console.log("Don't know how to open URI: " + item.media_value);
        }
      });
    });
  };

  //For Tap External Links & open in Browser
  ExternalLinkTap = (item) => {
    requestAnimationFrame(() => {
      Linking.canOpenURL(item.media_value).then((supported) => {
        if (supported) {
          Linking.openURL(item.media_value);
        } else {
          console.log("Don't know how to open URI: " + item.media_value);
        }
      });
    });
  };

  //For Copy Text From Long Press
  CopyTextToClipBoard = (item) => {
    requestAnimationFrame(() => {
      Clipboard.setString(item.media_value);
      this.showAlert('Coppied!');
    });
  };

  renderImage(item) {
    if (item.media_type == 'website') {
      return IMG.OtherFlow.WebIcon;
    } else if (item.media_type == 'socialMail') {
      return IMG.OtherFlow.SocialMailIcon;
    } else if (item.media_type == 'instagram') {
      return IMG.OtherFlow.InstaIcon;
    } else if (item.media_type == 'facebook') {
      return IMG.OtherFlow.FacebookIcon;
    } else if (item.media_type == 'twitter') {
      return IMG.OtherFlow.TwitterIcon;
    } else if (item.media_type == 'youtube') {
      return IMG.OtherFlow.YoutubeIcon;
    } else if (item.media_type == 'linkdin') {
      return IMG.OtherFlow.LinkdInIcon;
    } else {
      return IMG.OtherFlow.CallIcon;
    }
  }

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
                numberOfLines={2}
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
          console.log('Unsupported url: ' + url);
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
    console.log(url, name);
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
    console.log(data, 'data');
    return (
      <FlatList
        contentContainerStyle={styles.socialIcons}
        numColumns={4}
        bounces={false}
        data={data}
        renderItem={({item}) => {
          console.log(item);
          return (
            <>
              <TouchableOpacity
                onPress={() => OpenLinks(item.icone.name, item.username)}
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

  render() {
    const {profileData} = this.state;
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
            {!this.state.isloading && (
              <>
                {this.state.isContact === 0 ? (
                  <Button
                    onPress={() => this.btnAddContactTap()}
                    color="primary"
                    linear>
                    Request for Connection
                  </Button>
                ) : (
                  <Button
                    onPress={() => this.btnRemoveContactTap()}
                    color="primary"
                    linear>
                    Remove from Connection
                  </Button>
                )}
              </>
            )}
            <Block flex={false}>
              {strictValidObjectWithKeys(profileData) &&
                strictValidArray(profileData.social_data) &&
                this.renderSocialIcons(profileData.social, 'social')}
            </Block>
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
});
