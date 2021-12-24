import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';

//Constants
import {CommonColors} from '../../Constants/ColorConstant';
import {ConstantKeys} from '../../Constants/ConstantKey';
import {SetFontSize} from '../../Constants/FontSize';
import {APIURL} from '../../Constants/APIURL';
import {Block, ImageComponent, Text} from '../../components';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/commonUtils';
import {hp, wp} from '../../components/responsive';
import NeuView from '../../common/neu-element/lib/NeuView';
import {OpenLinks} from '../../utils/mobile-utils';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import EmptyFile from '../../components/emptyFile';
const UserProfile = () => {
  const [profileData] = useSelector((v) => [v.profile.data]);
  const {goBack} = useNavigation();

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
              {item.fade_out === 1 && (
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
              )}
            </>
          );
        }}
      />
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
              strictValidArrayWithLength(profileData.social) ? (
                renderSocialIcons(profileData.social, 'social')
              ) : (
                <EmptyFile text="Social Contact's not found" />
              )}
            </>
          )}

          {profileData.account_flag === 'business' && (
            <>
              {strictValidObjectWithKeys(profileData) &&
              strictValidArrayWithLength(profileData.business) ? (
                renderSocialIcons(profileData.business, 'business')
              ) : (
                <EmptyFile text="Business Contact's not found" />
              )}
            </>
          )}
          {profileData.account_flag === 'hospital' && (
            <>
              <EmptyFile text="Contact's not found" />
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
