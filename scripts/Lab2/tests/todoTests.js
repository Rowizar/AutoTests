import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import TodoPage from '../pages/todoPage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

describe('Todo App Tests', function () {
  this.timeout(30000);
  let driver;
  let todoPage;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    todoPage = new TodoPage(driver);
  });

  after(async function () {
    await driver.quit();
  });

  it('Should perform the steps from test case 1', async function () {
    try {
      await todoPage.open();

            // Проверка заголовка страницы
            const title = await todoPage.getTitle();
            expect(title).to.equal('Sample page - lambdatest.com');

            // Шаг 2: Проверка текста "5 of 5 remaining"
            let remainingText = await todoPage.getRemainingText();
            expect(remainingText).to.equal('5 of 5 remaining');

            // Шаги 3 и 4: Проверка первого элемента
            let isCrossed = await todoPage.isItemCrossedOut(1);
            expect(isCrossed).to.be.false;

            await todoPage.clickItemCheckbox(1);

            isCrossed = await todoPage.isItemCrossedOut(1);
            expect(isCrossed).to.be.true;

            remainingText = await todoPage.getRemainingText();
            expect(remainingText).to.equal('4 of 5 remaining');

            // Шаг 5: Повторение для остальных элементов
            for (let i = 2; i <= 5; i++) {
                isCrossed = await todoPage.isItemCrossedOut(i);
                expect(isCrossed).to.be.false;

                await todoPage.clickItemCheckbox(i);

                isCrossed = await todoPage.isItemCrossedOut(i);
                expect(isCrossed).to.be.true;

                remainingText = await todoPage.getRemainingText();
                expect(remainingText).to.equal(`${5 - i} of 5 remaining`);
            }

            // Шаг 6: Добавление нового элемента
            await todoPage.addNewItem('Новый элемент');

            const lastItemText = await todoPage.getLastItemText();
            expect(lastItemText).to.equal('Новый элемент');

            remainingText = await todoPage.getRemainingText();
            expect(remainingText).to.equal('1 of 6 remaining');

            // Шаг 7: Зачёркивание нового элемента
            await todoPage.clickLastItemCheckbox();

            const isLastCrossed = await todoPage.isLastItemCrossedOut();
            expect(isLastCrossed).to.be.true;

            remainingText = await todoPage.getRemainingText();
            expect(remainingText).to.equal('0 of 6 remaining');
        } catch (error) {
            await takeScreenshot(driver, 'TestCase1');
            throw error;
          }
        });
      });
      
      // Function to take a screenshot on test failure
      async function takeScreenshot(driver, testName) {
        const screenshot = await driver.takeScreenshot();
        const dateTime = new Date().toISOString().replace(/:/g, '-');
        const fileName = `${testName}_${dateTime}.png`;
        const filePath = path.join(__dirname, '..', 'screenshots', fileName);
        fs.writeFileSync(filePath, screenshot, 'base64');
      }