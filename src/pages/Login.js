import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setUserEmail } from '../actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
    this.handleInfo = this.handleInfo.bind(this);
  }

  inputForm = () => {
    const { dispatchUserEmail, history } = this.props;
    const { email, password } = this.state;
    return (
      <form className="mb-3 row">
        <input
          data-testid="email-input"
          label="email: "
          type="text"
          onChange={ this.handleInfo }
          value={ email }
          name="email"
          required
          className="form-label"
        />
        <input
          data-testid="password-input"
          label="Password: "
          type="password"
          onChange={ this.handleInfo }
          value={ password }
          name="password"
          required
          className="form-label"
        />
        <button
          type="button"
          label="Enviar"
          disabled={ this.validateEmail() }
          onClick={ () => {
            dispatchUserEmail(email); // Passei ela aqui como função pegando os estados como parâmetro para salvar
            history.push('/carteira'); // Em seguida redirecionar para página da carteira
          } }
          className="btn btn-primary mb-3"
        >
          Entrar
        </button>
      </form>
    );
  };

  handleInfo({ target }) {
    const { name, value } = target;
    this.setState(
      {
        [name]: value,
      },
    );
  }
  // Fonte do regex https://www.horadecodar.com.br/2020/09/13/como-validar-email-com-javascript/

  validateEmail() {
    const { email, password } = this.state;
    const valueComparationPassword = 6;
    const re = /\S+@\S+\.\S+/;
    if (re.test(email) && password.length >= valueComparationPassword) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        { this.inputForm() }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({ // dispatch do User
  dispatchUserEmail: (userEmail) => dispatch(setUserEmail(userEmail)),
});

Login.propTypes = {
  dispatchUserEmail: PropTypes.func,
}.isRequired;

export default connect(null, mapDispatchToProps)(Login);
