const urlApi = 'https://economia.awesomeapi.com.br/json/all'; // URL da API

const priceCoins = async () => { // Função assíncrona para receber os dados da API
  const response = await fetch(urlApi);
  const data = response.json(); // Converte os dados do JSON
  return data;
};

export default priceCoins;
