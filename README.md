# Restaurants Reviews QA

## Introduction
This is a Quality Assurance (QA) project for a [Restaurant Reviews](https://restaurant-reviews.glitch.me/) web application. The purpose of this project is to test core functionalities, as well as assess accessibility and offline capabilities.

## Components
The project has 4 main components:

1. Automated end-to-end tests using [Cypress](https://www.cypress.io) and Typescript
2. Exploratory accessibility tests using [Xray](https://www.getxray.app/exploratory-testing)
3. Manual tests for offline capability
4. A comprehensive bug report for a key functionality that recently stopped working

## Documents

### User stories
User stories are saved in pdf files exported from [JIRA](https://www.atlassian.com/software/jira). There is a detailed list of user stories including acceptance criteria [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/user-stories/user-stories-details.pdf). Click [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/user-stories/user-stories-summary.pdf) for a summarised version of the list. See below for a mind map of features and functionalities.

![Features and functionalities mind map](https://raw.githubusercontent.com/aneesa-saleh/restaurant-reviews-qa/master/docs/Features%20and%20functionalities%20mind%20map.jpg)

<p align=center>Mind map of features and functionalities</p>

### Test cases (manual)
Test cases were created using JIRA and [Zephyr Scale](https://smartbear.com/test-management/zephyr-scale/). They have been exported to the `test-cases` folder [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/test-cases/offline-tests.xlsx).

### Reports
All reports can be found in the `reports` folder. Bug reports are in the `docs/reports/bugs` folder [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/reports/bugs).

## Accessibility Testing
Accessibility tests are performed using [Xray](https://www.getxray.app/exploratory-testing). Reports are available in the `docs/reports/exploratory-tests` folder [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/reports/exploratory-tests). Click [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/test-cases/accessibility-test-cases.xlsx) for test cases.

## Offline Capability Testing
Manual offline capability testing verifies that a subset of features work seamlessly without an internet connection. Chrome dev tools are used to simulate offline mode. Click [here](https://github.com/aneesa-saleh/restaurant-reviews-qa/tree/master/docs/test-cases/offline-test-cases.xlsx) for test cases.

## Automated tests
Automated tests are written using Cypress and Typescript. Tests are **End-to-End** tests that simulate how users would interact with the system, mostly connecting to the API with a few endpoints stubbed. There are also **User Journeys** that cover critical functionalities for frequently occuring scenarios.
<br/>
<br/>
Follow these steps to set up and run Cypress tests.

### Prerequisites
* Node.js installed on your machine
* Git installed on your machine

### Installation
* Clone this repository to your local machine
* Navigate to the project directory in your terminal or cmd
* Install dependencies by running: 
```
npm install
```

### Running the tests
* To serve the application and open cypress, run:
```
npm run serve-and-open-cypress
```
* In the Cypress Test Runner, click on `E2E Testing`
* Select a browser and click on `Start E2E Testing in *Browser*`
* Select the desired test suite under `cypress/e2e` and click on the test you want to run. There are two test files with End-to-End tests for each page of the application (`home-page.spec.ts, details-page.spec.ts`), and one that contains tests for User Journeys (`user-journeys.spec.ts`).

## License
This project is licensed under the MIT License.

## Contact
If you're a QA enthusiast like me, please connect with me on LinkedIn [here](https://www.linkedin.com/in/aneesa-saleh/). If you have any questions,  suggestions or need assistance, feel free to email me at aneesa.saleh@gmail.com.
