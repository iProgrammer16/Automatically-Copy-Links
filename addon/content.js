// تحقق مما إذا كانت المراقبة مفعّلة
chrome.storage.local.get("isMonitoring", (data) => {
  if (!data.isMonitoring) return;

  // دالة لتحديد أولوية الرابط (رقم أقل يعني أولوية أعلى)
  function getPriority(link) {
    // مثال: إذا كان الرابط يحتوي على "priority1" نعطيه أولوية 1،
    // وإذا كان يحتوي على "priority2" نعطيه أولوية 2،
    // وإلا نعطيه أولوية افتراضية 100.
    if (link.includes("priority1")) return 1;
    if (link.includes("priority2")) return 2;
    return 100;
  }

  // دالة لاستخراج الروابط من السمات المحددة
  function extractLinks() {
    const urlAttrs = [
      "href",
      "src",
      "action",
      "content",
      "poster",
      "cite",
      "data-href",
      "data-src",
      "data-link",
      "data-url",
      "srcset"
    ];

    const links = [];

    // استخراج الروابط من العناصر التي تحتوي على السمات المذكورة
    urlAttrs.forEach(attr => {
      document.querySelectorAll(`[${attr}]`).forEach(element => {
        let href = element.getAttribute(attr);
        if (href) {
          // تحويل الرابط النسبي إلى رابط كامل إذا لزم الأمر
          if (!href.startsWith('http') && !href.startsWith('https') && !href.startsWith('ftp') && !href.startsWith('file')) {
            href = new URL(href, window.location.origin).href;
          }

          // استبعاد الروابط التي تحتوي على .google أو تبدأ بـ javascript:
          if (href && !href.includes(".google") && !href.startsWith("javascript:") && !href.startsWith("data:image") && !href.startsWith("moz-extension:") && !href.includes(".gstatic")) {
            links.push(href);
          }
        }
      });
    });

    if (links.length > 0) {
      // ترتيب الروابط حسب الأولوية، وفي حال تساوي الأولوية يتم الترتيب أبجديًا
      links.sort((a, b) => {
        const diff = getPriority(a) - getPriority(b);
        return diff !== 0 ? diff : a.localeCompare(b);
      });

      chrome.storage.local.get("collectedLinks", (data) => {
        let storedLinks = data.collectedLinks || [];
        // إضافة الروابط الجديدة فقط (إذا لم تكن موجودة مسبقاً)
        links.forEach(link => {
          if (!storedLinks.includes(link)) {
            storedLinks.push(link);
          }
        });
        chrome.storage.local.set({ collectedLinks: storedLinks });
      });
    }
  }

  // تنفيذ الاستخراج بعد تحميل الصفحة بالكامل
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", extractLinks);
  } else {
    extractLinks();
  }

  // مراقبة التغيرات في DOM لاستخراج الروابط المُضافة ديناميكيًا
  const observer = new MutationObserver(() => {
    extractLinks();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
