const fs = require('fs');
const path = require('path');

class OpenAIPage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://openai.com/');
    }

    async checkLogo() {
        // Используем XPath для поиска логотипа
        const logo = await this.page.waitForSelector('//a[@aria-label="OpenAI Home"]//svg', { timeout: 10000 });
        if (logo) {
            console.log('Логотип найден');
        }
        await this.page.screenshot({ path: 'screenshots/homepage_loaded.png' });
    }

    async goToAboutPage() {
        // Прокрутка вниз до футера
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        console.log('Прокрутили страницу до футера');

        // Переход на страницу "About us" с использованием XPath
        await this.page.click('//a[contains(@class, "text-footer-link") and @href="/about/"]');
        console.log('Нажата ссылка "About us"');

        // Ожидание появления заголовка
        await this.page.waitForSelector('//h1[contains(text(), "About")]', { timeout: 10000 });
        console.log('Найден заголовок "About"');

        // Сохранение скриншота страницы
        await this.page.screenshot({ path: 'screenshots/about_page.png' });
        console.log('Скриншот страницы About сохранен');
    }

    async searchChatGPT() {
        try {
            const screenshotsDir = path.join(__dirname, 'screenshots');
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir);
                console.log('Папка screenshots создана');
            }

            // Наведение курсора на родительский элемент с использованием XPath
            await this.page.hover('//div[contains(@class, "flex gap-8 items-center")]');
            console.log('Курсор наведен на родительский элемент кнопки поиска');

            const buttons = await this.page.$x('//button[@aria-label="Open Search"]');
            console.log(`Найдено ${buttons.length} кнопок с aria-label "Open Search"`);

            for (const button of buttons) {
                if (await button.isVisible()) {
                    console.log('Найдена видимая кнопка, выполняем клик');
                    await button.click();
                    break;
                }
            }

            // Ввод текста "ChatGPT" в поле поиска
            const searchInput = await this.page.$x('//input[@type="text" and contains(@class, "bg-transparent")]');
            if (searchInput.length > 0) {
                await searchInput[0].fill('ChatGPT');
                await searchInput[0].press('Enter');
                console.log('Текст "ChatGPT" введен и нажата клавиша Enter');
            }

            const screenshotPath = path.join(screenshotsDir, 'search_after_enter.png');
            await this.page.screenshot({ path: screenshotPath });

            await this.page.waitForSelector('//div[contains(@class, "search-results")]', { timeout: 10000 });
            await this.page.screenshot({ path: path.join(screenshotsDir, 'search_chatgpt_results.png') });
            console.log('Скриншот результатов поиска сохранен');
        } catch (error) {
            console.error(`Ошибка во время теста: ${error}`);
            throw error;
        }
    }
}

module.exports = OpenAIPage;
