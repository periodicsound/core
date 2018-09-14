/*
 * This file is part of Glugox.
 *
 * (c) Glugox <glugox@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { getCurrentUserInfo } from '../store/action-creators/session'

export class AuthGuardComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentWillMount () {
    const { authOrRedirect, currentUserId } = this.props

    if (!currentUserId) {
      authOrRedirect()
        .then((response) => {
          if (response && response.status === 200) {
            this.setState({
              loading: false
            })
          }
        })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  render () {
    const { children } = this.props
    const { loading } = this.state

    if (loading) {
      return (
        <div className="flex h-screen items-center">
          <div className="w-screen text-3xl text-center text-grey">Loading...</div>
        </div>
      )
    }

    return (
      <div>{children}</div>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUserId: state.session.currentUser
})

const mapDispatchToProps = (dispatch) => ({
  authOrRedirect: () => {
    return dispatch(getCurrentUserInfo())
      .catch(() => {
        dispatch(replace('/login'))
      })
  }
})

export const AuthGuard = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthGuardComponent)
