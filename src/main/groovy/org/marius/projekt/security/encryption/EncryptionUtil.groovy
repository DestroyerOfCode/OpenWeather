package org.marius.projekt.security.encryption

import org.springframework.security.crypto.encrypt.AesBytesEncryptor
import org.springframework.security.crypto.encrypt.BytesEncryptor
import org.springframework.security.crypto.encrypt.Encryptors
import org.springframework.security.crypto.encrypt.HexEncodingTextEncryptor
import org.springframework.security.crypto.encrypt.TextEncryptor
import org.springframework.security.crypto.keygen.KeyGenerators
import org.springframework.stereotype.Component

@Component
class EncryptionUtil{

    private TextEncryptor textEncryptor = null;

    EncryptionUtil() {
        textEncryptor = Encryptors.delux('password', "e1b7ad44a2435e74")
    }

    String encrypt(String textToEncrypt) {
        return this.textEncryptor.encrypt(textToEncrypt);
    }

    String decrypt(String encryptedText) {
        return this.textEncryptor.decrypt(encryptedText);
    }
}