import crypto from 'crypto';

// Garanti BBVA Sanal POS (GVP) — 3D_PAY modeli, apiversion 512.
// Kart bilgisi tarayıcıdan doğrudan bankanın gt3dengine adresine POST edilir;
// bu sunucu yalnızca hash üretir ve callback'i doğrular.

export interface GarantiConfig {
  merchantId: string;
  terminalId: string;
  provUserId: string;
  provPassword: string;
  storeKey: string;
  mode: 'PROD' | 'TEST';
}

export function garantiConfig(): GarantiConfig | null {
  const {
    GARANTI_MERCHANT_ID,
    GARANTI_TERMINAL_ID,
    GARANTI_PROV_USER_ID,
    GARANTI_PROV_PASSWORD,
    GARANTI_STORE_KEY,
    GARANTI_MODE,
  } = process.env;
  if (!GARANTI_MERCHANT_ID || !GARANTI_TERMINAL_ID || !GARANTI_PROV_USER_ID || !GARANTI_PROV_PASSWORD || !GARANTI_STORE_KEY) {
    return null;
  }
  return {
    merchantId: GARANTI_MERCHANT_ID,
    terminalId: GARANTI_TERMINAL_ID,
    provUserId: GARANTI_PROV_USER_ID,
    provPassword: GARANTI_PROV_PASSWORD,
    storeKey: GARANTI_STORE_KEY,
    mode: GARANTI_MODE === 'PROD' ? 'PROD' : 'TEST',
  };
}

export function garantiGatewayUrl(mode: 'PROD' | 'TEST'): string {
  return mode === 'PROD'
    ? 'https://sanalposprov.garanti.com.tr/servlet/gt3dengine'
    : 'https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine';
}

function sha1Upper(s: string): string {
  return crypto.createHash('sha1').update(s, 'utf8').digest('hex').toUpperCase();
}

function sha512Upper(s: string): string {
  return crypto.createHash('sha512').update(s, 'utf8').digest('hex').toUpperCase();
}

// HashedPassword = SHA1(provisionPassword + terminalId 9 haneye sıfır dolgulu)
function hashedPassword(cfg: GarantiConfig): string {
  return sha1Upper(cfg.provPassword + cfg.terminalId.padStart(9, '0'));
}

// 3D istek hash'i (apiversion 512)
export function make3DHash(
  cfg: GarantiConfig,
  orderId: string,
  amountKurus: string,
  currencyCode: string,
  successUrl: string,
  errorUrl: string,
  txnType: string,
  installments: string,
): string {
  return sha512Upper(
    cfg.terminalId + orderId + amountKurus + currencyCode +
    successUrl + errorUrl + txnType + installments +
    cfg.storeKey + hashedPassword(cfg)
  );
}

// Callback hash doğrulaması: bank "hashparams" (":" ayraçlı alan adları) ve
// "hash" gönderir; alan değerleri sırayla birleştirilip storeKey eklenerek
// SHA512'si alınır.
export function verifyCallbackHash(cfg: GarantiConfig, params: Record<string, string>): boolean {
  const hashParams = params['hashparams'];
  const received = params['hash'];
  if (!hashParams || !received) return false;
  const digest = hashParams
    .split(':')
    .filter(Boolean)
    .map((p) => params[p.toLowerCase()] ?? '')
    .join('');
  const computed = sha512Upper(digest + cfg.storeKey);
  const a = Buffer.from(computed);
  const b = Buffer.from(received.toUpperCase());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Başarı sayılan mdstatus değerleri: 1 tam doğrulama; 2,3,4 half-secure
export function mdStatusOk(md: string | undefined): boolean {
  return md === '1' || md === '2' || md === '3' || md === '4';
}
