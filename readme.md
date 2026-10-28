# Assessment 3

A repo to hold Group 13's Systems Testing and Quality Management Assessment 3 test code.

> [!NOTE]
> FOR MARKER:
> use `npm test` to run the full test suite.

# Setup

## 1. Install vscode & get extensions

- [hdorgeval.testcafe-snippets](https://marketplace.visualstudio.com/items?itemName=hdorgeval.testcafe-snippets)

- [formulahendry.code-runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)

## 2. Install git

## 3. Authenticate git with GitHub to work on private repos

I don't remember how I did this tbh. To check if you need to do this, try the next step. It will error if you aren't authenticated.

## 4. Clone the repo

```bash
git clone https://github.com/Aerodynamax/STQM-Assess-3.git
```

## 5. open the repo folder in the terminal and install TestCafe

> [!NOTE]
> This will install the correct version of testcafe.

```bash
npm i
```

## 7. You're done! Open the folder in VSCode to start doing stuff

# Run

If you have installed code runner, the play button in the top right of the editor should just work (ctrl+alt+n).

To run it in the terminal:

```bash
npx testcafe chrome tests/PATH/TO/YOUR_TEST_FILE.js

# e.g.
npx testcafe chrome tests/example.js
```
