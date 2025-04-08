let isMonitoring = false;

// استجابة لأوامر بدء وإيقاف المراقبة
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startMonitoring") {
    isMonitoring = true;
    chrome.storage.local.set({ isMonitoring: true, collectedLinks: [] });
  } 
  else if (message.action === "stopMonitoring") {
    isMonitoring = false;
    chrome.storage.local.set({ isMonitoring: false });
    
    // جلب جميع الروابط المخزنة ونسخها إلى الحافظة
    chrome.storage.local.get("collectedLinks", (data) => {
      const links = data.collectedLinks || [];
      const textToCopy = links.join("\n");
      copyToClipboard(textToCopy);
    });
  }
  sendResponse({ status: "ok" });
});

// دالة لنسخ النص إلى الحافظة
function copyToClipboard(text) {
  const input = document.createElement("textarea");
  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  console.log("✅ Links copied to clipboard!");
}
