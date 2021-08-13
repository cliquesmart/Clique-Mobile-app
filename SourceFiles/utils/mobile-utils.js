import {Linking, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Snackbar from 'react-native-snackbar';
import {images} from '../Assets/Images/images';
import {CommonColors} from '../Constants/ColorConstant';
import {strictValidObjectWithKeys} from './commonUtils';

export const showAlert = (text, color) => {
  Snackbar.show({
    text: text,
    backgroundColor: CommonColors.errorColor || color,
    textColor: CommonColors.whiteColor,
    // fontFamily: ConstantKeys.Averta_BOLD,
    duration: Snackbar.LENGTH_LONG,
  });
};
export const getCardType = (number) => {
  // visa
  let re = new RegExp('^4');
  if (number.match(re) != null) {
    return 'Visa';
  }

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number,
    )
  ) {
    return 'mastercard';
  }

  // AMEX
  re = new RegExp('^3[47]');
  if (number.match(re) != null) {
    return 'AMEX';
  }

  // Discover
  re = new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)',
  );
  if (number.match(re) != null) {
    return 'Discover';
  }

  // Diners
  re = new RegExp('^36');
  if (number.match(re) != null) {
    return 'Diners';
  }

  // Diners - Carte Blanche
  re = new RegExp('^30[0-5]');
  if (number.match(re) != null) {
    return 'Diners - Carte Blanche';
  }

  // JCB
  re = new RegExp('^35(2[89]|[3-8][0-9])');
  if (number.match(re) != null) {
    return 'JCB';
  }

  // Visa Electron
  re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
  if (number.match(re) != null) {
    return 'Visa Electron';
  }

  return '';
};
export const cc_expires_format = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      '', // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      '0$1', // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      '0$1/$2', // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      '0', // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      '$1/$2', // To handle 113 > 11/3
    );
};
export const cc_format = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};
export const getCardColor = (card) => {
  switch (card.toString().toLowerCase()) {
    case 'jcb':
      return 'jcb';
    case 'discover':
      return 'discover';
    case 'diners':
      return 'diners';
    case 'amex':
      return 'amex';
    case 'diners - carte blanche':
      return 'diner';
    case 'visa':
      return 'visa';
    case 'mastercard':
      return 'mastercard';
    default:
      return '';
  }
};
export const checkColor = (type) => {
  switch (type) {
    case 0:
      return '#E3674B';
    case 1:
      return '#E3674B';
    case 2:
      return '#E3674B';
    case 3:
      return '#4BB6E3';
    case 4:
      return '#4BB6E3';
    case 5:
      return '#4BB6E3';
    case 6:
      return '#4BB6E3';
    case 7:
      return '#4BE351';
    case 8:
      return '#4BE351';
    case '':
      return '#E3674B';
    default:
      return '#4BE351';
  }
};

export const onDisplayNotification = async (obj) => {
  if (strictValidObjectWithKeys(obj)) {
    showMessage({
      message: obj.type,
      description: obj.message,
      type: 'default',
      backgroundColor: '#4BE351', // background color
      color: '#fff', // text color
    });
  } else {
    return null;
  }
};

export const OpenLinks = (item, url) => {
  console.log(item, url, 'url');
  const separator = Platform.OS === 'ios' ? '&' : '?';
  requestAnimationFrame(() => {
    if (item === 'Phone' || item === 'workNumber' || item === 'otherNumber') {
      Linking.openURL(`tel:${url}`);
    } else if (item === 'Messanger' || item === 'Email') {
      Linking.openURL(`mailto:${url}`);
    } else if (item === 'Facetime') {
      Linking.openURL(`facetime:${url}`);
    } else if (item === 'Messages') {
      Linking.openURL(`sms:${url}${separator}body=${'Hi'}`);
    } else if (item === 'Instagram') {
      Linking.openURL(`instagram://user?username=${url}`).catch(() => {
        Linking.openURL('https://www.instagram.com/' + url);
      });
    } else if (item === 'Facebook') {
      console.log(`fb://${url}`, 'facebook');
      Linking.openURL(`fb://profile?app_scoped_user_id=%@${url}`).catch(() => {
        console.log('catch', url);
        Linking.openURL('https://www.facebook.com/' + url);
      });
    } else if (item === 'Youtube') {
      Linking.openURL(`vnd.youtube://${url}`).catch(() => {
        Linking.openURL('https://www.youtube.com/' + url);
      });
    } else if (item === 'Linkedin') {
      Linking.openURL(`linkedin://profile?id=${url}`).catch(() => {
        Linking.openURL('https://www.linkedin.com/in/' + url);
      });
    } else if (item === 'Twitter') {
      Linking.openURL('twitter://user?screen_name=' + url).catch(() => {
        Linking.openURL('https://www.twitter.com/' + url);
      });
    } else if (item === 'Tiktok') {
      Linking.openURL('https://www.tiktok.com/@' + url);
    } else if (item === 'Whatsapp') {
      Linking.openURL('https://wa.me//' + url);
    } else if (item === 'Paypal') {
      Linking.openURL('paypal://' + url);
    } else if (item === 'Amazon music') {
      Linking.openURL('https://www.primevideo.com/' + url);
    } else if (item === 'Paytm') {
      Linking.openURL('http://m.p-y.tm/' + url);
    } else if (item === 'Snapchat') {
      Linking.openURL('https://story.snapchat.com/u/' + url);
    } else if (item === 'Zomato') {
      Linking.openURL(url);
    } else if (item === 'Spotify') {
      Linking.openURL('http://open.spotify.com/user/' + url);
    } else if (item === 'Sound cloud') {
      Linking.openURL('https://soundcloud.com/' + url);
    } else if (item === 'Pinterest') {
      Linking.openURL('pinterest://' + url).catch(() => {
        Linking.openURL('https://pinterest.com/' + url);
      });
    } else if (item === 'File') {
      Linking.openURL('https://files.google.com/' + url).catch(() => {
        Linking.openURL('https://files.google.com/' + url);
      });
    } else {
      Linking.openURL(url);
    }
  });
};

// Pending

//  else if (item === 'Venmo') {
//       Linking.openURL('soundcloud://' + url).catch(() => {
//         Linking.openURL('https://soundcloud.com/' + url);
//       });
//     }

//
// if($request->id == 1){
// 					if(substr_count($request->link, 'tel')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'tel:'.$request->link;
// 					}
// 				}else if($request->id == 2){
// 					if(substr_count($request->link, 'mailto')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'mailto:'.$request->link;
// 					}
// 				}else if($request->id == 3){
// 					if(substr_count($request->link, 'story.snapchat.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://story.snapchat.com/u/'.$request->link;
// 					}
// 				}else if($request->id == 4){
// 					if(substr_count($request->link, 'primevideo.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.primevideo.com/'.$request->link;
// 					}
// 				}else if($request->id == 5){
// 					if(substr_count($request->link, 'paypal://')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'paypal://'.$request->link;
// 					}
// 				}else if($request->id == 6){
// 					if(substr_count($request->link, 'm.p-y.tm')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'http://m.p-y.tm/'.$request->link;
// 					}
// 				}else if($request->id == 7){
// 					if(substr_count($request->link, 'google.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'http://google.com/'.$request->link;
// 					}
// 				}else if($request->id == 8){
// 					if(substr_count($request->link, 'player.vimeo.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'http://player.vimeo.com/video/'.$request->link;
// 					}
// 				}else if($request->id == 11){
// 					if(substr_count($request->link, 'zomato.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.zomato.com/'.$request->link;
// 					}
// 				}else if($request->id == 12){
// 					if(substr_count($request->link, 'https://youtube.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://youtube.com/'.$request->link;
// 					}
// 				}else if($request->id == 13){
// 					if(substr_count($request->link, 'instagram')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'instagram://media?id='.$request->link;
// 					}
// 				}else if($request->id == 14){
// 					if(substr_count($request->link, 'linkedin://')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'linkedin://profile/'.$request->link;
// 					}
// 				}else if($request->id == 15){
// 					if(substr_count($request->link, 'spotify')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'spotify:'.$request->link;
// 					}
// 				}else if($request->id == 16){
// 					if(substr_count($request->link, 'fb:')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'fb://'.$request->link;
// 					}
// 				}else if($request->id == 17){
// 					if(substr_count($request->link, 'https')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.twitter.com/'.$request->link;
// 					}
// 				}else if($request->id == 19){
// 					if(substr_count($request->link, 'musics')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'musics://'.$request->link;
// 					}
// 				}else if($request->id == 20){
// 					if(substr_count($request->link, 'cash.app/')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'cash.app/'.$request->link;
// 					}
// 				}else if($request->id == 21){
// 					if(substr_count($request->link, 'joinclubhouse.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.joinclubhouse.com/'.$request->link;
// 					}
// 				}else if($request->id == 22){
// 					if(substr_count($request->link, 'apps.apple.com/us/app/facetime')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://apps.apple.com/us/app/facetime/'.$request->link;
// 					}
// 				}else if($request->id == 23){
// 					if(substr_count($request->link, 'deezer.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.deezer.com/'.$request->link;
// 					}
// 				}else if($request->id == 24){
// 					if(substr_count($request->link, 'deezer.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.deezer.com/'.$request->link;
// 					}
// 				}else if($request->id == 25){
// 					if(substr_count($request->link, 'files.google.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://files.google.com/'.$request->link;
// 					}
// 				}else if($request->id == 26){
// 					if(substr_count($request->link, 'pinterest')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'pinterest://'.$request->link;
// 					}
// 				}else if($request->id == 27){
// 					if(substr_count($request->link, 'pcast')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'pcast://'.$request->link;
// 					}
// 				}else if($request->id == 28){
// 					if(substr_count($request->link, 'soundcloud')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'soundcloud://'.$request->link;
// 					}
// 				}else if($request->id == 29){
// 					if(substr_count($request->link, 'tiktok.com')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://www.tiktok.com/'.$request->link;
// 					}
// 				}else if($request->id == 30){
// 					if(substr_count($request->link, 'https')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://'.$request->link;
// 					}
// 				}else if($request->id == 31){
// 					if(substr_count($request->link, 'bitclout')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'bitclout://'.$request->link;
// 					}
// 				}else if($request->id == 32){
// 					if(substr_count($request->link, 'wa.me')){
// 						$link_url = $request->link;
// 					}else{
// 						$link_url = 'https://wa.me/'.$request->link;
// 					}
// 				}else{
// 					$link_url = $request->link;
// 				}
