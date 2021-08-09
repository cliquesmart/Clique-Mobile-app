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
  TextInput,
  Dimensions,
  Platform,
  Alert,
  PermissionsAndroid,
  ScrollView,
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
import RBSheet from 'react-native-raw-bottom-sheet';
import NfcManager, {
  NfcEvents,
  NfcAdapter,
  NfcTech,
  Ndef,
} from 'react-native-nfc-manager';
import {Neomorph, Shadow, NeomorphFlex} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}

export default class SyncToCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},
      card_id: '',
    };
  }

  async componentDidMount() {
    await this.getData();
    NfcManager.start();
    this.ScanCard();
  }

  componentWillUnmount() {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      //   fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
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
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  ScanCard = async () => {
    try {
      // let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
      let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to Write NFC Tag',
      });
      console.log('Response : ' + resp);

      // the NFC uid can be found in tag.id
      let tag = await NfcManager.getTag();
      console.log('Tag : ' + JSON.stringify(tag));

      console.log('Tag ID: ' + JSON.stringify(tag.id));
      console.log('Tag type: ' + JSON.stringify(tag.type));

      await this.setState({card_id: tag.id});

      this.API_WRITE_CARD(false);

      // this._cancel();
    } catch (ex) {
      this._cancel();
      console.warn('ex in Scan to card', ex);

      NfcManager.start();
      // alert(ex)
    }
  };

  _cancel = () => {
    this.setState({text: '', url: URL});
    NfcManager.cancelTechnologyRequest().catch(() => 0);
    NfcManager.unregisterTagEvent().catch(() => 0);
  };

  // API Get Country
  API_WRITE_CARD(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.writeCard, {
      user_id: this.state.user.user_id,
      card_id: this.state.card_id,
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
        console.log('Get Write Card Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          this.writeCard();
        } else {
          this._cancel();
          this.setState({isloading: false});
          Alert.alert('Fail', response.data.message, [
            {
              text: 'OK',
              onPress: () => {
                this._cancel();
                this.props.navigation.goBack();
              },
            },
          ]);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({isloading: false});
      });
  }

  async writeCard() {
    try {
      // let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
      //   alertMessage: 'Ready to write some NFC tags!'
      // });
      // console.log("REspo : "+resp);
      // let ndef = await NfcManager.getNdefMessage();
      // console.log("NDFE : "+JSON.stringify(ndef));

      let bytes = buildUrlPayload(
        'http://admin.cliquesocial.co/user/profile' + this.state.user.user_id,
      );
      await NfcManager.writeNdefMessage(bytes);
      console.log('successfully write ndef');

      if (Platform.OS == 'ios') {
        // await NfcManager.setAlertMessageIOS('Card Sync Successfully');

        Alert.alert(ValidationMsg.AppName, 'Card Sync Successfully', [
          {
            text: 'OK',
            onPress: () => {
              this._cancel();
              this.props.navigation.goBack();
            },
          },
        ]);

        // this._cancel();
        // this.props.navigation.goBack()
      } else {
        Alert.alert(ValidationMsg.AppName, 'Card Sync Successfully', [
          {
            text: 'OK',
            onPress: () => {
              this._cancel();
              this.props.navigation.goBack();
            },
          },
        ]);
      }
    } catch (ex) {
      console.log('ex', ex);
      this._cancel();
    }
  }

  //Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon;

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

              <Text style={styles.headerText}>Sync To Card</Text>

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
              {/* <Video
                source={require('../Assets/Images/Video/scanVideo.mp4')} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }}
                resizeMode={'contain'}
                repeat
                style={{
                  flex: 1,
                }}
              />
              , */}
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
  viewClique: {
    backgroundColor: CommonColors.PurpleColor,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    textAlign: 'center',
    flex: 1,
  },
});
