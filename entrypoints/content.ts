import { sendMessage } from "webext-bridge/content-script";

export default defineContentScript({
  matches: ["https://pt5.planettime.it/*/cartellino.aspx"],
  async main() {
    var result: Record<string, number> = {};

    var C1 =
      document.getElementById("pageFooter_C1")?.querySelectorAll("tr") || [];
    for (const tr of C1) {
      const k = tr.children[1]?.textContent?.trim();
      if (!k) {
        continue;
      }

      const v = tr.children[3].textContent?.trim();
      const [hours, mins] = v.split(":");
      result[k] = parseInt(hours) * 60 + parseInt(mins);
    }

    var C2 =
      document
        .getElementById("pageFooter_C2")
        ?.querySelectorAll("tr")
        .values()
        .drop(1) || [];
    for (const tr of C2) {
      const k = tr.children[0]?.textContent?.trim();
      if (!k) {
        continue;
      }

      if (k == "T004") {
        let saldo = result["T002"] - result["T003"];
        let ore = 0;
        if (saldo >= 60) {
          ore = Math.floor(saldo / 60);
          saldo = saldo % 60;
        }
        tr.children[4].textContent =
          ore.toString().padStart(2, "0") +
          ":" +
          saldo.toString().padStart(2, "0");
      }

      const v = tr.children[4].textContent?.trim();
      const [hours, mins] = v.split(":");
      result[k] = parseInt(hours) * 60 + parseInt(mins) || 0;
    }

    console.log("sending message:", result);
    sendMessage("options", result, "popup");
  },
});
