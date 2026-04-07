# Generate a `CI_WORKFLOW_TRIGGER_DESIGN_SYSTEM_TOKEN`

Go to the [personal-access-tokens page](https://github.com/settings/personal-access-tokens/new).

Create a new "fine-grained token".

Give it the name: `CI_WORKFLOW_TRIGGER_DESIGN_SYSTEM_TOKEN`.

Select `Infomaniak` as the "Resource owner".

Pick `Infomaniak/design-system` as "Repository access".

Set the following permissions:

![](assets/trigger-workflow-token--permissions.png)

And click "Generate token".

Finally put this token inside your `.env` file:

```dotenv
CI_WORKFLOW_TRIGGER_DESIGN_SYSTEM_TOKEN="github_pat_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
