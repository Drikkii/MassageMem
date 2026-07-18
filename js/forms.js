(function () {
  "use strict";

  function getFormsConfig() {
    return window.SITE?.forms || {};
  }

  function getRecipientEmail() {
    const forms = getFormsConfig();
    return (
      forms.email ||
      window.SITE?.contacts?.email ||
      ""
    ).trim();
  }

  async function sendLead(payload) {
    const forms = getFormsConfig();
    const leadUrl = forms.leadUrl || "/api/lead.php";
    const fields = payload.fields || {};

    try {
      const phpResponse = await fetch(leadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: payload._subject || "Заявка с сайта",
          fields,
        }),
      });

      const phpData = await phpResponse.json().catch(() => ({}));
      if (phpResponse.ok && phpData.success) {
        return { success: true, method: phpData.method || "server" };
      }

      if (phpResponse.status >= 400 && phpResponse.status < 500 && phpData.message) {
        throw new Error(phpData.message);
      }

      if (phpData.message) {
        console.warn("[Forms] PHP:", phpData.message);
      }
    } catch (phpError) {
      if (phpError instanceof Error && phpError.message && !phpError.message.includes("fetch")) {
        throw phpError;
      }
      console.warn("[Forms] PHP lead endpoint failed, trying FormSubmit", phpError);
    }

    const email = getRecipientEmail();
    if (!email) {
      throw new Error("Email получателя не настроен.");
    }

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: payload._subject || "Заявка с сайта",
        _template: "table",
        _captcha: "false",
        ...fields,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Не удалось отправить заявку.");
    }

    return { success: true, method: "formsubmit" };
  }

  window.SiteForms = {
    sendLead,
  };
})();
