import React, { Component } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Image, Dimensions,
  FlatList, Alert, PermissionsAndroid
} from 'react-native';

//Constants
import { CommonColors } from '../Constants/ColorConstant';
import { IMG } from '../Constants/ImageConstant';
import { ConstantKeys } from '../Constants/ConstantKey'
import { SetFontSize } from '../Constants/FontSize'
import LoadingView from '../Constants/LoadingView'
import Webservice from '../Constants/API'
import ValidationMsg from '../Constants/ValidationMsg'
import { APIURL } from '../Constants/APIURL'

//Third Party
import { DrawerActions } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image'
import { Neomorph, Shadow, NeomorphFlex } from 'react-native-neomorph-shadows';


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {

      isloading: false,
      userData: {},
      user: {},
      arrContactList: [],
    };
  }


  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener('focus',
      () => this.getData()

    )

  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
      if (value !== null) {

        // value previously stored
        console.log("User Data: " + value)
        var userData = JSON.parse(value)
        var user = userData.user

        this.setState({ userData: userData, user: user })

        this.API_CONTACT_LIST(true, user.user_id,)
      }
      else {
        console.log("User Data: null " + value)
      }
    } catch (e) {
      console.log("Error : " + e)
    }
  }


  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily : ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  }


  API_CONTACT_LIST(isload, user_id) {

    this.setState({ isloading: isload })
    Webservice.post(APIURL.addContactList, {
      user_id: user_id,
    })
      .then(response => {

        if (response.data == null) {
          this.setState({ isloading: false });
          // alert('error');
          alert(response.originalError.message);
          return
        }
        //   console.log(response);

        console.log('Get Contact Data Response : ' + JSON.stringify(response.data))

        if (response.data.status) {
          this.setState({ arrContactList: response.data.data, isloading: false })
        } else {
          this.setState({ arrContactList: [], isloading: false })
          this.showAlert(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error.message)
        this.setState({ arrContactList: [], isloading: false });
        Alert.alert(error.message, "", [
          {
            text: 'Try Again',
            onPress: () => {
              this.API_CONTACT_LIST(true, this.state.user.user_id)
            }
          },
        ],
          { cancelable: false })
      })
  }


  API_REMOVE_CONTACT(isload, contact_id) {

    this.setState({ isloading: isload })
    Webservice.post(APIURL.removeContact, {
      user_id: this.state.user.user_id,
      contact_id: contact_id
    })
      .then(response => {

        if (response.data == null) {
          this.setState({ isloading: false });
          // alert('error');
          alert(response.originalError.message);
          return
        }
        //   console.log(response);

        console.log('Get Remove Contact Response : ' + JSON.stringify(response.data))

        if (response.data.status) {

          this.setState({ isloading: false })
          this.showAlert(response.data.message)
          this.API_CONTACT_LIST(true, this.state.user.user_id)
        } else {
          this.setState({ isloading: false })
          this.showAlert(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error.message)
        this.setState({ isloading: false });
      })
  }


  //Action Methods
  btnMenuTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    })
  }


  btnRemoveContactTap = (item) => {
    requestAnimationFrame(() => {

      Alert.alert(ValidationMsg.AppName, "Are you sure you remove this contact?", [
        {
          text: 'Yes',
          onPress: () => {
            this.API_REMOVE_CONTACT(false, item.contact_id)
          }
        },
        {
          text: 'No',
          onPress: () => {

          }
        },
      ],
        { cancelable: true })


    })
  }

  selectProfileTap = (item) => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('UserProfile', { profile_id: item.contact_id })
    })
  }

  render() {

    let BackIcon = IMG.OtherFlow.BackIcon
    let RightArrowIcon = IMG.OtherFlow.RightArrowIcon

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: CommonColors.appBarColor }} />

        <StatusBar barStyle={'light-content'}
          backgroundColor={CommonColors.appBarColor}
        />
        <SafeAreaView style={styles.container}>

          <View style={{ flex: 1, backgroundColor: CommonColors.primaryColor }}>

            <View style={styles.headerView}>


              <Text style={styles.headerText}>Home</Text>

            </View>

            <View style={{ flex: 1 }}>

              {this.state.userData != null ?
                <View style={{ marginLeft: 20, marginRight: 20, marginTop: 20, flexDirection: 'row' }}>
                  <FastImage style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={{ uri: APIURL.ImangeURL + this.state.user.avatar }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View style={{ flex: 1, marginLeft: 20, justifyContent: 'center' }}>
                    <Text style={{ color: CommonColors.whiteColor, fontSize: SetFontSize.ts14, fontFamily: ConstantKeys.Averta_REGULAR }}>Hello,</Text>
                    <Text style={{ marginTop: 5, color: CommonColors.whiteColor, fontSize: SetFontSize.ts16, fontFamily: ConstantKeys.Averta_BOLD }}>
                      {this.state.user.name}
                    </Text>
                  </View>
                </View>
                : null}


              {this.state.arrContactList.length != 0 ?
                <View style={{ flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, }}>
                  <Text style={{
                    marginLeft: 20, marginRight: 20, marginTop: 20, textAlign: 'left',
                    fontSize: SetFontSize.ts16, color: CommonColors.whiteColor, fontFamily: ConstantKeys.Averta_BOLD
                  }}>
                    Your contact list
              </Text>


                  <FlatList style={{ marginTop: 10, }}
                    data={this.state.arrContactList}
                    bounces={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (

                      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.3, borderBottomColor: CommonColors.inActiveColor }}
                        onPress={() => this.selectProfileTap(item)}>

                        <FastImage style={{ height: 60, width: 60, borderRadius: 30, alignSelf: 'center', marginLeft: 20, marginTop: 15, marginBottom: 15 }}
                          source={{ uri: this.state.userData.asset_url + item.avatar }}
                          resizeMode={FastImage.resizeMode.cover} />

                        <View style={{ flex: 1, marginLeft: 15, marginTop: 15, justifyContent: 'center', marginBottom: 15 }}>
                          <Text style={{ flex: 1, fontFamily: ConstantKeys.Averta_BOLD, fontSize: SetFontSize.ts16, color: CommonColors.whiteColor }}
                            numberOfLines={1}>
                            {item.name}
                          </Text>

                          {item.job_position != '' ?
                            <Text style={{ flex: 1, fontFamily: ConstantKeys.Averta_REGULAR, fontSize: SetFontSize.ts16, color: CommonColors.whiteColor, }}
                              numberOfLines={2}>
                              {item.job_position}
                            </Text>
                            : null}
                        </View>

                        <Image source={RightArrowIcon}
                          style={{ marginRight: 20, height: 20, width: 20, resizeMode: 'contain', marginTop: 15, marginBottom: 15 }}
                        />

                      </TouchableOpacity>
                    )}
                  />
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 30, borderTopRightRadius: 30, }}>
                  <Text style={styles.txtNoData}>No data found</Text>
                </View>
              }

              {this.state.isloading ?
                <LoadingView />
                : null
              }
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
    backgroundColor: CommonColors.primaryColor
  },
  headerView: {
    height: 74, width: '100%', backgroundColor: CommonColors.appBarColor,
    alignItems: 'center', flexDirection: 'row',
  },
  btnBack: {
    width: 30, height: 30, justifyContent: 'center',
    alignItems: 'center', marginLeft: 20
  },
  headerText: {
    fontFamily: ConstantKeys.Averta_BOLD, fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor, flex: 1, textAlign: 'center'
  },
  txtNoData: {
    fontFamily: ConstantKeys.POPPINS_REGULAR, fontSize: SetFontSize.ts18,
    color: CommonColors.whiteColor
  },
})