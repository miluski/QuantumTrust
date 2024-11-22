import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private key = CryptoJS.enc.Base64.parse(environment.encryptKey);

  public encryptData(data: Object): string {
    const iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.random(16);
    const encrypted: CryptoJS.lib.CipherParams = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.key,
      {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    );
    const encryptedData: string = iv
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);
    return encryptedData;
  }

  public decryptData(data: string): string {
    try {
      const decodedData: CryptoJS.lib.WordArray =
        CryptoJS.enc.Base64.parse(data);
      const iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(
        decodedData.words.slice(0, 4)
      );
      const ciphertext: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(
        decodedData.words.slice(4)
      );
      const decrypted: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext }),
        this.key,
        {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        }
      );
      const decryptedValue: string = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue);
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}
