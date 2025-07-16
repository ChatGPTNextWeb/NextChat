import { sendGAEvent } from "@next/third-parties/google";

export function trackConversationGuideToCPaymentClick() {
  sendGAEvent("event", "ConversationGuideToCPaymentClick", { value: 1 });
}

export function trackAuthorizationPageButtonToCPaymentClick() {
  sendGAEvent("event", "AuthorizationPageButtonToCPaymentClick", { value: 1 });
}

export function trackAuthorizationPageBannerToCPaymentClick() {
  sendGAEvent("event", "AuthorizationPageBannerToCPaymentClick", {
    value: 1,
  });
}

export function trackSettingsPageGuideToCPaymentClick() {
  sendGAEvent("event", "SettingsPageGuideToCPaymentClick", { value: 1 });
}
