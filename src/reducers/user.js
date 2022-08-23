import { userNameEmail } from '../actions';

const INITIAL_STATE = { email: '' };
// Estado inicial da variável, ao qual será usada adiante

const user = (state = INITIAL_STATE, action) => { // Função do reducer
  switch (action.type) { // switch para diferenciar a ação
  case userNameEmail:
    return {
      ...state, // Tive ajuda no reducer e action do Danillo e Sheila, muito obrigado! Ajudaram a corrigir o erro do reducer.
      email: action.email, // retonar o email digitado
      // Aqui retorna o email, note que a chave com o nome 'email', é a mesma da action
    };
  default:
    return state;
  }
};

export default user;
