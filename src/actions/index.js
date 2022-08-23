import priceCoins from '../API/PriceCoins'; // Importa a função da API

const searchCoin = async (coin) => {
  const url = `https://economia.awesomeapi.com.br/json/last/${coin}`;
  const request = await fetch(url);
  const response = request.json();
  return response;
};

export const userNameEmail = 'SET_USERNAME_EMAIL'; // Variável para o action.type ficar mais legível
export const walletUserType = 'SET_WALLET_USER'; // Variável para o action.type ficar mais legível
export const addExpense = 'ADD_EXPENSE';
export const coinRequest = 'REQUEST_MONEY'; // Variável para o action.type ficar mais legível
export const coinRequestSucess = 'REQUEST_MONEY_OKAY'; // Variável para o action.type ficar mais legível
export const coinRequestFail = 'REQUEST_MONEY_FAIL'; // Variável para o action.type ficar mais legível
export const coinRequestCoinEspecific = 'REQUEST_MONEY_ESPECIFIC'; // Variável para o action.type ficar mais legível
export const coinRequestCoinEspecificSucess = 'REQUEST_MONEY_ESPECIFIC_OKAY'; // Variável para o action.type ficar mais legível
export const coinRequestCoinEspecificFail = 'REQUEST_MONEY_ESPECIFIC_FAIL'; // Variável para o action.type ficar mais legível

export const setUserEmail = (user) => ({ // Função para pegar o email do usuário
  type: userNameEmail,
  email: user, // O parâmetro passado precisa ter o mesmo nome usado no reducer.
});

export const addExpenses = (exp) => ({ // Função para pegar a nova despesa do usuário.
  type: addExpense,
  exp, // O parâmetro passado precisa ter o mesmo nome usado no reducer.
});

// export const setWalletUser = (coin) => ({ // Função para setar a moeda;
//   type: walletUserType,
//   currencies: coin, // Passa para o store do redux
// });

export const coinApiRequest = () => ({ // Função para complementar a requisição da API
  type: coinRequest,
});

export const coinReqFailure = (error) => ({ // Função para alertar erro da requisição da API
  type: coinRequestFail, error,
});

export const coinReqOkay = (coinAPI) => ({ // Função para dizer que foi um sucesso a requisição da API
  type: coinRequestSucess,
  currencies: coinAPI,
});

export const coinApiReturnData = () => async (dispatch) => { // Despacha para o store o resultado da requisição
  dispatch(coinApiRequest());
  try {
    const request = await priceCoins(); // API
    dispatch(coinReqOkay(Object.keys(request)
      .filter((currencyNationality) => currencyNationality !== 'USDT'))); // Filtra as moedas de cada pais e remove as do EUA
  } catch (e) {
    dispatch(coinReqFailure(e)); // Em caso de falha, irá disparar esse erro.
  }
};

export const coinEspecificNewRequest = () => ({ // Função para complementar a requisição da API
  type: coinRequestCoinEspecific,
});

export const coinEspecificNewRequestFail = (error) => ({ // Função para alertar erro da requisição da API
  type: coinRequestCoinEspecificFail, error,
});

export const coinEspecificNewRequestOkay = (coinEspecific) => ({ // Função para dizer que foi um sucesso a requisição da API
  type: coinRequestCoinEspecificSucess,
  coinEsp: coinEspecific,
});

export const coinEspecificNewRequestAPI = (coin) => async (dispatch) => { // Despacha para o store o resultado da requisição
  dispatch(coinEspecificNewRequest()); // Invoca o primeiro Type
  try {
    const request = await searchCoin(coin); // Pesquisa na URL a moeda
    dispatch(coinEspecificNewRequestOkay((request))); // Caso ache, ela entrará aqui e retorna-rá a moeda escolhida
  } catch (e) {
    dispatch(coinEspecificNewRequestFail(e)); // Em caso de falha, irá disparar esse erro.
  }
};
