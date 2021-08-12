/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import HeaderPostLogin from '../../../common/header-post-login';
import Neomorph from '../../../common/shadow-src/Neomorph';
import {Block, CustomButton, ImageComponent, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {APIURL} from '../../../Constants/APIURL';
import Webservice from '../../../Constants/API';
import {showAlert} from '../../../utils/mobile-utils';
import LoadingView from '../../../Constants/LoadingView';
import {light} from '../../../components/theme/colors';
import EmptyFile from '../../../components/emptyFile';
import NeuButton from '../../../common/neu-element/lib/NeuButton';
import NeuView from '../../../common/neu-element/lib/NeuView';

const Contacts = () => {
  const {navigate} = useNavigation();
  const [loading, setloading] = useState(false);
  const [ContactList, setContactList] = useState([]);
  const [RequestList, setRequestList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [card, setCard] = React.useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    API_CONTACT_LIST();
    API_MY_REQUEST();
  };
  useFocusEffect(
    React.useCallback(() => {
      API_CONTACT_LIST();
      API_MY_REQUEST();
    }, []),
  );
  const API_CONTACT_LIST = () => {
    setloading(true);
    Webservice.get(APIURL.addContactList)
      .then((response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);

        console.log(
          'Get Contact Data Response : ' + JSON.stringify(response.data),
        );

        if (response.data.status) {
          setContactList(response.data.data);
          setloading(false);
        } else {
          setContactList([]);
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setContactList([]);
        setloading(false);
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                API_CONTACT_LIST();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  const API_MY_REQUEST = () => {
    setloading(true);
    Webservice.get(APIURL.myContactList)
      .then((response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);

        console.log(
          'Get Contact Data Response : ' + JSON.stringify(response.data),
        );

        if (response.data.status) {
          setRequestList(response.data.data);
          setloading(false);
        } else {
          setRequestList([]);
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setRequestList([]);
        setloading(false);
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                API_MY_REQUEST();
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  const selectProfileTap = (item) => {
    requestAnimationFrame(() => {
      navigate('UserProfile', {profile_id: item.contact_id});
    });
  };
  const API_ADD_CONTACT = async (contact_id) => {
    setloading(true);

    Webservice.post(APIURL.removeContact, {
      uid: contact_id,
      action: 'approve',
    })
      .then((response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);
          return;
        }
        //   console.log(response);
        setloading(false);
        console.log('Get Add Contact Response : ' + JSON.stringify(response));

        if (response.data.status === true) {
          setloading(false);
          showAlert(response.data.message);
          API_CONTACT_LIST();
          API_MY_REQUEST();
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setloading(false);
      });
  };

  const API_REMOVE_CONTACT = async (contact_id) => {
    setloading(true);
    Webservice.post(APIURL.removeContact, {
      action: 'remove',
      uid: contact_id,
    })
      .then((response) => {
        if (response.data == null) {
          setloading(false);
          showAlert(response.originalError.message);
          return;
        }
        //   console.log(response);

        console.log(
          'Get Remove Contact Response : ' + JSON.stringify(response.data),
        );

        if (response.data.status === true) {
          setloading(false);
          showAlert(response.data.message);
          API_CONTACT_LIST();
          API_MY_REQUEST();
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setloading(false);
      });
  };
  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectProfileTap(item);
        }}
        style={{alignSelf: 'center', marginTop: hp(1)}}>
        <Neomorph style={styles.neoSubContainer}>
          <Block flex={false} row space="between" center>
            <Block padding={[0, wp(3)]} row center flex={false}>
              <ImageComponent
                isURL
                name={`${APIURL.ImageUrl}${item.avatar}`}
                height={70}
                width={70}
                radius={70}
              />
              <Block
                style={{width: wp(60)}}
                margin={[0, 0, 0, wp(3)]}
                flex={false}>
                {item.status === 'pending' ? (
                  <Text capitalize semibold grey size={18}>
                    {`${item.name} `}
                    <Text capitalize semibold size={14} errorColor>
                      (Pending)
                    </Text>
                  </Text>
                ) : (
                  <Text capitalize semibold grey size={18}>
                    {item.name}
                  </Text>
                )}

                <Text
                  numberOfLines={2}
                  margin={[hp(0.5), 0, 0]}
                  regular
                  grey
                  size={14}>
                  {item.bio}
                </Text>
              </Block>
            </Block>
          </Block>
        </Neomorph>
      </TouchableOpacity>
    );
  };
  const _renderRequestItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectProfileTap(item);
        }}
        style={{alignSelf: 'center', marginTop: hp(1)}}>
        <Neomorph style={styles.neoSubContainer}>
          <Block flex={false} row space="between" center>
            <Block padding={[0, wp(3)]} row center flex={false}>
              <ImageComponent
                isURL
                name={`${APIURL.ImageUrl}${item.avatar}`}
                height={70}
                width={70}
                radius={70}
              />
              <Block
                style={{width: wp(37)}}
                margin={[0, 0, 0, wp(3)]}
                flex={false}>
                <Text semibold grey size={18}>
                  {item.name}
                </Text>
                <Text height={26} regular grey size={14}>
                  {item.bio}
                </Text>
              </Block>
            </Block>
            {item.status === 'pending' && (
              <Block row margin={[0, wp(3)]} flex={false}>
                <TouchableOpacity onPress={() => API_ADD_CONTACT(item.uid)}>
                  <ImageComponent
                    name="accept_request_icon"
                    height={40}
                    width={40}
                  />
                </TouchableOpacity>
                <CustomButton
                  onPress={() => API_REMOVE_CONTACT(item.uid)}
                  flex={false}
                  margin={[0, 0, 0, wp(3)]}>
                  <ImageComponent
                    name="close_request_icon"
                    height={40}
                    width={40}
                  />
                </CustomButton>
              </Block>
            )}
          </Block>
        </Neomorph>
      </TouchableOpacity>
    );
  };
  const renderOptions = () => {
    return (
      <Block middle center margin={[hp(2), 0, 0]} flex={false}>
        <NeuView
          color="#F2F0F7"
          height={hp(5)}
          width={wp(55)}
          borderRadius={16}
          containerStyle={styles.neoContainer}
          inset>
          {card ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(25)}
              height={hp(3.5)}
              style={{marginHorizontal: wp(2)}}
              borderRadius={6}>
              <Text semibold purple size={13}>
                My Contacts
              </Text>
            </NeuButton>
          ) : (
            <Text
              style={[styles.inactiveText, {marginRight: wp(2), width: wp(22)}]}
              onPress={() => setCard(true)}
              grey
              regular
              center
              size={13}>
              My Contacts
            </Text>
          )}
          {!card ? (
            <NeuButton
              color="#F2F0F7"
              width={wp(25)}
              height={hp(3.5)}
              style={{marginRight: wp(2)}}
              borderRadius={6}>
              <Text
                semibold
                onPress={() => setCard(false)}
                purple
                center
                size={13}>
                My Request
              </Text>
            </NeuButton>
          ) : (
            <Text
              center
              style={[styles.inactiveText, {marginLeft: wp(1), width: wp(22)}]}
              onPress={() => setCard(false)}
              grey
              regular
              size={13}>
              My Request
            </Text>
          )}
        </NeuView>
      </Block>
    );
  };
  return (
    <Block linear>
      <SafeAreaView />
      <HeaderPostLogin title="My Connections" />

      <Block
        color={'#F2EDFA'}
        padding={[hp(2), 0]}
        margin={[hp(2), 0, 0]}
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        {renderOptions()}
        {card && (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={light.purple}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            data={ContactList}
            renderItem={_renderItem}
            ListEmptyComponent={<EmptyFile text="No Contacts" />}
          />
        )}
        {!card && (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={light.purple}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            data={RequestList}
            renderItem={_renderRequestItem}
            ListEmptyComponent={<EmptyFile text="No Request" />}
          />
        )}
      </Block>
      {loading || loading ? <LoadingView /> : null}
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: hp(1),
    paddingBottom: hp(4),
  },
  neoSubContainer: {
    shadowRadius: 3,
    backgroundColor: '#F2F0F7',
    width: wp(90),
    height: hp(10),
    justifyContent: 'center',
    marginTop: hp(1),
    borderRadius: 10,
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

export default Contacts;
