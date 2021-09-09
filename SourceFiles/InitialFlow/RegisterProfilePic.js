import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Linking,
  Platform,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';
import LoadingView from '../Constants/LoadingView';
import Snackbar from 'react-native-snackbar';
import {Block, Button, ImageComponent, Text} from '../components';
import {hp, wp} from '../components/responsive';
import ValidationMsg from '../Constants/ValidationMsg';

//Third Party
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderPreLogin from '../common/header';
import NeuView from '../common/neu-element/lib/NeuView';

export default class RegisterProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      RegisterData: props.route.params.data,
      ProfileImgData: null,
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

  btnNextTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('RegisterBio', {
        name: this.props.route.params.name,
        email: this.props.route.params.email,
        gender: this.props.route.params.gender,
        dob: this.props.route.params.dob,
        password: this.props.route.params.password,
        profile: this.state.ProfileImgData.base64,
      });
    });
  };

  btnSkipTap = () => {
    this.props.navigation.navigate('RegisterBio', {
      name: this.props.route.params.name,
      email: this.props.route.params.email,
      password: this.props.route.params.password,
      profile: '',
      gender: this.props.route.params.gender,
      dob: this.props.route.params.dob,
    });
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Clique App Location Permission',
          message:
            'Clique App App needs access to your camera features ' +
            'so you can access the camera features.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.btnSelectImage();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('never ask again');
        this.showAlert(
          "You can't acess the camera features. Please give access to Camera service from the app settings",
        );
        setTimeout(() => {
          Linking.openSettings();
        }, 2000);
      } else {
        console.log('never ask again 2');
        this.showAlert(
          "You can't acess the camera features. Please give access to Camera service",
        );
        this.requestCameraPermission();
        console.log('Location permission denied');
      }
    } catch (err) {
      console.log('never ask again 3', err);
      console.warn(err);
    }
  };

  btnSelectImage = () => {
    Alert.alert(
      ValidationMsg.AppName,
      'Choose your Suitable Option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  console.log('User cancelled photo picker');

                  this.setState({loading: false});
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.errorCode);
                  this.setState({loading: false});

                  if (response.errorCode == 'permission') {
                    this.setState({isloading: false});
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  ImagePicker.openCropper({
                    compressImageQuality: 0.7,
                    path: response.uri,
                    width: 300,
                    includeBase64: true,
                    cropperCircleOverlay: true,
                    height: 300,
                  })
                    .then((image) => {
                      this.setState({isloading: false});

                      console.log(image);

                      var dict = {};
                      dict.base64 = image.data;
                      dict.uri = image.path;
                      dict.type = image.mime;
                      this.setState({ProfileImgData: dict, isloading: false});
                    })
                    .catch((e) => {
                      // alert(e);

                      this.setState({isloading: false});

                      console.log(' Error :=>  ' + e);
                    });

                  // this.setState({ ProfileImgData: response, isloading : false })
                }
              },
            );
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));

                // this.setState({ isloading: false })

                if (response.didCancel) {
                  this.setState({isLoading: false});
                  console.log('User cancelled photo picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.error);
                  this.setState({isLoading: false});

                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  this.setState({isLoading: false});
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  ImagePicker.openCropper({
                    compressImageQuality: 0.7,
                    path: response.uri,
                    width: 300,
                    includeBase64: true,
                    cropperCircleOverlay: true,
                    height: 300,
                  })
                    .then((image) => {
                      console.log(image);

                      this.setState({isloading: false});

                      var dict = {};
                      dict.base64 = image.data;
                      dict.uri = image.path;
                      dict.type = image.mime;
                      this.setState({ProfileImgData: dict, isloading: false});
                    })
                    .catch((e) => {
                      // alert(e);
                      this.setState({isloading: false});

                      console.log(' Error :=>  ' + e);
                    });
                }
              },
            );
          },
        },
        {
          text: 'Cancel',
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  render() {
    console.log(this.state.ProfileImgData);
    const {ProfileImgData} = this.state;
    console.log(this.props.route.params, ' this.props.route.params');
    return (
      <Block linear>
        <SafeAreaView />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          bounces={false}>
          <Block padding={[hp(2), wp(3)]} space="between" flex={false} row>
            <TouchableOpacity onPress={() => this.btnBackTap()}>
              <NeuView
                style={styles.linear}
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
            borderTopLeftRadius={30}>
            <HeaderPreLogin
              title="Create Profile"
              subtitle="Add a Profile Picture"
            />
            <Block margin={[hp(2), 0, 0]} center middle flex={false}>
              <NeuView
                color="#F2F0F7"
                height={hp(24)}
                width={wp(85)}
                borderRadius={16}>
                <TouchableOpacity
                  onPress={() => {
                    Platform.OS === 'ios'
                      ? this.btnSelectImage()
                      : this.requestCameraPermission();
                  }}>
                  {ProfileImgData && ProfileImgData.uri ? (
                    <ImageComponent
                      isURL={ProfileImgData && ProfileImgData.uri}
                      height={160}
                      width={160}
                      radius={160}
                      resizeMode="contain"
                      name={ProfileImgData ? ProfileImgData.uri : 'CameraIcon'}
                    />
                  ) : (
                    <NeuView
                      color="#F2F0F7"
                      height={120}
                      width={120}
                      borderRadius={120}>
                      <ImageComponent
                        height={50}
                        width={50}
                        resizeMode="contain"
                        name={'CameraIcon'}
                      />
                    </NeuView>
                  )}
                </TouchableOpacity>
              </NeuView>
            </Block>
            <Block bottom flex={1} margin={[0, wp(3), hp(4)]}>
              {ProfileImgData && ProfileImgData.uri && (
                <Button
                  onPress={() => this.btnNextTap()}
                  linear
                  color="primary">
                  Next
                </Button>
              )}
            </Block>
          </Block>
        </ScrollView>

        {this.state.isloading ? <LoadingView /> : null}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  neoFirstContainer: {
    borderRadius: -20,
    shadowRadius: 8,
    backgroundColor: '#F2F0F7',
    width: wp(90),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
    borderWidth: 3,
    borderColor: '#fff',
  },
  neoSubContainer: {
    borderRadius: 100,
    shadowRadius: 8,
    backgroundColor: '#F2F0F7',
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linear: {
    height: 40,
  },
});
