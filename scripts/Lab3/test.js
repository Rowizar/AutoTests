import { chromium } from 'playwright';
import { expect } from 'chai';
import MainPage from './pages/MainPage.js';
import CatalogPage from './pages/CatalogPage.js';
import LaptopPage from './pages/LaptopPage.js';

describe('Тест-кейс: Поиск ноутбуков в заданном ценовом диапазоне', function () {
  this.timeout(20000); // Увеличиваем тайм-аут для всех тестов и хуков до 20 секунд

  let browser;
  let page;
  let mainPage;
  let catalogPage;
  let laptopPage;

  before(async function () {
    this.timeout(2000); // Увеличиваем тайм-аут для хука before
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    mainPage = new MainPage(page);
    catalogPage = new CatalogPage(page);
    laptopPage = new LaptopPage(page);
  });

  after(async function () {
    await browser.close();
  });

  it('Должен открыть главную страницу Яндекс.Маркета', async function () {
    await mainPage.navigate();
    const url = await page.url();
    expect(url).to.include('market.yandex.ru');
  });

  it('Должен перейти в категорию "Ноутбуки"', async function () {
    await mainPage.openCatalog();
    await catalogPage.selectCategory();
    const pageTitle = await page.title();
    expect(pageTitle).to.include('Ноутбуки');
  });

  it('Должен вывести первые 5 найденных товаров', async function () {
    await laptopPage.getFirstFiveProducts(); // Изменено с logFirstFiveProducts на getFirstFiveProducts
  });

  it('Должен установить фильтр цен и проверить товары', async function () {
    await laptopPage.setPriceFilter(60000, 110000);
    await laptopPage.verifyPricesInRange(60000, 110000);
  });
});
