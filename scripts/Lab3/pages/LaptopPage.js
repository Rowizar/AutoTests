class LaptopPage {
    constructor(page) {
      this.page = page;
  
      // Обновленные селекторы
      this.productTitlesLocator = 'span[role="link"][data-auto="snippet-title"]';
      this.productPricesLocator = './/div[@data-zone-name="price"]//span[contains(text(), "₽")]';
  
      // Селекторы для фильтрации (проверьте актуальность на сайте)
      this.priceFromInput = 'input[placeholder="от"]'; // Обновлено с "От" на "от"
      this.priceToInput = 'input[placeholder="до"]';   // Обновлено с "До" на "до"
    }
  
    // Метод для получения и вывода первых 5 товаров
    async getFirstFiveProducts() {
      console.log('Выводим первые 5 найденных товаров:');
  
      // Ждем появления товаров на странице
      await this.page.waitForSelector(this.productTitlesLocator, { timeout: 20000 });
  
      // Получаем список товаров
      const products = await this.page.$$(this.productTitlesLocator);
  
      console.log(`Найдено товаров: ${products.length}`);
  
      // Логируем первые 5 товаров
      for (let i = 0; i < Math.min(products.length, 5); i++) {
        const product = products[i];
        try {
          // Получаем название товара
          const titleElement = await product.$(this.productTitlesLocator);
          if (!titleElement) {
            console.error(`Название товара не найдено для товара ${i + 1}`);
            continue;
          }
          const titleText = await titleElement.textContent();
  
          // Получаем цену товара
          const priceElementHandles = await product.$x(this.productPricesLocator);
          if (priceElementHandles.length === 0) {
            console.error(`Цена товара не найдена для товара ${i + 1}`);
            continue;
          }
          const priceText = await priceElementHandles[0].textContent();
  
          console.log(`Товар ${i + 1}: ${titleText.trim()}, Цена: ${priceText.trim()}`);
        } catch (error) {
          console.error(`Ошибка при получении данных товара ${i + 1}:, error`);
        }
      }
    }
  
    // Установка фильтра по цене
    async setPriceFilter(min, max) {
      console.log(`Устанавливаем фильтр цен: от ${min} до ${max}`);
  
      // Проверяем наличие поля "от"
      if (await this.page.$(this.priceFromInput) !== null) {
        await this.page.fill(this.priceFromInput, min.toString());
        console.log(`Введено минимальное значение: ${min}`);
      } else {
        console.error('Поле ввода минимальной цены не найдено');
      }
  
      // Проверяем наличие поля "до"
      if (await this.page.$(this.priceToInput) !== null) {
        await this.page.fill(this.priceToInput, max.toString());
        console.log(`Введено максимальное значение: ${max}`);
      } else {
        console.error('Поле ввода максимальной цены не найдено');
      }
  
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
        try {
          const priceElementHandles = await product.$x(this.productPricesLocator);
          if (priceElementHandles.length === 0) {
            console.error(`Цена товара не найдена для товара ${i + 1}`);
            continue;
          }
          const priceText = await priceElementHandles[0].textContent();
          const price = parseInt(priceText.replace(/\s/g, '')); // Убираем пробелы и преобразуем в число
  
          if (price >= min && price <= max) {
            console.log(`Товар ${i + 1}: цена ${price}₽ соответствует диапазону.`);
          } else {
            console.error(`Ошибка: Товар ${i + 1}: цена ${price}₽ не соответствует диапазону.`);
          }
        } catch (error) {
          console.error(`Ошибка при проверке цены товара ${i + 1}:, error`);
        }
      }
    }
  }
  
  export default LaptopPage;