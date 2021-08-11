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

const Contacts = () => {
  const {navigate} = useNavigation();
  const [loading, setloading] = useState(false);
  const [ContactList, setContactList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    API_CONTACT_LIST();
  };
  console.log(ContactList, 'ContactList');
  useFocusEffect(
    React.useCallback(() => {
      API_CONTACT_LIST();
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

  const selectProfileTap = (item) => {
    requestAnimationFrame(() => {
      navigate('UserProfile', {profile_id: item.user_id});
    });
  };
  const API_ADD_CONTACT = async (contact_id) => {
    setloading(true);

    Webservice.post(APIURL.removeContact, {
      contact_id: contact_id,
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
      contact_id: contact_id,
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
        style={{alignSelf: 'center'}}>
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
              <Block margin={[0, 0, 0, wp(3)]} flex={false}>
                <Text semibold grey size={18}>
                  {item.name}
                </Text>
                <Text height={26} regular grey size={14}>
                  {item.bio}
                </Text>
              </Block>
            </Block>
            {item.status === 'request' && (
              <Block row margin={[0, wp(3)]} flex={false}>
                <TouchableOpacity
                  onPress={() => API_ADD_CONTACT(item.contact_id)}>
                  <ImageComponent
                    name="accept_request_icon"
                    height={40}
                    width={40}
                  />
                </TouchableOpacity>
                <CustomButton
                  onPress={() => API_REMOVE_CONTACT(item.contact_id)}
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
          ListEmptyComponent={<EmptyFile text="No Connections" />}
        />
      </Block>
      {loading || loading ? <LoadingView /> : null}
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
});

export default Contacts;
