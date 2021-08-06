import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  FlatList,
  Alert,
  PermissionsAndroid,
} from 'react-native';

//Constants
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {ConstantKeys} from '../Constants/ConstantKey';
import {SetFontSize} from '../Constants/FontSize';
import LoadingView from '../Constants/LoadingView';
import Webservice from '../Constants/API';
import ValidationMsg from '../Constants/ValidationMsg';
import {APIURL} from '../Constants/APIURL';

//Third Party
import {DrawerActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import NfcManager, {
  NfcEvents,
  NfcAdapter,
  NfcTech,
  Ndef,
} from 'react-native-nfc-manager';
import {Neomorph, Shadow, NeomorphFlex} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

var URLData = URL;

export default class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},
      videoplay: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      NfcManager.start();
      this.getData();
    });
  }

  compo;

  componentWillUnmount() {
    // Remove the event listener

    this.setState({videoplay: true});

    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
    NfcManager.cancelTechnologyRequest().catch(() => 0);
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

        this.setState({userData: userData, user: user});
        this.ScanCard();
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  ScanCard = async () => {
    try {
      let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
      let resp = await NfcManager.requestTechnology(tech, {
        alertMessage: 'Ready to Scan NFC Tag',
      });
      console.log(resp);

      // the NFC uid can be found in tag.id
      let tag = await NfcManager.getTag();
      console.log(tag);

      this._onTagDiscovered(tag);

      this._cancel();
    } catch (ex) {
      NfcManager.start();

      console.warn('ex for Scan Card', ex);

      // alert(ex)
      this._cancel();
    }
  };

  _onTagDiscovered = (tag) => {
    let url = this._parseUri(tag);
    if (url) {
      // Linking.openURL(url)
      //     .catch(err => {
      //         console.warn(err);
      //     })

      URLData = url;
      this.setState({text: JSON.stringify(url)});
      console.log('Detected Text : ' + url);

      var str = url.split('/');

      console.log('SRT ' + JSON.stringify(str));
      var CardUserID = str[str.length - 1];
      //Proper Find Parameters
      var url1 = 'socialclique://clique/user/profile?userid=' + CardUserID;

      console.log('URL 1 = ' + url1);
      var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(url1))) {
        params[match[1]] = match[2];
      }
      console.log(params.userid);

      if (params.userid == this.state.user.user_id) {
        this.props.navigation.navigate('Profile');
      } else {
        this.props.navigation.navigate('UserProfile', {
          profile_id: params.userid,
        });
      }
    } else {
      let text = this._parseText(tag);
      console.log('Text :' + text);
      this.setState({text: text});
    }
  };

  _cancel = () => {
    this.setState({text: '', url: URL});
    NfcManager.cancelTechnologyRequest().catch(() => 0);
    // NfcManager.unregisterTagEvent().catch(() => 0);
  };

  _parseUri = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
        return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  _parseText = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  render() {
    let userIcon = IMG.TabFlow.ProfileSelect;
    let locationIcon = IMG.TabFlow.Pin;
    let ScanIcon = IMG.TabFlow.Scan;
    let HomeIon = IMG.TabFlow.Home;

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
              <Text style={styles.headerText}>Scan</Text>
            </View>

            <View style={{flex: 1}}>
              {/* <Video
                source={require('../Assets/Images/Video/scanVideo.mp4')} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }}
                paused={this.state.videoplay}
                resizeMode={'contain'}
                repeat
                style={{
                  flex: 1,
                }}
              /> */}

              <Text
                style={{
                  marginLeft: 20,
                  marginTop: 20,
                  marginRight: 20,
                  marginBottom: 20,
                  fontSize: SetFontSize.ts25,
                  fontFamily: ConstantKeys.Averta_BOLD,
                  color: CommonColors.whiteColor,
                  textAlign: 'center',
                }}>
                {'Put The Card\nBehind Your Phone'}
              </Text>
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
  btnBack: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  headerText: {
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    flex: 1,
    textAlign: 'center',
  },
});
