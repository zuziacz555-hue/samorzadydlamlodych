/**
 * AuthVault - Simple Client-Side Encryption Wrapper
 * Uses Web Crypto API (PBKDF2 + AES-GCM)
 */
const AuthVault = {
    // Configuration
    algo: "AES-GCM",
    pbkdf2: {
        name: "PBKDF2",
        hash: "SHA-256",
        iterations: 100000
    },

    // 1. Generate Key from Password
    async getKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return await crypto.subtle.deriveKey(
            {
                ...this.pbkdf2,
                salt: enc.encode(salt)
            },
            keyMaterial,
            { name: this.algo, length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    },

    // 2. Encrypt Token
    async encrypt(token, password) {
        const salt = window.crypto.randomUUID(); // Random salt
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Random IV
        const key = await this.getKey(password, salt);

        const encodedToken = new TextEncoder().encode(token);
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: this.algo,
                iv: iv
            },
            key,
            encodedToken
        );

        // Convert to Base64 for storage
        return {
            cipher: this.buffToBase64(encryptedContent),
            iv: this.buffToBase64(iv),
            salt: salt
        };
    },

    // 3. Decrypt Token
    async decrypt(encryptedData, password) {
        try {
            const { cipher, iv, salt } = encryptedData;
            const key = await this.getKey(password, salt);

            const decryptedContent = await window.crypto.subtle.decrypt(
                {
                    name: this.algo,
                    iv: this.base64ToBuff(iv)
                },
                key,
                this.base64ToBuff(cipher)
            );

            return new TextDecoder().decode(decryptedContent);
        } catch (e) {
            console.error("Decryption failed:", e);
            throw new Error("Invalid password");
        }
    },

    // Utilities
    buffToBase64(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    },

    base64ToBuff(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
};

window.AuthVault = AuthVault;
