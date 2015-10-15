import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setEmail, setPassword, signIn } as signInActions from 'redux/modules/signInActions';

@connect(
  state => {
    return {
      email: state.signIn.email,
      password: state.signIn.password,
      isSigningIn: state.signIn.isSigningIn
    };
  },
  {
    setEmail: signInActions.setEmail,
    setPassword: signInActions.setPassword,
    signIn: signInActions.signIn
  }
)
export default class SignIn extends Component {
  static propTypes = {
    setEmail: propTypes.func.isRequired,
    setPassword: propTypes.func.isRequired,
    signIn: PropTypes.func.isRequired
  }

  handleChangeEmail = (event) => {
    const { setEmail } = this.props;
    setEmail(event.target.value);
  }

  handleChangePassword = (event) => {
    const { setPassword } = this.props;
    setPassword(event.target.value);
  }

  handleClickSubmit = (event) => {
    event.preventDefault();
    const { signIn, email, password } = this.props;
    signIn(email, password);
  }

  render() {
    const styles = require('./SignIn.scss');
    const { email, password, isSigningIn } = this.props;
    return (
      <div className={styles.signIn}>
        <h2>Sign In</h2>
        <form>
          <div>
            <input type="text" placeholder="Email" value={email} onChange={this.handleChangeEmail} />
          </div>
          <div>
            <input type="password" placeholder="Password" value={password} onChange={this.handleChangePassword} />
          </div>
          <div>
            <button type="submit" onClick={this.handleClickSubmit} disabled={isSigningIn}>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
