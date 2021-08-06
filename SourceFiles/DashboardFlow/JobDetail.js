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
import Clipboard from '@react-native-clipboard/clipboard';

export default class JobDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      user: {},
      userData: {},
      JobData: JSON.parse(props.route.params.data),
    };
  }

  async componentDidMount() {
    await this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);

        this.setState({userData: userData, user: userData.user});
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

  //Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  //For Tap Social Media Details & Linking

  OpenCall = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL(`tel:${item}`);
    });
  };

  OpenMail = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL(`mailto:${item}`);
    });
  };

  OpenInstagram = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL(`instagram://user?username=${item}`).catch(() => {
        Linking.openURL('https://www.instagram.com/' + item);
      });
    });
  };

  OpenFaceBook = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL(`fb://profile/${item}`).catch(() => {
        Linking.openURL('https://www.facebook.com/' + item);
      });
    });
  };

  OpenYoutube = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL(`vnd.youtube://${item}`).catch(() => {
        Linking.openURL('https://www.youtube.com/' + item);
      });
    });
  };

  OpenLinkdin = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL(`linkedin://profile?id=${item}`).catch(() => {
        Linking.openURL('https://www.linkedin.com/in/' + item);
      });
    });
  };

  OpenTwitter = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL('twitter://user?screen_name=' + item).catch(() => {
        Linking.openURL('https://www.twitter.com/' + item);
      });
    });
  };

  OpenLinks = (item) => {
    requestAnimationFrame(() => {
      Linking.openURL('http://' + item);
    });
  };

  SocialTap = (item) => {
    requestAnimationFrame(() => {
      // Linking.canOpenURL(item).then(supported => {
      //     if (supported) {
      //         Linking.openURL(item);
      //     } else {
      //         console.log('Don\'t know how to open URI: ' + item);
      //     }
      // })

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
      Clipboard.setString(item);
      this.showAlert('Coppied!');
    });
  };

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon;
    let SettingIcon = IMG.OtherFlow.SettingIcon;
    let BusinessIcon = IMG.OtherFlow.BusinessIcon;
    let WorkIcon = IMG.OtherFlow.WorkIcon;
    let SocialIcon = IMG.OtherFlow.SocialIcon;

    let CallIcon = IMG.OtherFlow.CallIcon;
    let SocialMailIcon = IMG.OtherFlow.SocialMailIcon;
    let FacebookIcon = IMG.OtherFlow.FacebookIcon;
    let InstaIcon = IMG.OtherFlow.InstaIcon;
    let WebIcon = IMG.OtherFlow.WebIcon;
    let LinkdInIcon = IMG.OtherFlow.LinkdInIcon;
    let TwitterIcon = IMG.OtherFlow.TwitterIcon;
    let AddressIcon = IMG.OtherFlow.AddressIcon;

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
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                  source={BackIcon}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>{this.state.JobData.name}</Text>

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

            <ScrollView style={{flex: 1}}>
              <View style={{width: '100%', height: 250}}>
                {this.state.userData != null ? (
                  <Image
                    source={{
                      uri: String(
                        this.state.userData.asset_url + this.state.JobData.logo,
                      ),
                    }}
                    style={{flex: 1}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : null}

                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: CommonColors.transprentDark,
                    bottom: 0,
                    width: '100%',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={{
                      uri: String(
                        this.state.userData.asset_url + this.state.user.avatar,
                      ),
                    }}
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 30,
                      marginLeft: 20,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 20,
                        textAlign: 'left',
                        marginTop: 15,
                        fontSize: SetFontSize.ts25,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_BOLD,
                      }}>
                      {this.state.user.name}
                    </Text>

                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 20,
                        textAlign: 'left',
                        marginTop: 5,
                        fontSize: SetFontSize.ts14,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                        marginBottom: 10,
                      }}>
                      {this.state.JobData.job_position} at{' '}
                      {this.state.JobData.name}
                    </Text>
                  </View>
                </View>
              </View>

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
                  <Image source={AddressIcon} />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: SetFontSize.ts14,
                      color: CommonColors.whiteColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    Address
                  </Text>
                </View>

                <View
                  style={{
                    padding: 10,
                    marginTop: 15,
                    minHeight: 50,
                    backgroundColor: CommonColors.appBarColor,
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: SetFontSize.ts14,
                      color: CommonColors.whiteColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    {this.state.JobData.address}
                  </Text>
                </View>
              </View>

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
                      fontFamily: ConstantKeys.Averta_BOLD,
                    }}>
                    position
                  </Text>
                </View>

                <View
                  style={{
                    height: 50,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 15,
                    backgroundColor: CommonColors.appBarColor,
                    borderRadius: 10,
                  }}>
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 15,
                      marginLeft: 10,
                      resizeMode: 'contain',
                    }}
                    source={WorkIcon}
                  />

                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginRight: 10,
                      fontSize: SetFontSize.ts16,
                      color: CommonColors.whiteColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    {this.state.JobData.job_position}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 15,
                  marginBottom: 20,
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
                      fontFamily: ConstantKeys.Averta_BOLD,
                    }}>
                    Social Networks
                  </Text>
                </View>

                {this.state.JobData.number != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 15,
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                    }}
                    onPress={() => this.OpenCall(this.state.JobData.number)}
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.number)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={CallIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.number}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {this.state.JobData.website != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() => this.OpenLinks(this.state.JobData.website)}
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.website)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={WebIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.website}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {this.state.JobData.email != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() => this.OpenMail(this.state.JobData.email)}
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.email)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={SocialMailIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.email}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {this.state.JobData.facebook != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() =>
                      this.OpenFaceBook(this.state.JobData.facebook)
                    }
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.facebook)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={FacebookIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.facebook}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {this.state.JobData.instagram != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() =>
                      this.OpenInstagram(this.state.JobData.instagram)
                    }
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.instagram)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={InstaIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.instagram}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {this.state.JobData.linkedin != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() =>
                      this.OpenLinkdin(this.state.JobData.linkedin)
                    }
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.linkedin)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={LinkdInIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.linkedin}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {this.state.JobData.twitter != null ? (
                  <TouchableOpacity
                    style={{
                      height: 50,
                      alignItems: 'center',
                      flexDirection: 'row',
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() => this.OpenTwitter(this.state.JobData.twitter)}
                    onLongPress={() =>
                      this.CopyTextToClipBoard(this.state.JobData.twitter)
                    }>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={TwitterIcon}
                    />

                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.JobData.twitter}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>
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
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    flex: 1,
    textAlign: 'center',
  },
});
