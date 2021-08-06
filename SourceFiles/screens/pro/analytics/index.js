import React from 'react';
import {Block, CustomButton, ImageComponent, Text} from '../../../components';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import NeuView from '../../../common/neu-element/lib/NeuView';
import {useNavigation} from '@react-navigation/core';
import {hp, wp} from '../../../components/responsive';
import {t1} from '../../../components/theme/fontsize';

const ProfileAnalytics = () => {
  const {goBack, navigate} = useNavigation();

  return (
    <Block linear>
      <SafeAreaView />
      <Block center padding={[hp(4), wp(3)]} flex={false}>
        <ImageComponent
          resizeMode="contain"
          height={64}
          width={169}
          name={'clique_pro_icon'}
        />
      </Block>
      <Block
        color={'#F2EDFA'}
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          bounces={false}>
          <CustomButton
            style={{overflow: 'hidden'}}
            onPress={() => navigate('AnalyticsView')}
            padding={[hp(3), 0, 0]}
            margin={[hp(2), wp(5), 0]}
            shadow
            borderRadius={15}
            primary
            flex={false}>
            <Block flex={false} padding={[0, wp(4)]}>
              <Block flex={false} row space="between">
                <Text purple semibold size={18}>
                  Pro Analytics
                </Text>
                <Text purple regular size={14}>
                  + 300 Clicks
                </Text>
              </Block>
              <Block margin={[t1, 0, 0]} style={{width: wp(60)}} flex={false}>
                <Text regular size={14} grey>
                  Unlock the most advanced digital business card in the world
                </Text>
              </Block>
            </Block>
            <ImageComponent name="pro_analyics_icon" height={90} width={383} />
          </CustomButton>
          <CustomButton
            onPress={() => navigate('UserMap')}
            padding={[0, wp(4), hp(0)]}
            margin={[hp(2), wp(5), 0]}
            shadow
            borderRadius={15}
            primary
            row
            style={{overflow: 'hidden'}}
            flex={false}>
            <Block padding={[hp(3), 0]} style={{width: wp(35)}} flex={false}>
              <Text purple semibold size={18}>
                Pro Map
              </Text>
              <Text margin={[t1, 0, 0]} regular size={14} grey>
                Unlock the most advanced digital business card in the world
              </Text>
            </Block>
            <Block flex={false} margin={[-hp(2), 0, 0]}>
              <ImageComponent name="map_pro_icon" height={200} width={350} />
            </Block>
          </CustomButton>
        </ScrollView>
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
});
export default ProfileAnalytics;
