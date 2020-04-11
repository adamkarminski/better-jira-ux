# 💎 Better Jira UX

This extension brings long-needed UX improvements to Jira.

## Features
- Assign a user to an issue without opening it (such a time saver!).
- Unassign an issue with the "U" key.

## Coming soon
_See: [Project page](https://github.com/adamkarminski/better-jira-ux/projects)_

- Use Cmd/Ctrl + K to quickly change a project.
- Keyboard shortcut for focusing the backlog search.
- Changing priority without opening an issue.

## Structure
The main JavaScript code lives in the `src/js` directory. It's structured like this:
- `jira/` - a set of shared components that allow interacting with the Jira's UI. Everything that searches or modifies the original Jira's DOM goes here.
- `modules/` - modules of the extension that work on top of Jira's UI.
- `lib/` - shared libraries, aka utils.

## Developing the extension
1. Clone the repository.
2. Run `yarn install` and `yarn build`.
3. Load the `build/` folder as an [unpacked extension](https://developer.chrome.com/extensions/getstarted).

Pull requests are welcomed.


## Credits
Samuel Simões ~ [@samuelsimoes](https://twitter.com/samuelsimoes) ~ [Blog](http://blog.samuelsimoes.com/) for developing the [Chrome Extension Webpack Boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate).
