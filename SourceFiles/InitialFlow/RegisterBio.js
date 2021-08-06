import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';
import ValidationMsg from '../Constants/ValidationMsg';
import LoadingView from '../Constants/LoadingView';
import {APIURL} from '../Constants/APIURL';
import Webservice from '../Constants/API';
import {Block, Button, ImageComponent, Input, Text} from '../components';
import {hp, wp} from '../components/responsive';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {EventRegister} from 'react-native-event-listeners';
import {Neomorph, Shadow, NeomorphFlex} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {images} from '../Assets/Images/images';
import HeaderPreLogin from '../common/header';
import NeoInputField from '../components/neo-input';
import {connect} from 'react-redux';
import NeuView from '../common/neu-element/lib/NeuView';

class RegisterName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      NameBorderColor: CommonColors.GhostColor,
      // RegisterData: JSON.parse(props.route.params.data),
      txtBio: '',
    };
  }

  componentDidMount() {
    console.log(this.props.route.params);
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

  //Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  createAccount = () => {
    this.setState({
      isloading: true,
    });
    Webservice.post(APIURL.newRegister, {
      name: this.props.route.params.name,
      email: this.props.route.params.email,
      password: this.props.route.params.password,
      avatar: this.props.route.params.profile,
      gender: this.props.route.params.gender,
      date_of_birth: this.props.route.params.dob,
      bio: this.state.txtBio,
      current_lat: this.props.location.latitude,
      current_long: this.props.location.longitude,
    })
      .then(async (response) => {
        if (response.data == null) {
          this.setState({
            isloading: false,
          });
          // alert('error');
          Alert.alert(response.originalError.message);

          return;
        }
        console.log('Get Register User Response : ' + response);

        if (response.data.status === 200) {
          console.log(response.data, 'response.data');
          this.setState({
            isloading: false,
          });
          this.props.navigation.navigate('OwnProducts');
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(response.data.data.user.user_id),
          );
          this.showAlert(response.data.message);
        } else {
          this.setState({
            isloading: false,
          });
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({
          isloading: true,
        });
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                this.createAccount(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  btnSkipTap = () => {
    this.setState({
      isloading: true,
    });
    Webservice.post(APIURL.newRegister, {
      name: this.props.route.params.name,
      email: this.props.route.params.email,
      password: this.props.route.params.password,
      avatar: this.props.route.params.profile,
      gender: this.props.route.params.gender,
      date_of_birth: this.props.route.params.dob,
      bio: '',
      current_lat: this.props.location.latitude,
      current_long: this.props.location.longitude,
    })
      .then(async (response) => {
        if (response.data == null) {
          this.setState({
            isloading: false,
          });
          // alert('error');
          Alert.alert(response.originalError.message);

          return;
        }
        console.log('Get Register User Response : ' + response);

        if (response.data.status === 200) {
          console.log(response.data, 'response.data');
          this.setState({
            isloading: false,
          });
          this.props.navigation.navigate('OwnProducts');
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(response.data.data.user.user_id),
          );
          this.showAlert(response.data.message);
        } else {
          this.setState({
            isloading: false,
          });
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({
          isloading: true,
        });
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                this.createAccount(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  renderTellUsAboutYourself = () => {
    return (
      <Block flex={false} margin={[hp(1), 0, 0]}>
        <Text margin={[hp(0.5), 0]} grey size={14}>
          {'- Share your accomplishments.'}
        </Text>
        <Text margin={[hp(0.5), 0]} grey size={14}>
          {'- Your hobbies and interests'}
        </Text>
        <Text margin={[hp(0.5), 0]} size={14} grey>
          {'- Say something personal.'}
        </Text>
        <Text margin={[hp(0.5), 0]} size={14} grey>
          {'- Be funny'}
        </Text>
      </Block>
    );
  };

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon;
    let RedPlay = IMG.InitialFlow.RedPlay;
    console.log(this.props.location, 'location');
    const data = {
      name: this.props.route.params.name,
      email: this.props.route.params.email,
      password: this.props.route.params.password,
      avatar: this.props.route.params.profile,
      gender: this.props.route.params.gender,
      dob: this.props.route.params.dob,
      bio: this.state.txtBio,
    };
    console.log(data);

    return (
      <Block linear>
        <SafeAreaView />

        <Block padding={[hp(2), wp(3), 0]} space="between" flex={false} row>
          <TouchableOpacity onPress={() => this.btnBackTap()}>
            <NeuView
              concave
              color={'#775DF2'}
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#5542B6', '#7653DB']}>
              <ImageComponent
                resizeMode="contain"
                height={14}
                width={14}
                name={'BackIcon'}
              />
            </NeuView>
          </TouchableOpacity>

          <ImageComponent
            resizeMode="contain"
            height={140}
            width={140}
            name={'nameBg'}
          />
          <TouchableOpacity onPress={() => this.btnSkipTap()}>
            <NeuView
              style={styles.linear}
              concave
              color={'#BC60CB'}
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#AF2DA5', '#BC60CB']}>
              <Text
                style={{
                  fontSize: SetFontSize.ts12,
                  color: CommonColors.whiteColor,
                  fontFamily: ConstantKeys.Averta_REGULAR,
                }}>
                Skip
              </Text>
            </NeuView>
          </TouchableOpacity>
        </Block>
        <Block
          color={'#F2EDFA'}
          borderTopRightRadius={30}
          borderTopLeftRadius={30}
          padding={[0, wp(3)]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            bounces={false}>
            <HeaderPreLogin title="Create Account" subtitle="Your Bio" />
            <Block center flex={false} margin={[hp(1), 0, 0]}>
              <NeoInputField
                value={this.state.txtBio}
                placeholder="Tell us about yourself!"
                onChangeText={(txtBio) => {
                  this.setState({txtBio: txtBio});
                }}
                fontColor="#707070"
                icon=""
              />
            </Block>

            <Text margin={[hp(1.5), 0, 0]} right regular size={14} purple>
              {this.state.txtBio.length}/280
            </Text>
            <Block flex={false} padding={[hp(1), wp(5), 0]}>
              <Text bold size={14} color="#707070">
                Tell your contacts something about yourself...
              </Text>
              {this.renderTellUsAboutYourself()}
            </Block>
          </ScrollView>
          <Block flex={false} margin={[0, 0, hp(3), 0]}>
            <Button
              disabled={!this.state.txtBio}
              onPress={() => this.createAccount()}
              linear
              color="primary">
              Create Account
            </Button>
          </Block>
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
  btnLogin: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    shadowColor: '#BBC3CE',
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginTop: hp(2),
  },

  txtLogin: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_BOLD,
  },
  viewCountrystyle: {
    flexDirection: 'row',
    height: 50,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    color: CommonColors.MortarColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },
  pickerTitleStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
    fontSize: SetFontSize.ts18,
    color: CommonColors.blackColor,
  },
  selectedCountryTextStyle: {
    paddingLeft: 5,
    paddingRight: 5,
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
    textAlign: 'center',
  },
  countryNameTextStyle: {
    paddingLeft: 10,
    color: CommonColors.blackColor,
    textAlign: 'right',
  },
  searchBarStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 10,
  },

  btnSignUp: {
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    backgroundColor: CommonColors.PurpleColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSignUp: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },

  txtAlreadyAccount: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 25,
    fontFamily: ConstantKeys.Averta_REGULAR,
    fontSize: SetFontSize.ts14,
    color: CommonColors.secondaryText,
    textDecorationLine: 'underline',
  },
  shadow: {
    shadowOpacity: 0.1, // <- and this or yours opacity
    shadowRadius: 15,
    borderRadius: 50,
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  leftIcon: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
    height: hp(15),
    width: wp(18),
    resizeMode: 'contain',
  },
  rightIcon: {
    alignSelf: 'flex-end',
    marginRight: 80,
    height: hp(10),
    width: wp(15),
    resizeMode: 'contain',
  },
});
const mapStateToProps = (state, ownProps) => {
  return {
    location: state.location.data,
  };
};
export default connect(mapStateToProps)(RegisterName);
