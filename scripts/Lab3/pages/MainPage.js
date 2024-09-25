class MainPage {
    constructor(page) {
      this.page = page;
      this.catalogButton = 'button:has-text("Каталог")'; // Обновленный селектор
    }
  
    async navigate() {
      console.log('Переходим на главную страницу Яндекс.Маркета');
      await this.page.goto('https://market.yandex.ru');
      
      // Ожидание появления кнопки "Каталог"
      await this.page.waitForSelector(this.catalogButton, { timeout: 15000 });
      console.log('Страница загружена, продолжаем тест.');
    }
    
    async openCatalog() {
      console.log('Открываем меню "Каталог"');
      
      // Ожидание и клик по кнопке "Каталог"
      await this.page.waitForSelector(this.catalogButton, { timeout: 15000 });
      await this.page.click(this.catalogButton);
    }
  }
  
  export default MainPage;
  