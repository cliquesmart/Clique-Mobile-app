import {useNavigation} from '@react-navigation/core';
import {CommonActions, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NeuView from '../../../common/neu-element/lib/NeuView';
import {Block, Button, ImageComponent, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {t1} from '../../../components/theme/fontsize';

const ActivatedCard = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  console.log(params);
  const {header, subtitle} = params;
  return (
    <Block linear>
      <SafeAreaView />
      <ScrollView bounces={false} contentContainerStyle={styles.container}>
        <Block row padding={[hp(2), wp(3), 0]} space="between" flex={false}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
        </Block>
        <Block center flex={false} margin={[hp(4), 0, 0]}>
          <ImageComponent
            resizeMode="contain"
            height={380}
            width={380}
            name={'activatdCard_icon'}
          />
        </Block>
        <Block flex={false} center margin={[hp(6), 0, 0]}>
          <Text
            center
            style={{width: wp(90)}}
            white
            regular
            size={28}
            semibold
            height={40}>
            {header}
          </Text>
          <Text
            margin={[t1, 0, 0]}
            center
            style={{width: wp(95)}}
            white
            regular
            size={28}>
            {subtitle}
          </Text>
          <Block flex={false} margin={[hp(1), 0]}>
            <ImageComponent name={'verified_icon'} height={40} width={40} />
          </Block>
        </Block>
        <Block flex={false} padding={[0, wp(3)]}>
          <Button
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  // index: 1,
                  routes: [
                    {
                      name: 'Dashboard',
                      state: {
                        routes: [{name: 'Profile'}],
                      },
                    },
                  ],
                }),
              )
            }
            color="primary">
            Back to Home
          </Button>
        </Block>
      </ScrollView>
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
export default ActivatedCard;
// Your Card/Tag Has{' '}
//  Been Activated!
