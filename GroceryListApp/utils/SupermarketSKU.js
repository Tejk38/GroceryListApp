class SupermarketSKU {
    constructor() {
        this.url = null;
        this.name = null;
        this.raw = "";
    }

    async fetchData(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
            }
        });
        return await response.text();
    }
}

class AsdaSKU extends SupermarketSKU {
    constructor() {
        super();
        this.url = "https://groceries.asda.com/";
        this.name = "ASDA";
    }

    async getPricesForItems(itemNames) {
        const prices = {};
        for (const itemName of itemNames) {
            const searchUrl = `${this.url}search?query=${encodeURIComponent(itemName)}`;
            this.raw = await this.fetchData(searchUrl);
            prices[itemName] = this.findPrice(itemName);
        }
        return prices;
    }

    findPrice(itemName) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.raw, 'text/html');
        const priceElement = doc.querySelector('.product .price'); // Adjust selector as needed
        return priceElement ? priceElement.textContent.trim() : 'N/A';
    }
}

class WaitroseSKU extends SupermarketSKU {
    constructor() {
        super();
        this.url = "https://www.waitrose.com/";
        this.name = "Waitrose";
    }

    async getPricesForItems(itemNames) {
        const prices = {};
        for (const itemName of itemNames) {
            const searchUrl = `${this.url}search?query=${encodeURIComponent(itemName)}`;
            this.raw = await this.fetchData(searchUrl);
            prices[itemName] = this.findPrice(itemName);
        }
        return prices;
    }

    findPrice(itemName) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.raw, 'text/html');
        const priceElement = doc.querySelector('.product .price'); // Adjust selector as needed
        return priceElement ? priceElement.textContent.trim() : 'N/A';
    }
}
class TescoSKU extends SupermarketSKU {
    constructor() {
        super();
        this.url = "https://www.tesco.com/";
        this.name = "Tesco";
    }

    async getPricesForItems(itemNames) {
        const prices = {};
        for (const itemName of itemNames) {
            const searchUrl = `${this.url}search?query=${encodeURIComponent(itemName)}`;
            this.raw = await this.fetchData(searchUrl);
            prices[itemName] = this.findPrice(itemName);
        }
        return prices;
    }

    findPrice(itemName) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.raw, 'text/html');
        const priceElement = doc.querySelector('.product .price'); // Adjust selector as needed
        return priceElement ? priceElement.textContent.trim() : 'N/A';
    }
}

class MorrisonsSKU extends SupermarketSKU {
    constructor() {
        super();
        this.url = "https://www.morrisons.com/";
        this.name = "Morrisons";
    }

    async getPricesForItems(itemNames) {
        const prices = {};
        for (const itemName of itemNames) {
            const searchUrl = `${this.url}search?query=${encodeURIComponent(itemName)}`;
            this.raw = await this.fetchData(searchUrl);
            prices[itemName] = this.findPrice(itemName);
        }
        return prices;
    }

    findPrice(itemName) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.raw, 'text/html');
        const priceElement = doc.querySelector('.product .price'); // Adjust selector as needed
        return priceElement ? priceElement.textContent.trim() : 'N/A';
    }
}

