import React, {useState} from 'react';
import {Alert, FlatList, SafeAreaView} from 'react-native';
import {Block, ImageComponent, Text} from '../../../components';
import HeaderSettings from '../../../common/header-setting';
import {hp, wp} from '../../../components/responsive';
import {APIURL} from '../../../Constants/APIURL';
import Webservice from '../../../Constants/API';
import {showAlert} from '../../../utils/mobile-utils';
import LoadingView from '../../../Constants/LoadingView';
import {useFocusEffect} from '@react-navigation/core';
import {
  strictValidArrayWithLength,
  strictValidString,
} from '../../../utils/commonUtils';
import EmptyFile from '../../../components/emptyFile';
import SwitchNative from '../../../components/toggle';
import {light} from '../../../components/theme/colors';

const CardList = () => {
  const [loading, setloading] = useState(false);
  const [activeCards, setActiveCards] = useState([]);

  const changeStatus = async (id) => {
    setloading(true);
    Webservice.post(APIURL.ManageCardStatus, {
      id: id,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setloading(false);
          setActiveCards(response.data.data);
          getAssignedCards();
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        Alert.alert(error.message, '', {cancelable: false});
      });
  };
  const manageStatus = (id, status) => {
    if (status) {
      changeStatus(id);
    } else {
      Alert.alert(
        'Are You Sure ?',
        'Your profile information data has been lost from the clique card',
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              changeStatus(id);
            },
          },
        ],
      );
    }
  };
  const getAssignedCards = async (values, flagValue) => {
    setloading(true);
    Webservice.get(APIURL.AssignedCards, {})
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setloading(false);
          setActiveCards(response.data.data);
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        Alert.alert(error.message, '', {cancelable: false});
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getAssignedCards();
    }, []),
  );

  const _renderItem = ({item}) => {
    return (
      <Block
        flex={false}
        shadow
        center
        row
        space="between"
        color="#F2F0F7"
        borderRadius={16}
        padding={[hp(1.5), wp(3)]}
        margin={[hp(1), wp(1)]}>
        <Block flex={false} center row>
          <ImageComponent name="clique_icon" height={40} width={60} />
          <Block flex={false}>
            <Text margin={[0, wp(2)]} size={14} grey>
              {item.card_id}
            </Text>
            <Text
              margin={[0, wp(2)]}
              size={14}
              color={
                strictValidString(item.active_date)
                  ? light.purple
                  : light.danger
              }
              semibold>
              {strictValidString(item.active_date) ? 'Active' : 'In-Active'}
            </Text>
          </Block>
        </Block>
        <SwitchNative
          activeColor="red"
          value={strictValidString(item.active_date) ? true : false}
          onPress={(newState) => manageStatus(item.id, newState)}
          trackBarStyle={trackBar}
          trackBar={track}
          thumbButton={thumbButton}
        />
      </Block>
    );
  };
  return (
    <Block color="#F2EDFA">
      <SafeAreaView />
      <HeaderSettings title="Manage Cards/Tags" />
      <Block margin={[0, wp(3)]}>
        {strictValidArrayWithLength(activeCards) ? (
          <FlatList
            data={activeCards}
            renderItem={_renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <EmptyFile text="Assigned Cards not found" />
        )}
      </Block>
      {loading && <LoadingView />}
    </Block>
  );
};
const trackBar = {
  borderColor: '#fff',
  width: 62,
  height: 35,
  inActiveBackgroundColor: light.purple,
  activeBackgroundColor: '#E9E6ED',
};
const track = {
  borderWidth: 2,
  activeBackgroundColor: light.purple,
  inActiveBackgroundColor: '#E9E6ED',
  width: 60,
};

const thumbButton = {
  width: 29,
  height: 28,
  radius: 30,
  activeBackgroundColor: '#fff',
  inActiveBackgroundColor: '#fff',
  marginLeft: 10,
};
export default CardList;
