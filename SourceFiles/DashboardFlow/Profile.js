import React, {Component} from 'react';
import {
  View,
  Text,
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

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: null,

      SocialData: [],
      MusicData: [],
      CompanyData: [],
      PaymentData: [],
      ExternalLinkData: [],

      is_temp: 0,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      // do something
      this.setState({isloading: true});
      await this.getData();
    });

    // this.focusListener = this.props.navigation.addListener('focus',
    // async ()  => await this.getData() )
  }

  componentWillUnmount() {
    // Remove the event listener
    // this.focusListener.remove();

    this.focusListener();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);
        var user = userData.user;

        console.log('User Data: ' + user);

        this.setState({
          userData: userData,
          user: userData.user,
          is_temp: user.is_temp,
        });

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
        this.setState({isloading: false});
      } else {
        this.setState({isloading: false});
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      this.setState({isloading: false});
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

  async goToLogin() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }

    const props = this.props;
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
            state: {
              routes: [{name: 'Login'}],
            },
          },
        ],
      }),
    );
  }

  btnTempProfileTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('TempProfile');
    });
  };

  btnSignOutTap = () => {
    requestAnimationFrame(() => {
      Alert.alert(
        ValidationMsg.AppName,
        'Are you sure you want to logout?',
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              // this.focusListener.remove();
              this.goToLogin();
            },
          },
        ],
        {cancelable: true},
      );
    });
  };

  btnEditTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('EditProfile');
    });
  };

  btnPurchaseTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('PurchaseCard');
    });
  };

  btnSyncToCardTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('SyncToCard');
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

  render() {
    let SettingIcon = IMG.OtherFlow.SettingIcon;
    let BusinessIcon = IMG.OtherFlow.BusinessIcon;
    let SocialIcon = IMG.OtherFlow.SocialIcon;
    let MusicIcon = IMG.OtherFlow.MusicIcon;
    let PaymentIcon = IMG.OtherFlow.PaymentIcon;
    let ExternalLinkIcon = IMG.OtherFlow.ExternalLinkIcon;
    let EditIcon = IMG.OtherFlow.EditIcon;
    let SyncIcon = IMG.OtherFlow.SyncIcon;

    let CallIcon = IMG.OtherFlow.CallIcon;
    let SocialMailIcon = IMG.OtherFlow.SocialMailIcon;
    let RightArrowIcon = IMG.OtherFlow.RightArrowIcon;
    let SpotifyIcon = IMG.OtherFlow.SpotifyIcon;
    let PayIcon = IMG.OtherFlow.PayIcon;
    let LinkIcon = IMG.OtherFlow.LinkIcon;
    let QRIcon = IMG.OtherFlow.QRIcon;

    return (
      <>
        <SafeAreaView
          style={{flex: 0, backgroundColor: CommonColors.appBarColor}}
        />

        <StatusBar
          barStyle={'light-content'}
          backgroundColor={CommonColors.appBarColor}
        />
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1, backgroundColor: CommonColors.primaryColor}}>
            <View style={styles.headerView}>
              <View
                style={{
                  flex: 0.3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />

              <View
                style={{
                  flex: 0.4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.headerText}>My Profile</Text>
              </View>

              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  style={{marginRight: 20}}
                  onPress={() => this.btnSyncToCardTap()}>
                  <Text
                    style={{
                      fontSize: SetFontSize.ts12,
                      color: CommonColors.arrowColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    Sync To Card
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flex: 1}}>
              {this.state.user != null ? (
                <ScrollView style={{flex: 1}} bounces={false}>
                  <View style={{width: '100%', height: 250}}>
                    <FastImage
                      source={{
                        uri: String(
                          this.state.userData.asset_url +
                            this.state.user.avatar,
                        ),
                      }}
                      style={{flex: 1}}
                      resizeMode={FastImage.resizeMode.cover}
                    />

                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: CommonColors.transprentDark,
                        bottom: 0,
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          marginRight: 20,
                          textAlign: 'left',
                          marginTop: 15,
                          fontSize: SetFontSize.ts25,
                          color: CommonColors.whiteColor,
                          fontFamily: ConstantKeys.Averta_BOLD,
                        }}>
                        {this.state.user.name}
                      </Text>

                      {this.state.user.bio != '' ? (
                        <Text
                          style={{
                            marginLeft: 20,
                            marginRight: 20,
                            textAlign: 'left',
                            marginTop: 5,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                            marginBottom: 10,
                          }}>
                          {this.state.user.bio}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                      height: 50,
                      borderColor: CommonColors.whiteColor,
                      borderWidth: 1.3,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => this.btnEditTap()}>
                    <Text
                      style={{
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Edit Profile
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 15,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      Linking.openURL(`tel:${this.state.user.mobile}`)
                    }>
                    <Image
                      style={{marginLeft: 10, height: 30, width: 30}}
                      source={CallIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.user.mobile}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 15,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      Linking.openURL(`mailto:${this.state.user.email}`)
                    }>
                    <Image
                      style={{marginLeft: 10, height: 30, width: 30}}
                      source={SocialMailIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.user.email}
                    </Text>
                  </TouchableOpacity>

                  {this.state.CompanyData.length != 0 ? (
                    <View
                      style={{
                        marginTop: 15,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Image source={BusinessIcon} />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Job Position
                        </Text>
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.CompanyData}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.job_position != '' ? (
                              <TouchableOpacity
                                style={{
                                  paddingBottom: 10,
                                  paddingTop: 10,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  marginTop: 10,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                                onPress={() =>
                                  this.props.navigation.navigate('JobDetail', {
                                    data: JSON.stringify(item),
                                  })
                                }>
                                <Image
                                  style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 25,
                                  }}
                                  source={{
                                    uri: String(
                                      this.state.userData.asset_url + item.logo,
                                    ),
                                  }}
                                />

                                <View
                                  style={{flex: 1, justifyContent: 'center'}}>
                                  <Text
                                    style={{
                                      flex: 1,
                                      marginLeft: 10,
                                      fontSize: SetFontSize.ts16,
                                      color: CommonColors.whiteColor,
                                      fontFamily: ConstantKeys.Averta_REGULAR,
                                    }}
                                    numberOfLines={1}>
                                    {item.job_position}
                                  </Text>
                                  <Text
                                    style={{
                                      flex: 1,
                                      marginLeft: 10,
                                      fontSize: SetFontSize.ts14,
                                      color: CommonColors.whiteColor,
                                      fontFamily: ConstantKeys.Averta_REGULAR,
                                    }}
                                    numberOfLines={1}>
                                    {item.name}
                                  </Text>
                                </View>

                                <Image
                                  style={{
                                    height: 15,
                                    width: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={RightArrowIcon}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.SocialData.length != 0 ? (
                    <View
                      style={{
                        marginTop: 15,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Image source={SocialIcon} />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Social Networks
                        </Text>
                      </View>

                      <View style={{marginTop: 15, borderRadius: 15}}>
                        <FlatList
                          data={this.state.SocialData}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  borderRadius: 15,
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  marginTop: 5,
                                  marginBottom: 5,
                                }}
                                onPress={() => this.SocialTap(item)}
                                onLongPress={() =>
                                  this.CopyTextToClipBoard(item)
                                }>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                    marginLeft: 10,
                                  }}
                                  source={this.renderImage(item)}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.MusicData.length != 0 ? (
                    <View
                      style={{
                        marginTop: 10,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Image source={MusicIcon} />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Music
                        </Text>
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.MusicData}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  marginTop: 10,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                                onPress={() => this.SocialTap(item)}
                                onLongPress={() =>
                                  this.CopyTextToClipBoard(item)
                                }>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={SpotifyIcon}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.PaymentData.length != 0 ? (
                    <View
                      style={{
                        marginTop: 15,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Image source={PaymentIcon} />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Payment
                        </Text>
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.PaymentData}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  marginTop: 10,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                                onPress={() =>
                                  this.props.navigation.navigate('QrCode', {
                                    upiId: item.media_value,
                                  })
                                }>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={PayIcon}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>

                                <Image
                                  style={{
                                    height: 25,
                                    width: 25,
                                    resizeMode: 'contain',
                                    tintColor: CommonColors.whiteColor,
                                  }}
                                  source={QRIcon}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.ExternalLinkData.length != 0 ? (
                    <View
                      style={{
                        marginTop: 15,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Image source={ExternalLinkIcon} />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          External Links
                        </Text>
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.ExternalLinkData}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  marginTop: 10,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                                onPress={() => this.SocialTap(item)}
                                onLongPress={() =>
                                  this.CopyTextToClipBoard(item)
                                }>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={LinkIcon}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  <View
                    style={{
                      marginTop: 15,
                      marginLeft: 20,
                      marginRight: 20,
                      justifyContent: 'center',
                      backgroundColor: CommonColors.primaryColor,
                      borderRadius: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                        marginLeft: 15,
                        marginRight: 15,
                      }}>
                      <Image source={SettingIcon} />
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: SetFontSize.ts14,
                          color: CommonColors.whiteColor,
                          fontFamily: ConstantKeys.Averta_REGULAR,
                        }}>
                        Account settings
                      </Text>
                    </View>

                    <View
                      style={{
                        borderRadius: 10,
                        backgroundColor: CommonColors.appBarColor,
                        marginTop: 15,
                      }}>
                      <TouchableOpacity
                        style={{
                          height: 45,
                          justifyContent: 'center',
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Text
                          style={{
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Help and Tutorials
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 0.5,
                          width: '100%',
                          backgroundColor: CommonColors.inActiveColor,
                        }}
                      />

                      <TouchableOpacity
                        style={{
                          height: 45,
                          alignItems: 'center',
                          flexDirection: 'row',
                          marginLeft: 15,
                          marginRight: 15,
                        }}
                        onPress={() => this.btnTempProfileTap()}>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Temporary Profile
                        </Text>
                        <Text
                          style={{
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.arrowColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          {this.state.is_temp == 0 ? 'OFF' : 'ON'}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 0.5,
                          width: '100%',
                          backgroundColor: CommonColors.inActiveColor,
                        }}
                      />

                      <TouchableOpacity
                        style={{
                          height: 45,
                          justifyContent: 'center',
                          marginLeft: 15,
                          marginRight: 15,
                        }}
                        onPress={() => this.btnSignOutTap()}>
                        <Text
                          style={{
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Sign Out
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                      marginBottom: 20,
                      height: 50,
                      backgroundColor: CommonColors.arrowColor,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => this.btnPurchaseTap()}>
                    <Text
                      style={{
                        color: CommonColors.blackColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_BOLD,
                      }}>
                      Purchase Card
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : null}

              {this.state.isloading ? <LoadingView /> : null}
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CommonColors.primaryColor,
  },
  headerView: {
    height: 74,
    width: '100%',
    backgroundColor: CommonColors.appBarColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  headerText: {
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    textAlign: 'center',
  },
  btnWhatsNewSele: {
    flex: 0.5,
    backgroundColor: CommonColors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    shadowColor: CommonColors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  btnWhatsNew: {
    flex: 0.5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
  },
});
