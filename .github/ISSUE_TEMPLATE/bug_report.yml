name: Bug report
description: Create a report to help us improve
title: "[Bug] "
labels: ["bug"]

body:
  - type: markdown
    attributes:
      value: "## Describe the bug"
  - type: textarea
    id: bug-description
    attributes:
      label: "Bug Description"
      description: "A clear and concise description of what the bug is."
      placeholder: "Explain the bug..."
    validations:
      required: true

  - type: markdown
    attributes:
      value: "## To Reproduce"
  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: "Steps to Reproduce"
      description: "Steps to reproduce the behavior:"
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: markdown
    attributes:
      value: "## Expected behavior"
  - type: textarea
    id: expected-behavior
    attributes:
      label: "Expected Behavior"
      description: "A clear and concise description of what you expected to happen."
      placeholder: "Describe what you expected to happen..."
    validations:
      required: true

  - type: markdown
    attributes:
      value: "## Screenshots"
  - type: textarea
    id: screenshots
    attributes:
      label: "Screenshots"
      description: "If applicable, add screenshots to help explain your problem."
      placeholder: "Paste your screenshots here or write 'N/A' if not applicable..."
    validations:
      required: false

  - type: markdown
    attributes:
      value: "## Deployment"
  - type: checkboxes
    id: deployment
    attributes:
      label: "Deployment Method"
      description: "Please select the deployment method you are using."
      options:
        - label: "Docker"
        - label: "Vercel"
        - label: "Server"

  - type: markdown
    attributes:
      value: "## Desktop (please complete the following information):"
  - type: input
    id: desktop-os
    attributes:
      label: "Desktop OS"
      description: "Your desktop operating system."
      placeholder: "e.g., Windows 10"
    validations:
      required: false
  - type: input
    id: desktop-browser
    attributes:
      label: "Desktop Browser"
      description: "Your desktop browser."
      placeholder: "e.g., Chrome, Safari"
    validations:
      required: false
  - type: input
    id: desktop-version
    attributes:
      label: "Desktop Browser Version"
      description: "Version of your desktop browser."
      placeholder: "e.g., 89.0"
    validations:
      required: false

  - type: markdown
    attributes:
      value: "## Smartphone (please complete the following information):"
  - type: input
    id: smartphone-device
    attributes:
      label: "Smartphone Device"
      description: "Your smartphone device."
      placeholder: "e.g., iPhone X"
    validations:
      required: false
  - type: input
    id: smartphone-os
    attributes:
      label: "Smartphone OS"
      description: "Your smartphone operating system."
      placeholder: "e.g., iOS 14.4"
    validations:
      required: false
  - type: input
    id: smartphone-browser
    attributes:
      label: "Smartphone Browser"
      description: "Your smartphone browser."
      placeholder: "e.g., Safari"
    validations:
      required: false
  - type: input
    id: smartphone-version
    attributes:
      label: "Smartphone Browser Version"
      description: "Version of your smartphone browser."
      placeholder: "e.g., 14"
    validations:
      required: false

  - type: markdown
    attributes:
      value: "## Additional Logs"
  - type: textarea
    id: additional-logs
    attributes:
      label: "Additional Logs"
      description: "Add any logs about the problem here."
      placeholder: "Paste any relevant logs here..."
    validations:
      required: false
