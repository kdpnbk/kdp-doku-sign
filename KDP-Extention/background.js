chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://approval-pdf.vercel.app' });
});