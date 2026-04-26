// iyzico credentials geldiğinde .env.local'e IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL ekle
// iyzipay package yüklü: npm install iyzipay

let iyzipay: any = null;

export function getIyzicoClient() {
  if (!iyzipay) {
    const Iyzipay = require('iyzipay');
    iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY ?? 'sandbox-pending',
      secretKey: process.env.IYZICO_SECRET_KEY ?? 'sandbox-pending',
      uri: process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com',
    });
  }
  return iyzipay;
}
