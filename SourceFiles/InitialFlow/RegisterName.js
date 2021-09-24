import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  View,
} from 'react-native';
import {CommonColors} from '../Constants/ColorConstant';
import LoadingView from '../Constants/LoadingView';
import Snackbar from 'react-native-snackbar';
import {Block, Button, ImageComponent, Text} from '../components';
import {hp, wp} from '../components/responsive';
import ValidationMsg from '../Constants/ValidationMsg';
import HeaderPreLogin from '../common/header';
import NeoInputField from '../components/neo-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import NeuButton from '../common/neu-element/lib/NeuButton';
import moment from 'moment';
import {strictValidString} from '../utils/commonUtils';
import {Modalize} from 'react-native-modalize';
import NeuView from '../common/neu-element/lib/NeuView';
export default class RegisterName extends Component {
  constructor(props) {
    super(props);
    this.modalizeRef = React.createRef();
    this.state = {
      isloading: false,
      txtFullName: '',
      isDisable: true,
      NameBorderColor: CommonColors.GhostColor,
      isFromTutorial: props.route.params.isFromTutorial,
      isDatePickerVisible: false,
      dob: null,
      gender: null,
    };
  }
  fomatDOB = (a) => {
    return moment(a).format('MM/DD/YYYY');
  };
  showDatePicker = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  handleConfirm = (date) => {
    this.setState({
      dob: this.fomatDOB(date),
    });
    console.log('A date has been picked: ', date);
    this.hideDatePicker();
  };
  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
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
      if (this.state.txtFullName === '') {
        this.showAlert(ValidationMsg.EmptyFullName);
      } else {
        this.props.navigation.navigate('RegisterEmail', {
          name: this.state.txtFullName,
          dob: this.state.dob,
          gender: this.state.gender,
        });
      }
    });
  };

  //Helper Methods For TextInput
  onFocus() {
    this.setState({
      NameBorderColor: CommonColors.SlateBlueColor,
    });
  }

  onBlur() {
    this.setState({
      NameBorderColor: CommonColors.GhostColor,
    });
  }

  render() {
    console.log(this.state.dob);
    return (
      <Block linear>
        <SafeAreaView />
        <Block padding={[hp(2), 0, 0]} space={'between'} row flex={false}>
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

          <View style={{alignItems: 'center', flex: 1}}>
            <ImageComponent
              resizeMode="contain"
              height={140}
              width={140}
              name={'nameBg'}
            />
          </View>

          {this.state.isFromTutorial === false ? (
            <TouchableOpacity
              style={{height: 40, width: 40}}
              activeOpacity={1}
            />
          ) : null}
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
            <HeaderPreLogin
              title={'Create Account'}
              subtitle={"What's your name?"}
            />
            <Block center flex={false} margin={[hp(1), 0, 0]}>
              <NeoInputField
                value={this.state.txtFullName}
                placeholder="Name"
                onChangeText={(txtFullName) => {
                  this.setState({txtFullName: txtFullName});
                }}
                fontColor="#707070"
              />
            </Block>
            <Block center flex={false} margin={[hp(2), 0, 0]}>
              <NeuButton
                onPress={() =>
                  this.setState({
                    isDatePickerVisible: true,
                  })
                }
                color="#eef2f9"
                width={wp(90)}
                height={hp(5)}
                containerStyle={styles.buttonStyle}
                borderRadius={16}>
                <Text grey size={14}>
                  {strictValidString(this.state.dob)
                    ? this.state.dob
                    : 'MM/DD/YYYY'}
                </Text>
                <Block flex={false} margin={[0, wp(2), 0, 0]}>
                  <ImageComponent
                    name="down_arrow_icon"
                    height={10}
                    width={16}
                  />
                </Block>
              </NeuButton>
            </Block>
            <Block center flex={false} margin={[hp(2), 0, 0]}>
              <NeuButton
                onPress={() => this.modalizeRef.current?.open()}
                color="#eef2f9"
                width={wp(90)}
                height={hp(5)}
                containerStyle={styles.buttonStyle}
                borderRadius={16}>
                <Text capitalize grey size={14}>
                  {strictValidString(this.state.gender)
                    ? this.state.gender
                    : 'Select Gender'}
                </Text>
                <Block flex={false} margin={[0, wp(2), 0, 0]}>
                  <ImageComponent
                    name="down_arrow_icon"
                    height={10}
                    width={16}
                  />
                </Block>
              </NeuButton>
            </Block>
          </ScrollView>
          <Block flex={false} margin={[0, 0, hp(3), 0]}>
            <Button
              disabled={!this.state.txtFullName}
              onPress={() => this.btnNextTap()}
              linear
              color="primary">
              Next
            </Button>
          </Block>
        </Block>

        {this.state.isloading ? <LoadingView /> : null}
        <DateTimePickerModal
          isVisible={this.state.isDatePickerVisible}
          mode="date"
          inline
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
        <Modalize
          adjustToContentHeight={true}
          tapGestureEnabled={false}
          handlePosition="inside"
          handleStyle={{backgroundColor: '#6B37C3'}}
          modalStyle={[{backgroundColor: '#F2F0F7'}]}
          ref={this.modalizeRef}>
          <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
            <Text semibold purple margin={[0, 0, hp(2)]} size={16} center>
              Select Gender
            </Text>
            <Block flex={false} margin={[hp(1), 0, 0]} center>
              <NeuButton
                onPress={() => {
                  this.setState({
                    gender: 'male',
                  });
                  this.modalizeRef.current?.close();
                }}
                color="#eef2f9"
                width={wp(90)}
                height={hp(5)}
                // containerStyle={styles.buttonStyle}
                borderRadius={16}>
                <Text grey size={14}>
                  Male
                </Text>
              </NeuButton>
            </Block>
            <Block center flex={false} margin={[hp(2), 0, 0]}>
              <NeuButton
                onPress={() => {
                  this.setState({
                    gender: 'female',
                  });
                  this.modalizeRef.current?.close();
                }}
                color="#eef2f9"
                width={wp(90)}
                height={hp(5)}
                borderRadius={16}>
                <Text grey size={14}>
                  Female
                </Text>
              </NeuButton>
            </Block>
            <Block center flex={false} margin={[hp(2), 0, 0]}>
              <NeuButton
                onPress={() => {
                  this.setState({
                    gender: 'transgender',
                  });
                  this.modalizeRef.current?.close();
                }}
                color="#eef2f9"
                width={wp(90)}
                height={hp(5)}
                borderRadius={16}>
                <Text grey size={14}>
                  Transgender
                </Text>
              </NeuButton>
            </Block>
          </Block>
        </Modalize>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  input: {
    backgroundColor: '#F2F0F7',
  },
  shadow: {
    width: wp(90),
    borderRadius: 6,
    shadowRadius: 20,
    backgroundColor: '#000',
  },

  neomorphStyle: {
    width: wp(90),
  },
  rightIcon: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
    height: hp(15),
    width: wp(18),
    resizeMode: 'contain',
  },
  leftIcon: {
    alignSelf: 'flex-end',
    marginRight: 20,
    height: hp(15),
    width: wp(20),
    resizeMode: 'contain',
  },
  linear: {
    marginLeft: 20,
  },
  buttonStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    flexDirection: 'row',
  },
});
