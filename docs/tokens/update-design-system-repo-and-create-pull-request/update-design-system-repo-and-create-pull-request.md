# Generate a `CI_DS_UPDATE_AND_PR_AUTH_TOKEN`

Go to the [personal-access-tokens page](https://github.com/settings/personal-access-tokens/new).

Create a new "fine-grained token".

Give it the name: `CI_DS_UPDATE_AND_PR_AUTH_TOKEN`.

Select `Infomaniak` as the "Resource owner".

Pick `Infomaniak/design-system` as "Repository access".

Set the following permissions:

![](assets/update-design-system-repo-and-create-pull-request-token--permissions.png)

And click "Generate token".

Finally put this token inside your `.env` file:

```dotenv
CI_DS_UPDATE_AND_PR_AUTH_TOKEN="github_pat_xxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
