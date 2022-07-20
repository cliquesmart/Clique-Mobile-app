import React, {useState} from 'react';
import {Linking, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import HeaderSettings from '../../common/header-setting';
import {hp, wp} from '../../components/responsive';
import NeuView from '../../common/neu-element/lib/NeuView';
import NeuButton from '../../common/neu-element/lib/NeuButton';
import {Block, Text, ImageComponent, CustomButton} from '../../components';
import {useNavigation, CommonActions} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import {CommonColors} from '../../Constants/ColorConstant';

const Settings = () => {
  const [card, setCard] = React.useState('Social');
  const [nfc, setNfc] = React.useState(true);
  const navigation = useNavigation();
  const [radius, setRadius] = useState(236);

  const renderOptions = () => {
    return (
      <Block middle center margin={[hp(2), 0, 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(90)}
          borderRadius={16}
          containerStyle={styles.neoContainer}
          inset>
          {card ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(45)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                Enabled
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(1), width: wp(42)}]}
              onPress={() => setCard(true)}
              grey
              regular
              center
              size={13}>
              Enabled
            </Text>
          )}
          {!card ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(45)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text
                semibold
                onPress={() => setCard(false)}
                purple
                center
                size={13}>
                Disabled
              </Text>
            </NeuButton>
          ) : (
            <Text
              center
              style={[styles.inactiveText, {marginLeft: wp(1), width: wp(42)}]}
              onPress={() => setCard(false)}
              grey
              regular
              size={13}>
              Disabled
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };
  const renderNfcOptions = () => {
    return (
      <Block middle center margin={[hp(2), 0, 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(90)}
          borderRadius={16}
          containerStyle={styles.neoContainer}
          inset>
          {nfc ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(45)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                Enabled
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(1), width: wp(42)}]}
              onPress={() => setNfc(true)}
              grey
              regular
              center
              size={13}>
              Enabled
            </Text>
          )}
          {!nfc ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(45)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text
                semibold
                onPress={() => setNfc(false)}
                purple
                center
                size={13}>
                Disabled
              </Text>
            </NeuButton>
          ) : (
            <Text
              center
              style={[styles.inactiveText, {marginLeft: wp(1), width: wp(42)}]}
              onPress={() => setNfc(false)}
              grey
              regular
              size={13}>
              Disabled
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };
  const renderSelectType = (title, nav) => {
    return (
      <CustomButton
        onPress={() => navigation.navigate(nav)}
        activeOpacity={0.7}
        center
        margin={[hp(3), 0, 0]}
        flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(90)}
          borderRadius={16}
          containerStyle={styles.navStyle}
          inset>
          <Text regular left grey size={13}>
            {title}
          </Text>
          <ImageComponent name="arrow_back_icon" height={12} width={16} />
        </NeuView>
      </CustomButton>
    );
  };

  const signOut = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      navigation.dispatch({
        ...CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
              state: {
                routes: [
                  {
                    name: 'Login',
                    params: {},
                  },
                ],
              },
            },
          ],
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Block color="#F2EDFA">
      <SafeAreaView />
      <HeaderSettings title="Settings" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(2)}}>
        <Block flex={false} padding={[0, wp(3)]}>
          <Text uppercase size={18} grey semibold>
            Card Settings
          </Text>
          {renderOptions('Enabled', 'Disabled')}
          {/* {renderSelectTypeView('Lost My Card')}
          {renderSelectTypeView('Sync Card')} */}
          <Text uppercase size={18} margin={[hp(2), 0, 0]} grey semibold>
            Nfc Settings
          </Text>
          {renderNfcOptions('Enabled', 'Disabled')}
          {/* {renderSelectTypeView('Lost my NFC Tag')}
          {renderSelectTypeView('Sync NFC Tag')} */}
          <Text size={18} margin={[hp(2), 0, 0]} grey semibold>
            Other Settings
          </Text>
          {renderSelectType('Manage Cards/Tags', 'CardList')}
          {renderSelectType('Change Password', 'ChangePasswordSettings')}

          {/* {renderSelectType('Help and Tutorials', 'HelpAndTutorials')} */}
          {/* <Text size={18} margin={[hp(2), 0, 0]} grey semibold>
            Radius
          </Text>
          <Slider
            minimumTrackTintColor={CommonColors.PurpleColor}
            maximumValue={300}
            minimumValue={0}
            style={{width: '100%'}}
            onValueChange={(val) => setRadius(val)}
            thumbTintColor="#fff"
            step={1}
            value={radius}
          />
          <Block row space="between">
            <Text size={18} margin={[hp(2), 0, 0]} grey semibold>
              0
            </Text>
            <Text size={18} margin={[hp(2), 0, 0]} grey semibold>
              Selected Value : {radius}
            </Text>
            <Text size={18} margin={[hp(2), 0, 0]} grey semibold>
              300
            </Text>
          </Block> */}
        </Block>
      </ScrollView>

      <Block flex={false} padding={[hp(2), wp(3)]}>
        <Text
          onPress={() => signOut()}
          margin={[hp(2), 0, 0]}
          size={18}
          red
          semibold>
          Sign Out
        </Text>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  neomorphStyle: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeNeomorph: {
    borderRadius: 10,
    shadowRadius: 6,
    backgroundColor: '#F2F0F7',
    padding: hp(1),
  },
  inactiveText: {
    width: wp(20),
  },
  containerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  neoContainer: {flexDirection: 'row'},
  navStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
});
export default Settings;
