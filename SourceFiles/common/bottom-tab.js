import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../components/Text';
import {hp, wp} from '../components/responsive';
import ResponsiveImage from 'react-native-responsive-image';
import {images} from '../Assets/Images/images';
import LinearGradient from 'react-native-linear-gradient';
import {Block} from '../components';
import NeuView from './neu-element/lib/NeuView';
import NeuButton from './neu-element/lib/NeuButton';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create({
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF6FF',
    paddingHorizontal: wp(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: hp(3),
    paddingTop: hp(1),
  },
  neoFirstContainer: {
    shadowRadius: 3,
    backgroundColor: '#F2F0F7',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  neoSubContainer: {
    borderRadius: 10,
    shadowRadius: 8,
    backgroundColor: '#F2F0F7',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linear: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 60,
  },
  proContainer: {
    marginTop: -hp(4),
  },
  allContainer: {
    marginTop: 0,
  },
});

const tabImages = {
  Profile: 'contact_icon',
  Nearby: 'location_icon',
  Pro: '',
  Chat: 'message_icon',
  Setting: 'setting_icon',
};

const renderHeightWidth = (type) => {
  switch (type) {
    case 'Profile':
      return 30;
    case 'Nearby':
      return 32;
    case 'Chat':
      return 32;
    default:
      return 32;
  }
};

const BottomTab = ({state, descriptors, navigation}) => {
  const [profile, loading] = useSelector((v) => [
    v.profile.data,
    v.profile.loading,
  ]);
  return (
    <View style={styles.ButtonContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'Pro' && profile.is_pro === '0') {
              navigation.navigate('ProCard');
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            style={
              tabImages[label] === ''
                ? styles.proContainer
                : styles.allContainer
            }
            accessibilityRole="button"
            testID={options.tabBarTestID}
            onLongPress={onLongPress}
            accessibilityStates={isFocused ? ['selected'] : []}
            onPress={onPress}>
            <>
              {label === 'Pro' && (
                <LinearGradient
                  style={styles.linear}
                  colors={['#E866B6', '#6961FF']}>
                  <Text size={14} white semibold>
                    PRO
                  </Text>
                </LinearGradient>
              )}
              {tabImages[label] === '' ? (
                <Block flex={false} padding={[0, 0, hp(1), 0]} />
              ) : isFocused ? (
                <NeuButton
                  color="#F2F0F7"
                  width={40}
                  height={40}
                  borderRadius={10}>
                  <Block flex={false} margin={[hp(0.5), 0, 0]}>
                    <ResponsiveImage
                      source={
                        isFocused
                          ? images[`${tabImages[label]}f`]
                          : images[tabImages[label]]
                      }
                      initHeight={renderHeightWidth(label)}
                      initWidth={renderHeightWidth(label)}
                    />
                  </Block>
                </NeuButton>
              ) : (
                !isFocused && (
                  <NeuView
                    // convex
                    concave
                    color="#F2F0F7"
                    height={40}
                    width={40}
                    borderRadius={10}
                    inset>
                    <Block flex={false} margin={[hp(0.5), 0, 0]}>
                      <ResponsiveImage
                        source={
                          isFocused
                            ? images[`${tabImages[label]}f`]
                            : images[tabImages[label]]
                        }
                        initHeight={renderHeightWidth(label)}
                        initWidth={renderHeightWidth(label)}
                      />
                    </Block>
                  </NeuView>
                )
              )}
            </>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

BottomTab.propTypes = {
  state: PropTypes.shape(PropTypes.object),
};
BottomTab.defaultProps = {
  state: 'Search here',
};

export default BottomTab;
