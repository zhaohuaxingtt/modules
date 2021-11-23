 // 金额千分位
export const thousands = function (num, len = 2) {
  num = String(num).replace(/[^0-9.-]/ig, '');
  num = Number(num).toFixed(len);
  const numArray = String(num).split('.');
  numArray[0] = parseFloat(numArray[0]).toLocaleString();
  const value = numArray.join('.');
  return value || 0;
}