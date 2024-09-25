class LaptopPage {
    constructor(page) {
      this.page = page;
      this.productSelector = 'article[data-autotest-id="product-snippet"]'; // Селектор для карточек товаров
      this.priceFromInput = 'input[placeholder="от"]'; // Селектор для минимальной цены
      this.priceToInput = 'input[placeholder="до"]';   // Селектор для максимальной цены
    }
  
// Логирование первых 5 товаров
async getFirstFiveProducts() {
    // Ожидание появления элементов с названиями товаров
    await this.driver.wait(until.elementsLocated(this.productTitlesLocator), 5000);
    
    // Ожидание появления элементов с ценами товаров
    await this.driver.wait(until.elementsLocated(this.productPricesLocator), 5000);

    // Находим все элементы с названиями и ценами
    const productTitles = await this.driver.findElements(this.productTitlesLocator);
    const productPrices = await this.driver.findElements(this.productPricesLocator);

    // Определяем количество товаров на странице (не больше 5)
    const productCount = Math.min(productTitles.length, productPrices.length, 5);

    let products = [];

    // Цикл по найденным товарам
    for (let i = 0; i < productCount; i++) {
        let title = await productTitles[i].getText();
        let price = await productPrices[i].getText();
        products.push({ title, price });
    }

    return products;
}




      
      
  
    // Установка фильтра по цене
    async setPriceFilter(min, max) {
        console.log(`Устанавливаем фильтр цен: от ${min} до ${max}`);
        await this.page.waitForSelector(this.priceFromInput, { timeout: 10000 });
        await this.page.fill(this.priceFromInput, min.toString());
        console.log(`Введено минимальное значение: ${min}`);
        
        await this.page.waitForSelector(this.priceToInput, { timeout: 10000 });
        await this.page.fill(this.priceToInput, max.toString());
        console.log(`Введено максимальное значение: ${max}`);
        
        await this.page.keyboard.press('Enter');
        console.log('Применен фильтр');
        
        await this.page.waitForLoadState('networkidle');
        console.log('Страница перезагружена после применения фильтра');
      }
  
    // Проверка цен в заданном диапазоне
    async verifyPricesInRange(min, max) {
      console.log('Проверяем, что цены товаров находятся в заданном диапазоне:');
      await this.page.waitForSelector(this.productSelector);
      const products = await this.page.$$(this.productSelector);
      for (let i = 0; i < Math.min(products.length, 5); i++) {
        const product = products[i];
        const priceText = await product.$eval('div[data-zone-name="price"] span', el => el.textContent.trim());
        const price = parseInt(priceText.replace(/\D/g, ''));
        if (price >= min && price <= max) {
          console.log(`Товар ${i + 1}: цена ${price}₽ соответствует диапазону.`);
        } else {
          console.error(`Ошибка: Товар ${i + 1}: цена ${price}₽ не соответствует диапазону.`);
        }
      }
    }
  }
  
  export default LaptopPage;
  