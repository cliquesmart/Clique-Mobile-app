import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

//Constants
import {CommonColors} from '../../Constants/ColorConstant';
import {ConstantKeys} from '../../Constants/ConstantKey';
import {SetFontSize} from '../../Constants/FontSize';
import LoadingView from '../../Constants/LoadingView';
import Webservice from '../../Constants/API';
import {APIURL} from '../../Constants/APIURL';
import ValidationMsg from '../../Constants/ValidationMsg';

//Third Party
import Snackbar from 'react-native-snackbar';
import Clipboard from '@react-native-clipboard/clipboard';
import {Block, Button, ImageComponent, Text} from '../../components';
import {
  strictValidArray,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {hp, wp} from '../../components/responsive';
import NeuView from '../../common/neu-element/lib/NeuView';
import {OpenLinks} from '../../utils/mobile-utils';
import {light} from '../../components/theme/colors';
import NeuButton from '../../common/neu-element/lib/NeuButton';
import {useNavigation, useRoute} from '@react-navigation/native';
const UserProfile = () => {
  const [activeOptions, setActiveOptions] = useState('social');
  const {params} = useRoute();
  const [profileData, setProfileData] = useState(params.data);
  const {navigate, goBack} = useNavigation();
  const showAlert = (text) => {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  };
  const btnBackTap = () => {
    requestAnimationFrame(() => {
      goBack();
    });
  };
  const renderHeader = () => {
    return (
      <Block center padding={[hp(2), wp(3)]} space="between" flex={false} row>
        <TouchableOpacity onPress={() => goBack()}>
          <NeuView
            concave
            color={'#775DF2'}
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#775DF2', '#5A28AE']}>
            <ImageComponent
              resizeMode="contain"
              height={14}
              width={14}
              name={'BackIcon'}
              color="#F2EDFA"
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };
  const renderProfile = () => {
    return (
      <Block margin={[0, wp(3), hp(2)]} center flex={false} row>
        {strictValidObjectWithKeys(profileData) &&
          strictValidString(profileData.avatar) && (
            <Block
              flex={false}
              borderWidth={3}
              borderRadius={80}
              borderColor={'#fff'}>
              <ImageComponent
                isURL
                name={`${APIURL.ImageUrl}${profileData.avatar}`}
                height={80}
                width={80}
                radius={80}
              />
            </Block>
          )}
        <Block margin={[0, 0, 0, wp(3)]} flex={false}>
          <Text capitalize white bold size={24}>
            {strictValidObjectWithKeys(profileData) && profileData.name}
          </Text>
          {strictValidObjectWithKeys(profileData) &&
            strictValidString(profileData.bio) && (
              <Text
                style={{width: wp(55)}}
                capitalize
                margin={[hp(0.5), 0, 0]}
                size={14}
                white
                numberOfLines={3}
                regular>
                {profileData.bio}
              </Text>
            )}
        </Block>
      </Block>
    );
  };
  const renderSocialIcons = (data, type) => {
    return (
      <FlatList
        contentContainerStyle={styles.socialIcons}
        numColumns={4}
        bounces={false}
        data={data}
        renderItem={({item}) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => OpenLinks(item.icone.name, item.username)}
                style={{paddingHorizontal: wp(1), marginTop: hp(2)}}>
                {strictValidObjectWithKeys(item.icone) && (
                  <ImageComponent
                    isURL
                    name={`${APIURL.iconUrl}${item.icone.url}`}
                    height={Platform.OS === 'ios' ? hp(10) : 67}
                    width={Platform.OS === 'ios' ? hp(10) : 67}
                  />
                )}
              </TouchableOpacity>
            </>
          );
        }}
      />
    );
  };
  const renderOptions = () => {
    return (
      <Block middle center margin={[hp(2), 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(45)}
          borderRadius={16}
          containerStyle={styles.neoContainer}
          inset>
          {activeOptions === 'social' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(20)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                Social
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(1)}]}
              onPress={() => this.setActiveState('social')}
              grey
              regular
              center
              size={13}>
              Social
            </Text>
          )}
          {activeOptions === 'business' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(20)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text
                semibold
                onPress={() => this.setActiveState('business')}
                purple
                center
                size={13}>
                Business
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText]}
              onPress={() => this.setActiveState('business')}
              grey
              regular
              center
              size={13}>
              Business
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };
  return (
    <Block linear>
      {console.log(profileData, 'profileData')}
      <SafeAreaView />
      {renderHeader()}
      {renderProfile()}
      <Block
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        padding={[hp(2), wp(2)]}
        color="#F2EDFA">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          bounces={false}>
          <Text margin={[hp(1), 0]} grey regular size={16} center>
            {strictValidObjectWithKeys(profileData) &&
              `${profileData.name}'s${' Contacts:'}`}
          </Text>
          {profileData.account_flag === 'social' && (
            <>
              {strictValidObjectWithKeys(profileData) &&
                strictValidArray(profileData.social) &&
                renderSocialIcons(profileData.social, 'social')}
            </>
          )}

          {profileData.account_flag === 'business' && (
            <>
              {strictValidObjectWithKeys(profileData) &&
                strictValidArray(profileData.business) &&
                renderSocialIcons(profileData.business, 'business')}
            </>
          )}
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  inactiveText: {
    width: wp(20),
  },
  neoContainer: {
    flexDirection: 'row',
  },
});
export default UserProfile;
