import Script from "next/script";

const SimpleAnalyticsScript = () => {
  return (
    <>
      <Script strategy="lazyOnload" id="sa-script">
        {`
            window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]};
        `}
      </Script>
      <Script
        strategy="lazyOnload"
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      />
    </>
  );
};

// https://docs.simpleanalytics.com/events
declare global {
  interface Window {
    sa_event?: (eventName: string, callback?: () => void) => string;
  }
}
export const logEvent = (eventName: string, callback?: () => void) => {
  if (callback) {
    return window.sa_event?.(eventName, callback);
  } else {
    return window.sa_event?.(eventName);
  }
};

export default SimpleAnalyticsScript;
