import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

export default class Congratulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      user: {},
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
        var user = userData.user;

        this.setState({
          userData: userData,
          user: user,
        });
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  //Action Methods
  btnActiveCardTap = () => {
    requestAnimationFrame(() => {
      const props = this.props;
      props.navigation.dispatch(
        CommonActions.reset({
          // index: 1,
          routes: [
            {
              name: 'Dashboard',
              state: {
                routes: [{name: 'Scan'}],
              },
            },
          ],
        }),
      );
    });
  };

  btnPurchaseTap = () => {
    requestAnimationFrame(() => {
      const props = this.props;
      props.navigation.dispatch(
        CommonActions.reset({
          // index: 0,
          routes: [
            {
              name: 'Dashboard',
              state: {
                routes: [{name: 'PurchaseCard'}],
              },
            },
          ],
        }),
      );
    });
  };

  btnSkipTap = () => {
    requestAnimationFrame(() => {
      const props = this.props;
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        }),
      );
    });
  };

  render() {
    let Background = IMG.OtherFlow.Background;
    return (
      <>
        <SafeAreaView
          style={{flex: 0, backgroundColor: CommonColors.primaryColor}}
        />

        <StatusBar
          barStyle={'light-content'}
          backgroundColor={CommonColors.primaryColor}
        />
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1, backgroundColor: CommonColors.primaryColor}}>
            <FastImage
              source={Background}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
            />

            <View style={{width: '100%', height: '100%', position: 'absolute'}}>
              <View style={styles.viewClique}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={IMG.InitialFlow.Clique}
                    style={{
                      width: 130,
                      height: 65,
                      resizeMode: 'contain',
                      marginTop: 40,
                    }}
                  />
                </View>
              </View>

              <ScrollView style={{height: '100%', width: '100%'}}>
                <Text
                  style={{
                    marginTop: 20,
                    marginLeft: 20,
                    marginRight: 20,
                    textAlign: 'center',
                    fontSize: SetFontSize.ts30,
                    fontFamily: ConstantKeys.Averta_BOLD,
                    color: CommonColors.whiteColor,
                  }}>
                  Congratulations,
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    marginLeft: 20,
                    marginRight: 20,
                    textAlign: 'center',
                    fontSize: SetFontSize.ts22,
                    fontFamily: ConstantKeys.Averta_BOLD,
                    color: CommonColors.whiteColor,
                  }}>
                  {this.state.user.name}
                </Text>

                <LinearGradient
                  colors={[
                    CommonColors.gradientStart,
                    CommonColors.gradientEnd,
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    marginTop: 30,
                    marginLeft: 20,
                    marginRight: 20,
                    height: 50,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    disabled={this.state.isDisable}
                    onPress={() => this.btnActiveCardTap()}>
                    <Text
                      style={{
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_BOLD,
                      }}>
                      Activate Card
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  colors={[
                    CommonColors.gradientStart,
                    CommonColors.gradientEnd,
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    marginTop: 20,
                    marginLeft: 20,
                    marginRight: 20,
                    height: 50,

                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    disabled={this.state.isDisable}
                    onPress={() => this.btnPurchaseTap()}>
                    <Text
                      style={{
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_BOLD,
                      }}>
                      Purchase Card
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity
                  style={{
                    height: 30,
                    marginBottom: 30,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.btnSkipTap()}>
                  <Text
                    style={{
                      fontFamily: ConstantKeys.Averta_REGULAR,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts14,
                    }}>
                    Skip this step
                  </Text>
                </TouchableOpacity>
              </ScrollView>
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
    flexDirection: 'row',
  },
});
