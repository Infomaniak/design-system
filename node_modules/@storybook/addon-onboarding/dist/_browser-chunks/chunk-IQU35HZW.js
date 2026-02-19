// src/features/IntentSurvey/IntentSurvey.tsx
import React, { Fragment, useState } from "react";
import { Button, Form, Modal } from "storybook/internal/components";
import { styled } from "storybook/theming";

// ../../.storybook/isChromatic.ts
function isChromatic(windowArg) {
  let windowToCheck = windowArg || typeof window < "u" && window;
  return !!(windowToCheck && (windowToCheck.navigator.userAgent.match(/Chromatic/) || windowToCheck.location.href.match(/chromatic=true/)));
}

// src/features/IntentSurvey/IntentSurvey.tsx
var Content = styled(Modal.Content)(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  color: theme.color.defaultText,
  gap: 8
})), Row = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  marginBottom: 8
}), Question = styled.div(({ theme }) => ({
  marginTop: 8,
  marginBottom: 2,
  fontWeight: theme.typography.weight.bold
})), Label = styled.label({
  display: "flex",
  gap: 8,
  '&:has(input[type="checkbox"]:not(:disabled), input[type="radio"]:not(:disabled))': {
    cursor: "pointer"
  }
}), Actions = styled(Modal.Actions)({
  marginTop: 8
}), Checkbox = styled(Form.Checkbox)({
  margin: 2
}), IntentSurvey = ({
  isOpen,
  onComplete,
  onDismiss
}) => {
  let [isSubmitting, setIsSubmitting] = useState(!1), [formFields, setFormFields] = useState({
    building: {
      label: "What are you building?",
      type: "checkbox",
      required: !0,
      options: shuffleObject({
        "design-system": { label: "Design system" },
        "application-ui": { label: "Application UI" }
      }),
      values: {
        "design-system": !1,
        "application-ui": !1
      }
    },
    interest: {
      label: "Which of these are you interested in?",
      type: "checkbox",
      required: !0,
      options: shuffleObject({
        "ui-documentation": { label: "Generating UI docs" },
        "functional-testing": { label: "Functional testing" },
        "accessibility-testing": { label: "Accessibility testing" },
        "visual-testing": { label: "Visual testing" },
        "ai-augmented-development": { label: "Building UI with AI" },
        "team-collaboration": { label: "Team collaboration" },
        "design-handoff": { label: "Design handoff" }
      }),
      values: {
        "ui-documentation": !1,
        "functional-testing": !1,
        "accessibility-testing": !1,
        "visual-testing": !1,
        "ai-augmented-development": !1,
        "team-collaboration": !1,
        "design-handoff": !1
      }
    },
    referrer: {
      label: "How did you discover Storybook?",
      type: "select",
      required: !0,
      options: shuffleObject({
        "we-use-it-at-work": { label: "We use it at work" },
        "via-friend-or-colleague": { label: "Via friend or colleague" },
        "via-social-media": { label: "Via social media" },
        youtube: { label: "YouTube" },
        "web-search": { label: "Web Search" },
        "ai-agent": { label: "AI Agent (e.g. ChatGPT)" }
      }),
      values: {
        "we-use-it-at-work": !1,
        "via-friend-or-colleague": !1,
        "via-social-media": !1,
        youtube: !1,
        "web-search": !1,
        "ai-agent": !1
      }
    }
  }), updateFormData = (key, optionOrValue, value) => {
    let field = formFields[key];
    setFormFields((fields) => {
      if (field.type === "checkbox") {
        let values = { ...field.values, [optionOrValue]: !!value };
        return { ...fields, [key]: { ...field, values } };
      }
      if (field.type === "select") {
        let values = Object.fromEntries(
          Object.entries(field.values).map(([opt]) => [opt, opt === optionOrValue])
        );
        return { ...fields, [key]: { ...field, values } };
      }
      return fields;
    });
  }, isValid = Object.values(formFields).every((field) => field.required ? Object.values(field.values).some((value) => value === !0) : !0);
  return React.createElement(
    Modal,
    {
      ariaLabel: "Storybook user survey",
      open: isOpen,
      width: 420,
      onOpenChange: (isOpen2) => {
        isOpen2 || onDismiss();
      }
    },
    React.createElement(Form, { onSubmit: (e) => {
      isValid && (e.preventDefault(), setIsSubmitting(!0), onComplete(
        Object.fromEntries(Object.entries(formFields).map(([key, field]) => [key, field.values]))
      ));
    }, id: "intent-survey-form" }, React.createElement(Content, null, React.createElement(Modal.Header, { onClose: onDismiss }, React.createElement(Modal.Title, null, "Help improve Storybook")), Object.keys(formFields).map((key) => {
      let field = formFields[key];
      return React.createElement(Fragment, { key }, React.createElement(Question, null, field.label), field.type === "checkbox" && React.createElement(Row, null, Object.entries(field.options).map(([opt, option]) => {
        let id = `${key}:${opt}`;
        return React.createElement("div", { key: id }, React.createElement(Label, { htmlFor: id }, React.createElement(
          Checkbox,
          {
            name: id,
            id,
            checked: field.values[opt],
            disabled: isSubmitting,
            onChange: (e) => updateFormData(key, opt, e.target.checked)
          }
        ), option.label));
      })), field.type === "select" && React.createElement(
        Form.Select,
        {
          name: key,
          id: key,
          value: Object.entries(field.values).find(([, isSelected]) => isSelected)?.[0] || "",
          required: field.required,
          disabled: isSubmitting,
          onChange: (e) => updateFormData(key, e.target.value)
        },
        React.createElement("option", { disabled: !0, hidden: !0, value: "" }, "Select an option..."),
        Object.entries(field.options).map(([opt, option]) => React.createElement("option", { key: opt, value: opt }, option.label))
      ));
    }), React.createElement(Actions, null, React.createElement(
      Button,
      {
        ariaLabel: !1,
        disabled: isSubmitting || !isValid,
        size: "medium",
        type: "submit",
        variant: "solid"
      },
      "Submit"
    ))))
  );
};
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function shuffleObject(object) {
  return isChromatic() ? object : Object.fromEntries(shuffle(Object.entries(object)));
}

export {
  IntentSurvey
};
