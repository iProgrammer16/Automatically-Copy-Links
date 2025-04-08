// عندما يتم تحميل نافذة الـ popup
document.addEventListener("DOMContentLoaded", () => {
  // استرجاع الحالة السابقة للزر من التخزين
  chrome.storage.local.get(["isMonitoring"], (data) => {
    if (data.isMonitoring) {
      // إذا كانت المراقبة مفعّلة
      document.getElementById("startButton").style.display = "none";
      document.getElementById("stopButton").style.display = "block";
    } else {
      // إذا كانت المراقبة غير مفعّلة
      document.getElementById("startButton").style.display = "block";
      document.getElementById("stopButton").style.display = "none";
    }
  });
});

// عند الضغط على "Start"
document.getElementById("startButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startMonitoring" }, () => {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("stopButton").style.display = "block";

    // تخزين حالة الزر في التخزين
    chrome.storage.local.set({ isMonitoring: true });
  });
});

// عند الضغط على "Stop"
document.getElementById("stopButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stopMonitoring" }, () => {
    document.getElementById("stopButton").style.display = "none";
    document.getElementById("startButton").style.display = "block";

    // تخزين حالة الزر في التخزين
    chrome.storage.local.set({ isMonitoring: false });
  });
});
