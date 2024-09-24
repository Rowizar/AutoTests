import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import MospolytechPage from '../pages/mospolytechPage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Mospolytech Schedule Tests', function () {
  this.timeout(60000);
  let driver;
  let mospolytechPage;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    mospolytechPage = new MospolytechPage(driver);
  });

  after(async function () {
    await driver.quit();
  });

  it('Should search for a group schedule, click the group, wait for the page to load, and take a screenshot', async function () {
    try {
      await mospolytechPage.open();

      await mospolytechPage.clickScheduleButton();

      await mospolytechPage.clickSeeOnSite();

      await mospolytechPage.switchToNewTab();

      const groupNumber = '221-322';
      await mospolytechPage.enterGroupNumber(groupNumber);

      await mospolytechPage.clickFirstSearchResult(groupNumber);

      await mospolytechPage.waitForTimetableToLoad();

      await takeScreenshot(driver, 'Timetable');

    } catch (error) {

      await takeScreenshot(driver, 'MospolytechTest');
      throw error;
    }
  });
});

async function takeScreenshot(driver, testName) {
  const screenshot = await driver.takeScreenshot();
  const dateTime = new Date().toISOString().replace(/:/g, '-');
  const fileName = `${testName}_${dateTime}.png`;
  const filePath = path.join(__dirname, '..', 'screenshots', fileName);
  fs.writeFileSync(filePath, screenshot, 'base64');
}
