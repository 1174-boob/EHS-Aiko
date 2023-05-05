export default function encryptionRules (type, value) {
  if (!value) {
    return "-";
  }
  if (type == "phone") { // 手机号加密
    return value.slice(0, 3) + "****" + value.slice(7);
  } else if (type == "idCard") { // 身份证号加密
    return value.slice(0, 6) + "********" + value.slice(-4);
  } else {
    return value;
  }
}