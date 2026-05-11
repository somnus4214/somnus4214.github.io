(function () {
  var passwordStorageKey = "SomnusEncryptionPassword";
  var unlockEventName = "somnus-encryption-unlock";

  function getSavedPassword() {
    try {
      return window.sessionStorage.getItem(passwordStorageKey) || "";
    } catch (error) {
      return "";
    }
  }

  function savePassword(password) {
    try {
      window.sessionStorage.setItem(passwordStorageKey, password);
    } catch (error) {
      return;
    }

    window.dispatchEvent(new CustomEvent(unlockEventName, {
      detail: {
        password: password
      }
    }));
  }

  function clearPassword() {
    try {
      window.sessionStorage.removeItem(passwordStorageKey);
    } catch (error) {
      return;
    }
  }

  function fromBase64(value) {
    var binary = window.atob(value);
    var bytes = new Uint8Array(binary.length);

    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderMarkdownish(markdown) {
    return markdown
      .split(/\n{2,}/)
      .map(function (block) {
        var safe = escapeHtml(block.trim())
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/`([^`]+)`/g, "<code>$1</code>")
          .replace(/\n/g, "<br>");

        if (safe.indexOf("### ") === 0) {
          return "<h3>" + safe.slice(4) + "</h3>";
        }

        if (safe.indexOf("## ") === 0) {
          return "<h2>" + safe.slice(3) + "</h2>";
        }

        if (safe.indexOf("# ") === 0) {
          return "<h1>" + safe.slice(2) + "</h1>";
        }

        return "<p>" + safe + "</p>";
      })
      .join("");
  }

  async function deriveKey(password, salt, iterations) {
    var passwordKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: salt,
        iterations: iterations
      },
      passwordKey,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["decrypt"]
    );
  }

  async function decryptPayload(payload, password) {
    var key = await deriveKey(
      password,
      fromBase64(payload.salt),
      payload.iterations
    );

    var plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fromBase64(payload.iv)
      },
      key,
      fromBase64(payload.ciphertext)
    );

    return new TextDecoder().decode(plaintext);
  }

  async function fetchEncryptedPayload(source) {
    var response = await fetch(source, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("无法读取密文文件。");
    }

    return response.json();
  }

  function initEncryptedBlock(block) {
    var form = block.querySelector("[data-encrypted-form]");
    var input = block.querySelector("[data-encrypted-password]");
    var status = block.querySelector("[data-encrypted-status]");
    var lockedPreview = block.querySelector("[data-encrypted-locked-preview]");
    var lockMark = block.querySelector("[data-encrypted-lock-mark]");
    var output = block.querySelector("[data-encrypted-output]");
    var source = block.getAttribute("data-source");

    if (!window.crypto || !window.crypto.subtle) {
      status.textContent = "当前浏览器不支持 WebCrypto，无法解密。";
      return;
    }

    async function unlockWithPassword(password, silent) {
      if (!password) return false;

      if (!silent) {
        status.textContent = "正在解密...";
      }

      try {
        var payload = await fetchEncryptedPayload(source);
        var plaintext = await decryptPayload(payload, password);

        output.innerHTML = renderMarkdownish(plaintext);
        block.classList.add("is-unlocked");
        if (lockedPreview) {
          lockedPreview.setAttribute("aria-hidden", "false");
        }

        if (lockMark) {
          lockMark.textContent = "UNLOCKED";
        }

        form.hidden = true;
        output.hidden = false;
        status.textContent = "已解锁。";
        return true;
      } catch (error) {
        if (silent) {
          clearPassword();
          form.hidden = false;
          status.textContent = "已保存的解锁密码失效，请重新输入密码。";
        }

        if (!silent) {
          status.textContent = "解密失败，请检查密码或密文文件。";
        }

        return false;
      }
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (await unlockWithPassword(input.value, false)) {
        savePassword(input.value);
      }
    });

    window.addEventListener(unlockEventName, function (event) {
      unlockWithPassword(event.detail.password, true);
    });

    unlockWithPassword(getSavedPassword(), true);
  }

  function initEncryptedUnlock(block) {
    var form = block.querySelector("[data-encrypted-unlock-form]");
    var input = block.querySelector("[data-encrypted-unlock-password]");
    var clear = block.querySelector("[data-encrypted-unlock-clear]");
    var status = block.querySelector("[data-encrypted-unlock-status]");

    if (getSavedPassword()) {
      status.textContent = "当前会话已解锁。";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      savePassword(input.value);
      input.value = "";
      status.textContent = "已解锁当前浏览器会话。";
    });

    clear.addEventListener("click", function () {
      clearPassword();
      status.textContent = "已清除当前会话密码。";
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-encrypted-content]").forEach(initEncryptedBlock);
    document.querySelectorAll("[data-encrypted-unlock]").forEach(initEncryptedUnlock);
  });
})();
