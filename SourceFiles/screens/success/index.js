import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, SafeAreaView, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Button, ImageComponent} from '../../components';
import {hp, wp} from '../../components/responsive';

const Success = () => {
  const {goBack} = useNavigation();

  const onSubmit = () => {};
  return (
    <Block linear>
      <SafeAreaView />

      <Block padding={[hp(2), wp(3), 0]} space="between" flex={false} row>
        <TouchableOpacity onPress={() => goBack()}>
          <LinearGradient colors={['#5542B6', '#7653DB']} style={styles.linear}>
            <ImageComponent
              resizeMode="contain"
              height={14}
              width={14}
              name={'BackIcon'}
            />
          </LinearGradient>
        </TouchableOpacity>

        <ImageComponent
          resizeMode="contain"
          height={140}
          width={140}
          name={'nameBg'}
        />
        <TouchableOpacity style={styles.linear} />
      </Block>
      <Block
        color={'#F2EDFA'}
        borderTopRightRadius={30}
        borderTopLeftRadius={30}
        padding={[0, wp(3)]}>
        <Block flex={false} margin={[0, 0, hp(4), 0]}>
          <Button onPress={() => onSubmit()} linear color="primary">
            Go To Profile
          </Button>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default Success;
