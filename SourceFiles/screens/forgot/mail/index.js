import React, {Component} from 'react';
import {StyleSheet, ScrollView, SafeAreaView, Image} from 'react-native';

//Constant Files
import {CommonColors} from '../../../Constants/ColorConstant';
import {SetFontSize} from '../../../Constants/FontSize';
import {ConstantKeys} from '../../../Constants/ConstantKey';
import {images} from '../../../Assets/Images/images';
import {Block, ImageComponent, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {useNavigation, useRoute} from '@react-navigation/core';
const ForgotPasswordTwo = () => {
  const {navigate} = useNavigation();
  const {params} = useRoute();
  return (
    <Block linear>
      <SafeAreaView />
      <ScrollView contentContainerStyle={{flexGrow: 1}} bounces={false}>
        <Block flex={false} center>
          <ImageComponent
            resizeMode="contain"
            height={140}
            width={140}
            name={'nameBg'}
          />
        </Block>
        <Block
          backgroundColor={'#FDFFFF'}
          borderTopRightRadius={30}
          borderTopLeftRadius={30}
          middle
          padding={[0, wp(3)]}>
          <Text
            style={{
              color: CommonColors.PurpleColor,
              fontSize: SetFontSize.ts25,
            }}
            center
            size={30}
            color={CommonColors.PurpleColor}
            semibold
            white
            margin={[hp(4), 0]}>
            {"We've sent you \n an email"}
          </Text>

          <Image
            style={{
              alignSelf: 'center',
              height: hp(40),
              width: wp(80),
              resizeMode: 'contain',
            }}
            source={images.resetBell}
          />

          <Text style={txtSignUp}>
            To activate your account you {'\n'}need to click on the link we've
            {'\n'} sent to te**@clique.com
          </Text>

          <Text
            style={txtAlreadyAccount}
            onPress={() =>
              navigate('RecoverPassword', {
                email: params.email,
              })
            }>
            Set a new password
          </Text>
        </Block>
      </ScrollView>
    </Block>
  );
};

const txtSignUp = {
  color: '#707070',
  fontSize: SetFontSize.ts16,
  fontFamily: ConstantKeys.Averta_REGULAR,
  textAlign: 'center',
  marginTop: 10,
};

const txtAlreadyAccount = {
  marginLeft: 20,
  marginRight: 20,
  marginTop: 20,
  textAlign: 'center',
  flexDirection: 'row',
  marginBottom: 25,
  fontFamily: ConstantKeys.Averta_REGULAR,
  fontSize: SetFontSize.ts14,
  color: CommonColors.PurpleColor,
  textDecorationLine: 'underline',
};

export default ForgotPasswordTwo;
