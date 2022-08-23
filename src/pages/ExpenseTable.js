import propTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class ExpenseTable extends React.Component {
  render() {
    const { expenses } = this.props; // Desestrutura o expenses.
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>
            {
              expenses.map((element) => (
                <tr key={ element.id }>
                  <td>{element.description}</td>
                  <td>{element.tag}</td>
                  <td>{element.method}</td>
                  <td>{parseFloat(element.value).toFixed(2)}</td>
                  <td>{element.exchangeRates[element.currency].name}</td>
                  <td>
                    {
                      parseFloat(element.exchangeRates[element.currency].ask).toFixed(2)
                    }
                  </td>
                  <td>
                    {
                      parseFloat(element.value)
                      * parseFloat(element.exchangeRates[element.currency].ask)
                    }
                  </td>
                  <td>Real</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

ExpenseTable.propTypes = {
  expenses: propTypes.arrayOf(propTypes.any).isRequired,
};

const mapStateToProps = (state) => ({ // mapStateToProps para puxar do estado Global os valores
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps, null)(ExpenseTable);
