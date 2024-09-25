class CatalogPage {
    constructor(page) {
      this.page = page;
      this.electronicsCategory = 'a._3yHCR[href*="/catalog--elektronika/54440"]'; // Селектор для категории "Электроника"
      this.laptopsCategory = 'a._2re3U[href*="/catalog--noutbuki/26895412"]'; // Селектор для категории "Ноутбуки"
    }
  
    async selectCategory() {
      console.log('Наводим курсор на "Электроника" и кликаем по "Ноутбуки"');
      
      // Ожидание появления категории "Электроника"
      await this.page.waitForSelector(this.electronicsCategory, { timeout: 10000 });
      
      // Наводим на категорию "Электроника"
      await this.page.hover(this.electronicsCategory);
      
      // Ожидание появления категории "Ноутбуки" после наведения
      await this.page.waitForSelector(this.laptopsCategory, { timeout: 10000 });
      
      // Кликаем по категории "Ноутбуки"
      await this.page.click(this.laptopsCategory);
      
      // Ожидаем загрузку страницы
      await this.page.waitForLoadState('networkidle');
    }
  }
  
  export default CatalogPage;