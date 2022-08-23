import propTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { addExpenses, coinApiReturnData, coinEspecificNewRequestAPI } from '../actions';
import priceCoins from '../API/PriceCoins';
import ExpenseTable from './ExpenseTable';
import './style.css';

const paymentForm = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
const categoryPayment = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];

class Wallet extends React.Component {
  constructor() {
    super();
    this.handleInfo = this.handleInfo.bind(this);
    this.state = {
      id: 0,
      value: 0,
      currency: '',
      description: '',
      method: 'Dinheiro',
      tag: 'Alimentação',
      exchangeRates: {},
    };
  }

  async componentDidMount() { // Monta o componente
    const { dispatchWalletUser } = this.props;
    await dispatchWalletUser(); // Chama a primeira API para pegar as moedas
    await priceCoins() // Nessa outra chamada, ela pega as moedas e passa para o exchangeRates
      .then((response) => this.setState({ exchangeRates: response })); // Passa o response para podermos pegar o 'ask';
  }

  headerWallet = () => { // Cabeçalho do componente.
    const { user } = this.props;
    return (
      <header className="mb-3">
        <div className="container--personal">
          <div className="sm-2 m-2">
            <section
              data-testid="email-field"
              className="form-control"
            >
              {user}
            </section>
          </div>
          <div className="sm-2 m-2">
            <section
              data-testid="total-field"
              className="form-control"
            >
              { this.totalCost() }
            </section>
          </div>
          <div className="sm-2 m-2">
            <section
              data-testid="header-currency-field"
              className="form-control"
            >
              Moeda: BRL
            </section>
          </div>
        </div>
      </header>
    );
  };

  navWallet = () => { // Barra de navegação do componente onde está as utilidades do site.
    const { coin } = this.props;
    const { value, method, tag, description, currency } = this.state;
    return (
      <form>
        <input
          data-testid="value-input"
          type="number"
          name="value"
          value={ value }
          onChange={ this.handleInfo }
          placeholder="Insira o valor da despesa"
        />
        <label name="coin" htmlFor="coin">
          Moeda:
          <select // Select para escolher as moedas.
            data-testid="currency-input"
            id="coin"
            name="currency"
            value={ currency }
            onChange={ this.handleInfo }
          >
            { // Tem loop automático para renderizar todos os dados do state.
              coin.map((coins, index) => (
                <option key={ index } value={ coins }>{ coins }</option>
              ))
            }
          </select>
        </label>
        <label name="method-payment" htmlFor="method-payment">
          Método de Pagamento:
          <select // Select para escolher metodo de pagamento.
            id="method-payment"
            data-testid="method-input"
            name="method"
            value={ method }
            onChange={ this.handleInfo }
          >
            { // Tem loop automático para renderizar todos os dados do state.
              paymentForm.map((type, index) => (
                <option key={ index } value={ type }>{ type }</option>
              ))
            }
          </select>
        </label>
        <label name="category" htmlFor="category">
          Tipo de Despesa:
          <select // Select para escolher tipo de despesa
            data-testid="tag-input"
            id="category"
            name="tag"
            value={ tag }
            onChange={ this.handleInfo }
          >
            { // Tem loop automático para renderizar todos os dados do state.
              categoryPayment.map((type, index) => (
                <option key={ index } value={ type }>{ type }</option>
              ))
            }
          </select>
        </label>
        <input
          data-testid="description-input"
          onChange={ this.handleInfo }
          name="description"
          value={ description }
          type="text"
          placeholder="Descrição da despesa"
        />
        <button
          type="button"
          onClick={ () => {
            this.SaveStateGlobal();
          } }
        >
          Adicionar Despesa
        </button>
      </form>
    );
  };

  SaveStateGlobal = async () => { // Função para salvar no estado global da aplicação
    const { coinEspReturn, expense } = this.props; // Invoca as 'funções' do dispatch do Redux
    const {
      id, value, method, tag, description, currency, exchangeRates,
    } = this.state;
    await expense({ // Espera passar os dados do estado para o Redux
      id, value, currency, method, tag, description, exchangeRates,
    });
    await coinEspReturn(currency); // Passa a moeda para a função que vai saber se existe e pegar os dados apenas dela
    this.setState({ value: 0, description: '' }, // Limpa os campos
    // Recebi como referência essa função do ID, do Guilherme Azevedo! xD
      () => this.setState((previousValue) => ({ id: previousValue.id + 1 }))); // Função conjunta para aumentar o valor do ID
  };

  totalCost = () => {
    const { wallet: { expenses } } = this.props; // Desestrutura o expenses.
    if (expenses.length) { // Caso o expenses não esteja vazio, entra no IF
      // Tive como referência essa função do reduce, do Danilo! xD
      return expenses.reduce((accumulator, currentValue) => { // Reduce para acumular todo o valor dos gastos
        const { value, currency, exchangeRates } = currentValue; // Desestrutura e deixa como valor novo no currentValue
        const soma = +value * +exchangeRates[currency].ask; // Fórmula para toda vez que o botão for apertado, rodar e atualizar o valor atual somando o antigo.
        accumulator += soma; // Soma o acumulado com o novo
        return accumulator;
      }, 0).toFixed(2); // toFixed serve para escolher a quantidade de casas decimais exibidas, nesse caso, apenas 2.
    }
    return 0; // Se o expenses estivar vazio, dá o valor 0;
  }

  handleInfo({ target }) { // Função para percorrer os inputs e salvar os dados no estado que mais tarde serão passados ao Redux.
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    // const { wallet: { expenses } } = this.props; // Desestrutura o expenses.
    return (
      <>
        {this.headerWallet()}
        {this.navWallet()}
        <ExpenseTable />
      </>
    );
  }
}

const mapStateToProps = (state) => ({ // mapStateToProps para puxar do estado Global os valores
  user: state.user.email,
  coin: state.wallet.currencies,
  wallet: state.wallet,
});

const mapDispatchToProps = (dispatch) => ({ // Dispatch da Wallet
  dispatchWalletUser: () => dispatch(coinApiReturnData()),
  coinEspReturn: (state) => dispatch(coinEspecificNewRequestAPI(state)),
  expense: (state) => dispatch(addExpenses(state)),
});

Wallet.propTypes = {
  email: propTypes.string,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
