import React from 'react';
import {Block, ImageComponent, Text, Button} from '../../components';
import {TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import NeuView from '../../common/neu-element/lib/NeuView';
import {useNavigation} from '@react-navigation/core';
import {light} from '../../components/theme/colors';
import {hp, wp} from '../../components/responsive';
import {t1, t2} from '../../components/theme/fontsize';

const Pro = () => {
  const {goBack, navigate} = useNavigation();

  const renderLinks = (icon, title, subtitle) => {
    return (
      <Block style={{width: wp(50)}} margin={[t2, 0]} center flex={false}>
        <ImageComponent name={icon} height={32} width={32} />
        <Text size={18} margin={[t1, 0, 0]} semibold white>
          {title}
        </Text>
        <Text margin={[hp(0.5), 0, 0]} center color="#F2EDFA" regular size={14}>
          {subtitle}
        </Text>
      </Block>
    );
  };
  return (
    <Block linear>
      <SafeAreaView />
      <ScrollView>
        <Block center padding={[hp(2), wp(3)]} right flex={false}>
          <TouchableOpacity onPress={() => goBack()}>
            <NeuView
              concave
              color="#BC60CB"
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#AF2DA5', '#BC60CB']}>
              <ImageComponent
                resizeMode="contain"
                height={14}
                width={14}
                name={'close_icon'}
                color={'#fff'}
              />
            </NeuView>
          </TouchableOpacity>
        </Block>
        <Block flex={false} center>
          <ImageComponent
            resizeMode="contain"
            height={64}
            width={169}
            name={'clique_pro_icon'}
          />
          <Block flex={false} style={{width: wp(70)}} margin={[hp(3), 0, 0]}>
            <Text center color="#F2EDFA" regular size={16}>
              Unlock the most advanced digital business card in the world
            </Text>
          </Block>
          {renderLinks(
            'swap_icon',
            'Personal/Business',
            'Switch between personal and business profiles easily',
          )}
          {renderLinks(
            'broken_link_icon',
            'Custom Links',
            'Add unlimited custom links with custom titles',
          )}
          {renderLinks(
            'data_analysis_icon',
            'Pro Analytics',
            'Track your profile and improve your results',
          )}
        </Block>
        <Block padding={[hp(3), wp(4)]}>
          <Button
            onPress={() =>
              navigate('Payment', {
                title: 'Monthly $ 4.99 / month',
                type: 'Monthly',
                price: 4.99,
              })
            }
            color="primary">
            Monthly $ 4.99 / month
          </Button>
          <Button
            onPress={() =>
              navigate('Payment', {
                title: 'Yearly $ 3.99 / year (SAVE 20%)',
                type: 'Yearly',
                price: 3.99 * 12,
              })
            }
            color="secondary">
            Yearly $ 3.99 / year (SAVE 20%)
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default Pro;
