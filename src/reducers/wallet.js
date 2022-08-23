import {
  addExpense,
  coinRequestCoinEspecificSucess,
  coinRequestSucess,
} from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  coinSpecific: {},
};

function wallet(state = INITIAL_STATE, action) { // Função do reducer
  switch (action.type) { // switch para diferenciar a ação
  case coinRequestSucess:
    return {
      ...state,
      currencies: action.currencies, // retona as moedas
    };
  case coinRequestCoinEspecificSucess: // Função para retornar a moeda específica
    return {
      ...state,
      coinEsp: action.coinEspecific,
    };
  case addExpense: // Adiciona as dívidas
    return {
      ...state,
      expenses: [...state.expenses, action.exp], // Faz um rest e une com o que foi incrementado
    };

  default:
    return state;
  }
}

export default wallet; // exporta a função
