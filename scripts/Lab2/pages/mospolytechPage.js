import { By, until } from 'selenium-webdriver';

class MospolytechPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://mospolytech.ru/';
    }

    // Открытие страницы
    async open() {
        await this.driver.get(this.url);
        await this.driver.wait(until.elementLocated(By.css('a[href="/obuchauschimsya/raspisaniya/"]')), 30000); // Wait for the schedule button to be located
    }

    // Нажатие на кнопку "Расписания"
    async clickScheduleButton() {
        const scheduleButton = await this.driver.wait(until.elementLocated(By.css('a[href="/obuchauschimsya/raspisaniya/"]')), 30000);
        await scheduleButton.click();
    }

    // Нажатие на ссылку "Смотрите на сайте"
    async clickSeeOnSite() {
        const seeOnSiteLink = await this.driver.wait(until.elementLocated(By.css('a.btn.text-button[href="https://rasp.dmami.ru/"]')), 20000);
        await seeOnSiteLink.click();
    }

    // Переключение на новую вкладку
    async switchToNewTab() {
        const handles = await this.driver.getAllWindowHandles();
        await this.driver.switchTo().window(handles[handles.length - 1]);
    }

    // Ввод номера группы в поле поиска
    async enterGroupNumber(groupNumber) {
        const searchField = await this.driver.wait(until.elementLocated(By.css('input.groups')), 10000);
        await searchField.sendKeys(groupNumber);
    }

    // Нажатие на найденную группу с нужным id
    async clickFirstSearchResult(groupNumber) {
        const groupResult = await this.driver.wait(until.elementLocated(By.css(`div.group[id="${groupNumber}"]`)), 10000);
        await groupResult.click();
    }

    async waitForTimetableToLoad() {
        await this.driver.wait(until.elementLocated(By.css('.schedule-day')), 20000);
    }

    // Проверка, что текущий день выделен цветом
    async isCurrentDayHighlighted() {
        const today = new Date().getDay(); // Получаем номер дня недели
        const days = await this.driver.findElements(By.css('.schedule-day'));
        const currentDay = days[today - 1]; // В массиве дней недели индекс начинается с 0
        const classAttribute = await currentDay.getAttribute('class');
        return classAttribute.includes('current');
    }
}

export default MospolytechPage;
