# Use Figma `TokensBrücke` plugin

- [github](https://github.com/tokens-bruecke/figma-plugin)
- [figma plugin page](https://www.figma.com/community/plugin/1254538877056388290/tokensbrucke)

## Install

Install the `TokensBrücke` plugin from the Figma Community.

## Configure

### Configure GitHub

On the `Push to server` section click on the "plus" icon, and select `GitHub PR`.

![](assets/figma-tokens-bruecke--add-github-pr-push-server.png)

Then fill the form with:

- Personal access token: TODO doc link -> how to generate
- Owner: `Infomaniak`
- Repo name: `design-system`
- Base branch: `main`
- File name: `packages/tokens/dtcg/tokens-bruecke/tokens.json`


![](assets/figma-tokens-bruecke--configure-github-pr-push-server.png)

And click `Save`.

### Push to GitHub

Click on the `Push to server` button and await the PR to be created (success notification).

![](assets/figma-tokens-bruecke--push-to-server.png)


