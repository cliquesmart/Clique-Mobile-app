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
    };
  }

  componentDidMount() {
    this.getData();
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
  API_USERDETAILS(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.usersDetails, {
      user_id: this.state.profileID,
      login_id: this.state.user.user_id,
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
  }

  // API Add Constact
  API_ADD_CONTACT(isload, contact_id) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.addContact, {
      user_id: this.state.user.user_id,
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

        if (response.data.status == true) {
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
  }

  API_REMOVE_CONTACT(isload, contact_id) {
    this.setState({isloading: isload});
    Webservice.post(APIURL.removeContact, {
      user_id: this.state.user.user_id,
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
  }

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
      // if (item.media_type == 'homeNumber' || item.media_type == 'workNumber' || item.media_type == 'otherNumber') {
      //   Linking.openURL(`tel:${item.media_value}`);
      // }
      // else {
      //   Linking.canOpenURL(item.media_value).then(supported => {
      //     if (supported) {
      //       Linking.openURL(item.media_value);
      //     } else {
      //       console.log('Don\'t know how to open URI: ' + item.media_value);
      //     }
      //   })
      // }

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

  render() {
    let BusinessIcon = IMG.OtherFlow.BusinessIcon;
    let SocialIcon = IMG.OtherFlow.SocialIcon;
    let MusicIcon = IMG.OtherFlow.MusicIcon;
    let PaymentIcon = IMG.OtherFlow.PaymentIcon;
    let ExternalLinkIcon = IMG.OtherFlow.ExternalLinkIcon;
    let BackIcon = IMG.OtherFlow.BackIcon;

    let CallIcon = IMG.OtherFlow.CallIcon;
    let SocialMailIcon = IMG.OtherFlow.SocialMailIcon;
    let RightArrowIcon = IMG.OtherFlow.RightArrowIcon;
    let SpotifyIcon = IMG.OtherFlow.SpotifyIcon;
    let PayIcon = IMG.OtherFlow.PayIcon;
    let LinkIcon = IMG.OtherFlow.LinkIcon;

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
              <TouchableOpacity
                style={{
                  marginLeft: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 40,
                }}
                onPress={() => this.btnBackTap()}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    tintColor: CommonColors.whiteColor,
                  }}
                  source={BackIcon}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>Profile</Text>

              <TouchableOpacity
                style={{
                  marginLeft: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 40,
                }}
              />
            </View>

            <View style={{flex: 1}}>
              {this.state.profileData != null ? (
                <View
                  style={{flex: 1, backgroundColor: CommonColors.PurpleColor}}>
                  <ScrollView
                    style={{
                      flex: 1,
                      backgroundColor: CommonColors.primaryColor,
                    }}
                    bounces={false}>
                    <View style={{width: '100%', height: 250}}>
                      <FastImage
                        source={{
                          uri: String(
                            this.state.userData.asset_url +
                              this.state.profileData.avatar,
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
                          {this.state.profileData.name}
                        </Text>

                        {this.state.profileData.bio != '' ? (
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
                            {this.state.profileData.bio}
                          </Text>
                        ) : null}
                      </View>
                    </View>

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
                        Linking.openURL(`tel:${this.state.profileData.mobile}`)
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
                        {this.state.profileData.mobile}
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
                        Linking.openURL(
                          `mailto:${this.state.profileData.email}`,
                        )
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
                        {this.state.profileData.email}
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
                            scrollEnabled={false}
                            renderItem={({item, index}) =>
                              item.job_position != '' ? (
                                <TouchableOpacity
                                  style={{
                                    height: 60,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: CommonColors.appBarColor,
                                    borderRadius: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginTop: 10,
                                  }}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'JobDetail',
                                      {data: JSON.stringify(item)},
                                    )
                                  }>
                                  <Image
                                    style={{
                                      height: 50,
                                      width: 50,
                                      borderRadius: 25,
                                    }}
                                    source={{
                                      uri: String(
                                        this.state.userData.asset_url +
                                          item.logo,
                                      ),
                                    }}
                                  />

                                  <View
                                    style={{flex: 1, justifyContent: 'center'}}>
                                    <Text
                                      style={{
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
                                        marginTop: 5,
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
                          marginTop: 20,
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
                            Social Netorks
                          </Text>
                        </View>

                        <View style={{marginTop: 5}}>
                          <FlatList
                            data={this.state.SocialData}
                            keyExtractor={(item) => item.itemId}
                            renderItem={({item, index}) =>
                              item.media_value != '' ? (
                                <TouchableOpacity
                                  style={{
                                    height: 50,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: CommonColors.appBarColor,
                                    borderRadius: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginTop: 10,
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
                          <Image source={MusicIcon} />
                          <Text
                            style={{
                              marginLeft: 10,
                              fontSize: SetFontSize.ts14,
                              color: CommonColors.whiteColor,
                              fontFamily: ConstantKeys.Averta_BOLD,
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
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    borderRadius: 10,
                                  }}
                                  onPress={() => this.MusicTap(item)}
                                  onLongPress={() =>
                                    this.CopyTextToClipBoard(item)
                                  }>
                                  <Image
                                    style={{
                                      height: 30,
                                      width: 30,
                                      borderRadius: 15,
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
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    borderRadius: 10,
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

                                  {/* <Image style={{ height: 30, width: 30, resizeMode: 'contain', tintColor : CommonColors.whiteColor }}
                                  source={{ uri: 'https://pngimg.com/uploads/qr_code/qr_code_PNG3.png' }} /> */}
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
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                  }}
                                  onPress={() => this.ExternalLinkTap(item)}
                                  onLongPress={() =>
                                    this.CopyTextToClipBoard(item)
                                  }>
                                  <Image
                                    style={{
                                      height: 30,
                                      width: 30,
                                      borderRadius: 15,
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
                  </ScrollView>
                  <View style={{height: 50}}>
                    {this.state.isContact == 1 ? (
                      <TouchableOpacity
                        style={{
                          height: 50,
                          backgroundColor: CommonColors.errorColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => this.btnRemoveContactTap()}>
                        <Text
                          style={{
                            color: CommonColors.whiteColor,
                            fontSize: SetFontSize.ts16,
                            fontFamily: ConstantKeys.Averta_BOLD,
                          }}>
                          Remove From Contacts
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          height: 50,
                          backgroundColor: CommonColors.arrowColor,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => this.btnAddContactTap()}>
                        <Text
                          style={{
                            color: CommonColors.blackColor,
                            fontSize: SetFontSize.ts16,
                            fontFamily: ConstantKeys.Averta_BOLD,
                          }}>
                          Add To Contacts
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
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
    flexDirection: 'row',
  },

  headerText: {
    flex: 1,
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    textAlign: 'center',
  },
});
