const phoneNumbersRegex = {
  AM: /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/,
  AE: /^((\+?971)|0)?5[024568]\d{7}$/,
  BH: /^(\+?973)?(3|6)\d{7}$/,
  DZ: /^(\+?213|0)(5|6|7)\d{8}$/,
  EG: /^((\+?20)|0)?1[0125]\d{8}$/,
  IQ: /^(\+?964|0)?7[0-9]\d{8}$/,
  JO: /^(\+?962|0)?7[789]\d{7}$/,
  KW: /^(\+?965)[569]\d{7}$/,
  SA: /^(!?(\+?966)|0)?5\d{8}$/,
  SY: /^(!?(\+?963)|0)?9\d{8}$/,
  TN: /^(\+?216)?[2459]\d{7}$/,
  BY: /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  BG: /^(\+?359|0)?8[789]\d{7}$/,
  BD: /^(\+?880|0)1[13456789][0-9]{8}$/,
  CZ: /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  DK: /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  DE: /^(\+49)?0?1(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7}$/,
  AT: /^(\+43|0)\d{1,4}\d{3,12}$/,
  GR: /^(\+?30|0)?(69\d{8})$/,
  AU: /^(\+?61|0)4\d{8}$/,
  GB: /^(\+?44|0)7\d{9}$/,
  GG: /^(\+?44|0)1481\d{6}$/,
  GH: /^(\+233|0)(20|50|24|54|27|57|26|56|23|28)\d{7}$/,
  HK: /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  MO: /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  IE: /^(\+?353|0)8[356789]\d{7}$/,
  IN: /^(\+?91|0)?[6789]\d{9}$/,
  KE: /^(\+?254|0)(7|1)\d{8}$/,
  MT: /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  MU: /^(\+?230|0)?\d{8}$/,
  NG: /^(\+?234|0)?[789]\d{9}$/,
  NZ: /^(\+?64|0)[28]\d{7,9}$/,
  PK: /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
  RW: /^(\+?250|0)?[7]\d{8}$/,
  SG: /^(\+65)?[89]\d{7}$/,
  SL: /^(?:0|94|\+94)?(7(0|1|2|5|6|7|8)( |-)?\d)\d{6}$/,
  TZ: /^(\+?255|0)?[67]\d{8}$/,
  UG: /^(\+?256|0)?[7]\d{8}$/,
  US: /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  ZA: /^(\+?27|0)\d{9}$/,
  ZM: /^(\+?26)?09[567]\d{7}$/,
  CL: /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  EC: /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  ES: /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
  MX: /^(\+?52)?(1|01)?\d{10,11}$/,
  PA: /^(\+?507)\d{7,8}$/,
  PY: /^(\+?595|0)9[9876]\d{7}$/,
  UY: /^(\+598|0)9[1-9][\d]{6}$/,
  EE: /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  IR: /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  FI: /^(\+?358|0)\s?(4(0|1|2|4|5|6)?|50)\s?(\d\s?){4,8}\d$/,
  FJ: /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  FO: /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  FR: /^(\+?33|0)[67]\d{8}$/,
  GF: /^(\+?594|0|00594)[67]\d{8}$/,
  GP: /^(\+?590|0|00590)[67]\d{8}$/,
  MQ: /^(\+?596|0|00596)[67]\d{8}$/,
  RE: /^(\+?262|0|00262)[67]\d{8}$/,
  IL: /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  HU: /^(\+?36)(20|30|70)\d{7}$/,
  ID: /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  IT: /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  JP: /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  KZ: /^(\+?7|8)?7\d{9}$/,
  GL: /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  KR: /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  LT: /^(\+370|8)\d{8}$/,
  MY: /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  NO: /^(\+?47)?[49]\d{7}$/,
  NP: /^(\+?977)?9[78]\d{8}$/,
  BE: /^(\+?32|0)4?\d{8}$/,
  NL: /^(\+?31|0)6?\d{8}$/,
  NO: /^(\+?47)?[49]\d{7}$/,
  PL: /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  BR: /(?=^(\+?5{2}\-?|0)[1-9]{2}\-?\d{4}\-?\d{4}$)(^(\+?5{2}\-?|0)[1-9]{2}\-?[6-9]{1}\d{3}\-?\d{4}$)|(^(\+?5{2}\-?|0)[1-9]{2}\-?9[6-9]{1}\d{3}\-?\d{4}$)/,
  PT: /^(\+?351)?9[1236]\d{7}$/,
  RO: /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/,
  RU: /^(\+?7|8)?9\d{9}$/,
  SI: /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  SK: /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  RS: /^(\+3816|06)[- \d]{5,9}$/,
  SE: /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  TH: /^(\+66|66|0)\d{9}$/,
  TR: /^(\+?90|0)?5\d{9}$/,
  UA: /^(\+?38|8)?0\d{9}$/,
  VN: /^(\+?84|0)((3([2-9]))|(5([2689]))|(7([0|6-9]))|(8([1-6|89]))|(9([0-9])))([0-9]{7})$/,
  CN: /^((\+|00)86)?1([358][0-9]|4[579]|6[67]|7[01235678]|9[189])[0-9]{8}$/,
  TW: /^(\+?886\-?|0)?9\d{8}$/,
};

export const isPhoneNumberValid = (phoneNumber, country) => {
  if (!phoneNumber) {
    return { isValid: false, error: "Phone Number is required." };
  } else if (!country) {
    return { isValid: false, error: "Country not selected." };
  } else {
    const regex = phoneNumbersRegex[country];
    if (!regex?.test("+" + phoneNumber)) {
      return { isValid: false, error: "Invalid phone number." };
    } else {
      return { isValid: true, error: null };
    }
  }
};

export const isUsernameValid = (username) => {
  if (!username) {
    return { isValid: false, error: "Username is required." };
  } else if (!/^[A-Za-z0-9_-]*$/.test(username)) {
    return {
      isValid: false,
      error:
        "Invalid format for username. Only english alphabets, digits, hyphens and underscores are allowed.",
    };
  } else {
    return { isValid: true, error: null };
  }
};

export const isFullNameValid = (name) => {
  if (!name) {
    return { isValid: false, error: "Full Name is required." };
  } else if (!/^[A-Z]?[a-z]+ [A-Z]?[a-z]+$/.test(name)) {
    return {
      isValid: false,
      error: "Invalid full name.",
    };
  } else {
    return { isValid: true, error: null };
  }
};

export const isEmailValid = (email) => {
  if (!email) {
    return { isValid: false, error: "Email is required." };
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return { isValid: false, error: "Invalid email." };
  } else {
    return { isValid: true, error: null };
  }
};

export const isPasswordValid = (password) => {
  if (!password) {
    return { isValid: false, error: "Password is required." };
  } else {
    return { isValid: true, error: null };
  }
};

export const isConfirmPasswordValid = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: "Confirm Password is required." };
  } else if (password !== confirmPassword) {
    return {
      isValid: false,
      error: "Password and Confirm Password are not same.",
    };
  } else {
    return { isValid: true, error: null };
  }
};
