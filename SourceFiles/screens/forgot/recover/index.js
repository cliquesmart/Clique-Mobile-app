import React from 'react';
import {ScrollView, SafeAreaView, FlatList, StyleSheet} from 'react-native';

//Constant Files
import {CommonColors} from '../../../Constants/ColorConstant';
import {Block, Button, ImageComponent, Input, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {Neomorph, Shadow} from 'react-native-neomorph-shadows';
import NeoInputField from '../../../components/neo-input';
import {renderValidationText} from '../../../utils/constants';

const RecoverPassword = () => {
  const renderIcons = () => {
    return (
      <Block row space={'between'} flex={false} margin={[hp(4), wp(2), 0]}>
        <Block flex={false} margin={[hp(4), 0, 0]}>
          <ImageComponent name="orangeCloud" height={100} width={100} />
        </Block>
        <ImageComponent name="behance" height={60} width={60} />
      </Block>
    );
  };
  return (
    <Block linear>
      <SafeAreaView />
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <Block flex={false} center>
          <ImageComponent
            resizeMode="contain"
            height={140}
            width={140}
            name={'nameBg'}
          />
        </Block>
        <Block
          flex={1}
          color={'#F2EDFA'}
          borderTopRightRadius={30}
          borderTopLeftRadius={30}
          padding={[0, wp(3), hp(2), wp(3)]}>
          <ScrollView>
            <Text
              purple
              center
              size={25}
              color={CommonColors.PurpleColor}
              semibold
              margin={[hp(4), 0]}>
              Recover Password
            </Text>
            <Block margin={[0, 0, hp(1)]} flex={false} center>
              <NeoInputField
                placeholder={'Password'}
                fontColor="#707070"
                icon="eye"
                secure
              />
              <Block flex={false} margin={[hp(1), 0]} />
              <NeoInputField
                placeholder={'Confirm Password'}
                fontColor="#707070"
                icon="eye"
                secure
              />
            </Block>
            <Block row margin={[hp(1), wp(2)]} flex={false}>
              <Text grey size={14}>
                You’re almost there!
              </Text>
              <FlatList
                data={[1, 2, 3, 4, 5, 6]}
                horizontal
                contentContainerStyle={styles.flatlist}
                scrollEnabled={false}
                renderItem={({item}) => {
                  return (
                    <Block
                      flex={false}
                      borderRadius={10}
                      margin={[0, wp(0.7)]}
                      style={styles.dot}
                    />
                  );
                }}
              />
            </Block>

            {renderValidationText()}
          </ScrollView>
          <Block flex={false} padding={[0, wp(3)]}>
            <Button linear color="primary">
              Reset Password
            </Button>
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  input: {
    shadowColor: '#BBC3CE',
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
  },
  flatlist: {
    alignSelf: 'flex-end',
    flexGrow: 1,
    flexDirection: 'row-reverse',
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: '#4BE351',
  },
  container: {flexGrow: 1},
  shadow: {
    shadowOpacity: 0.1, // <- and this or yours opacity
    shadowRadius: 15,
    borderRadius: 50,
  },
});
export default RecoverPassword;
