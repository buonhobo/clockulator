import { openStream } from "webext-bridge/background";

export default defineBackground(() => {
  browser.runtime.onStartup.addListener(
    async () => await openStream("popup", "content-script"),
  );
});
