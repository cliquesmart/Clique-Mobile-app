import React from 'react';
import {FlatList, Platform, SafeAreaView, StyleSheet} from 'react-native';
import HeaderSettings from '../../../common/header-setting';
import NeuButton from '../../../common/neu-element/lib/NeuButton';
import NeuView from '../../../common/neu-element/lib/NeuView';
import {Block, Button, ImageComponent, Text} from '../../../components';
import NeoInputField from '../../../components/neo-input';
import {hp, wp} from '../../../components/responsive';
const HelpAndTutorials = () => {
  const [activeOptions, setactiveOptions] = React.useState('most');
  const renderOptions = (value1, value2) => {
    return (
      <Block middle center margin={[hp(4), 0, 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(90)}
          borderRadius={16}
          containerStyle={styles.neoContainer}
          inset>
          {activeOptions === 'most' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(45)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                {value1}
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(1), width: wp(42)}]}
              onPress={() => setactiveOptions('most')}
              grey
              regular
              center
              size={13}>
              {value1}
            </Text>
          )}
          {activeOptions === 'recent' ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(45)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text
                semibold
                onPress={() => setactiveOptions('recent')}
                purple
                center
                size={13}>
                {value2}
              </Text>
            </NeuButton>
          ) : (
            <Text
              center
              style={[styles.inactiveText, {marginLeft: wp(1), width: wp(42)}]}
              onPress={() => setactiveOptions('recent')}
              grey
              regular
              size={13}>
              {value2}
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };

  const _renderItem = () => {
    return (
      <Block center margin={[hp(2), 0, hp(1)]}>
        <Block
          shadow
          center
          row
          height={Platform.OS === 'ios' ? hp(26) : hp(29)}
          color="#F2F0F7"
          borderRadius={16}>
          <ImageComponent
            name="help_icon"
            height={210}
            width={130}
            radius={16}
          />
          <Block margin={[hp(2), wp(4)]} flex={false}>
            <Block margin={[0, wp(3), hp(0.5), 0]} flex={false}>
              <ImageComponent
                name="most_searched_icon"
                height={30}
                width={30}
              />
            </Block>
            <Text style={styles.textWidth} gutterBottom size={16} grey>
              June 18th - 6min read
            </Text>
            <Text style={styles.textWidth} gutterBottom semibold purple>
              How to Create an Event?
            </Text>
            <Button style={{width: wp(40)}} linear color="primary">
              Read This
            </Button>
          </Block>
        </Block>
      </Block>
    );
  };
  return (
    <Block color="#F2EDFA">
      <SafeAreaView />
      <HeaderSettings title="Help And Tutorials" />
      <Block margin={[hp(2), 0, 0]} flex={false} center>
        <NeoInputField
          leftIcon={'MinUserIcon'}
          icon=""
          placeholder="How can we help?"
        />
        {renderOptions('Most Searched', 'News')}
      </Block>
      <FlatList
        data={[1, 2]}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
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
  helpView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  textWidth: {width: wp(50)},
});

export default HelpAndTutorials;
