import {
  IntentSurvey
} from "./chunk-IQU35HZW.js";
import {
  ADDON_ONBOARDING_CHANNEL
} from "./chunk-VFOIHBP2.js";
import "./chunk-ZYVL3X5E.js";

// src/Survey.tsx
import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider, convert } from "storybook/theming";
var theme = convert();
function Survey({ api }) {
  let userAgent = globalThis?.navigator?.userAgent, [isOpen, setIsOpen] = useState(!0);
  useEffect(() => {
    api.emit(ADDON_ONBOARDING_CHANNEL, {
      from: "guide",
      type: "openSurvey",
      userAgent
    });
  }, [api, userAgent]);
  let disableOnboarding = useCallback(() => {
    setIsOpen(!1), api.applyQueryParams({ onboarding: void 0 }, { replace: !0 });
  }, [api]), complete = useCallback(
    (answers) => {
      api.emit(ADDON_ONBOARDING_CHANNEL, {
        answers,
        type: "survey",
        userAgent
      }), disableOnboarding();
    },
    [api, disableOnboarding, userAgent]
  ), dismiss = useCallback(() => {
    api.emit(ADDON_ONBOARDING_CHANNEL, {
      type: "dismissSurvey"
    }), disableOnboarding();
  }, [api, disableOnboarding]);
  return React.createElement(ThemeProvider, { theme }, React.createElement(IntentSurvey, { isOpen, onComplete: complete, onDismiss: dismiss }));
}
export {
  Survey as default
};
