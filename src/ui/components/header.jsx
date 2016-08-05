import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { requestCsrfToken, requestUser } from '../actions'

class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    config: PropTypes.object.isRequired,
    csrfToken: PropTypes.string,
    requestCsrfToken: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.requestCsrfToken()
    this.props.requestUser()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.user && !nextProps.user) {
      this.props.requestCsrfToken()
    }
  }

  render () {
    return (
      <div>
        <header role='banner'>
          <div>
            <Link className='logo' to='/'>David. <i className='fa fa-home' /></Link>
            <span>Watching your Node.js dependencies.</span>
            {this.props.user ? <SignedIn /> : <SignedOut {...this.props} />}
          </div>
        </header>
        <div id='sponsor-0' className='sponsor'>
          <div>
            Proudly sponsored by <a href='https://moonmail.io/?utm_source=david-dm&amp;utm_medium=cpc&amp;utm_campaign=home-header' target='_blank'>MoonMail</a>
          </div>
        </div>
        <div id='sponsor-1' className='sponsor'>
          <div>
            <a href='http://microapps.com/pages/were-hiring/' target='_blank'><img src='/img/logo-microapps.svg' alt='microapps' /></a> wants to hire you
          </div>
        </div>
      </div>
    )
  }
}

const SignedIn = () => (
  <a className='auth'>Signed in <i className='fa fa-github' /></a>
)

const SignedOut = ({ csrfToken, config }) => {
  if (!csrfToken) return null
  if (!config.github.oauth || !config.github.oauth.clientId) return null

  let githubUrl = `${config.github.protocol}://${config.github.host}`
  githubUrl += '/login/oauth/authorize'
  githubUrl += `?client_id=${config.github.oauth.clientId}`
  githubUrl += `&state=${csrfToken}`
  githubUrl += '&scope=repo,read:org,user:email'

  return (
    <a className='auth' href={githubUrl}>Sign in <i className='fa fa-github' /></a>
  )
}

const mapStateToProps = ({ user, config, csrfToken }) => ({ user, config, csrfToken })
const mapDispatchToProps = { requestCsrfToken, requestUser }

export default connect(mapStateToProps, mapDispatchToProps)(Header)
