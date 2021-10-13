/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  getProducts,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  initConnection,
  getSubscriptions,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import {connect} from 'react-redux';
import {
  strictValidArrayWithLength,
  validObjectWithParameterKeys,
} from '../utils/commonUtils';
import Button from './Button';
import {showAlert} from '../utils/mobile-utils';
import {APIURL} from '../Constants/APIURL';
import Webservice from '../Constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IAPButton = ({sku, style, title, details}) => {
  const {navigate} = useNavigation();
  const {price, type} = details;
  let purchaseUpdateSubscription = null;
  let purchaseErrorSubscription = null;
  const [productINP, setProductINP] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const getINPProduct = async () => {
    setLoading(true);
    try {
      const productIds = Platform.select({
        ios: [sku],
        android: [sku],
      });
      const products = await getProducts(productIds);
      const subscription = await getSubscriptions(productIds);
      console.log(products, subscription, 'subscription', productIds);
      if (strictValidArrayWithLength(products)) {
        setProductINP(products[0]);
      } else if (strictValidArrayWithLength(subscription)) {
        setProductINP(subscription[0]);
      } else {
        showAlert('Product Id is missing for in-app purchase');
        setLoading(false);
      }
    } catch (err) {
      showAlert('Product Id is missing for in-app purchase');
      setLoading(false);
    }
  };

  const processNewPurchase = async (purchase) => {
    const {transactionReceipt, productId, transactionId} = purchase;
    console.log(purchase, 'purchase');
    const user_id = await AsyncStorage.getItem('user_id');
    if (transactionReceipt !== undefined && sku === productId) {
      console.log(transactionReceipt, 'transactionReceipt');
      setLoading(false);
      Webservice.post(APIURL.makePayment, {
        user_id: user_id,
        amount: price,
        payment_type: 'A',
        productId: productId,
        transactionId: transactionId,
        transactionReceipt: transactionReceipt,
        subscription: type,
      })
        .then(async (response) => {
          if (response.data == null) {
            setLoading(false);
            // alert('error');
            showAlert(response.originalError.message);

            return;
          }

          if (response.data.status === true) {
            setLoading(false);
            navigate('ActivatedCard', {
              header: 'Success !',
              subtitle: `Your ${type} Subscription has been successfully purchased `,
            });
          } else {
            setLoading(false);
            showAlert(response.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const inAppPopup = async () => {
    await requestPurchase(productINP.productId);
  };

  useEffect(() => {
    if (validObjectWithParameterKeys(productINP, ['productId'])) {
      inAppPopup();
    }
  }, [productINP]);

  useEffect(() => {
    if (validObjectWithParameterKeys(productINP, ['productId'])) {
      initConnection().then(() => {
        flushFailedPurchasesCachedAsPendingAndroid()
          .catch(() => {
            setLoading(false);
          })
          .then(() => {
            purchaseUpdateSubscription = purchaseUpdatedListener(
              async (purchase) => {
                const receipt = purchase.transactionReceipt;
                if (receipt) {
                  try {
                    if (Platform.OS === 'ios') {
                      finishTransactionIOS(purchase.transactionId);
                    }
                    await finishTransaction(purchase);
                    await processNewPurchase(purchase);
                  } catch (ackErr) {
                    setLoading(false);
                  }
                }
              },
            );
            purchaseErrorSubscription = purchaseErrorListener((error) => {
              showAlert('In-app purchase failed, Please try again');
              setLoading(false);
            });
          });
      });
    }

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
    };
  }, [productINP]);

  const onhandleClick = async () => {
    try {
      await getINPProduct();
    } catch (err) {}
  };

  return (
    <Button
      linear
      disabled={isLoading}
      onPress={() => onhandleClick()}
      isLoading={isLoading}
      style={style}
      color="primary">
      {title}
    </Button>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    // callInAppPurchase: (...params) => dispatch(inAppPayment(...params)),
  };
};
export default connect(null, mapDispatchToProps)(IAPButton);
