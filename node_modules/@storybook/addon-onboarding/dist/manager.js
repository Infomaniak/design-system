import {
  ADDON_CONTROLS_ID,
  ADDON_ID
} from "./_browser-chunks/chunk-VFOIHBP2.js";
import "./_browser-chunks/chunk-ZYVL3X5E.js";

// src/manager.tsx
import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { STORY_SPECIFIED } from "storybook/internal/core-events";
import { addons, internal_universalChecklistStore as checklistStore } from "storybook/manager-api";
var Onboarding = lazy(() => import("./_browser-chunks/Onboarding-Q5GKVBY2.js")), Survey = lazy(() => import("./_browser-chunks/Survey-DWFAZIJS.js")), root = null, render = (node) => {
  let container = document.getElementById("storybook-addon-onboarding");
  container || (container = document.createElement("div"), container.id = "storybook-addon-onboarding", document.body.appendChild(container)), root = root ?? createRoot(container), root.render(React.createElement(Suspense, { fallback: React.createElement("div", null) }, node));
};
addons.register(ADDON_ID, async (api) => {
  let { path, queryParams } = api.getUrlState(), isOnboarding = path === "/onboarding" || queryParams.onboarding === "true", isSurvey = queryParams.onboarding === "survey", hasCompletedSurvey = await new Promise((resolve) => {
    let unsubscribe = checklistStore.onStateChange(({ loaded, items }) => {
      loaded && (unsubscribe(), resolve(items.onboardingSurvey.status === "accepted"));
    });
  });
  if (isSurvey)
    return hasCompletedSurvey ? null : render(React.createElement(Survey, { api }));
  if (await new Promise((resolve) => api.once(STORY_SPECIFIED, resolve)), !(!!api.getData("example-button--primary") || !!document.getElementById("example-button--primary"))) {
    console.warn(
      "[@storybook/addon-onboarding] It seems like you have finished the onboarding experience in Storybook! Therefore this addon is not necessary anymore and will not be loaded. You are free to remove it from your project. More info: https://github.com/storybookjs/storybook/tree/next/code/addons/onboarding#uninstalling"
    );
    return;
  }
  if (!(!isOnboarding || window.innerWidth < 730))
    return api.togglePanel(!0), api.togglePanelPosition("bottom"), api.setSelectedPanel(ADDON_CONTROLS_ID), render(React.createElement(Onboarding, { api, hasCompletedSurvey }));
});
