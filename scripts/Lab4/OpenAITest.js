const { chromium } = require('playwright');
const OpenAIPage = require('./OpenAIPage');
const fs = require('fs');
const path = require('path');

describe('Тест поиска на сайте OpenAI с Playwright', function () {
    this.timeout(60000); // Увеличение тайм-аута до 60 секунд
    let browser, page, openAIPage;

    before(async () => {
        // Запуск браузера в режиме НЕ headless
        browser = await chromium.launch({ headless: false });
        page = await browser.newPage();
        openAIPage = new OpenAIPage(page);
        console.log('Браузер открыт');

        // Переход на сайт OpenAI
        await openAIPage.goto();
        console.log('Открыт сайт OpenAI');
    });

    after(async () => {
        if (browser) {
            await browser.close();  // Закрываем браузер после завершения тестов
        }
    });

    it('Должен проверить, что главная страница OpenAI загружается и отображает логотип', async () => {
        await openAIPage.checkLogo();
    });

    it('Должен перейти на страницу About и проверить заголовок', async () => {
        await openAIPage.goToAboutPage();
    });

    it('Вернуться на главную и продолжить поиск', async () => {
        await openAIPage.goto();
    });

    it('Должен выполнить поиск по ChatGPT и сделать скриншот', async () => {
        await openAIPage.searchChatGPT();
    });
});
