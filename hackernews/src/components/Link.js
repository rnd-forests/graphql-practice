import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate } from '../helpers'

class Link extends Component {
  render() {
    const authToken = true // temp

    return (
      <div className="flex items-start mb-2">
        <div className="flex items-center">
          <span className="text-black">{this.props.index + 1}.</span>
          {authToken && (
            <div
              className="ml-1 mr-2 text-black text-xs"
              onClick={() => this._voteForLink()}
            >
              ▲
            </div>
          )}
        </div>
        <div>
          {this.props.link.description} ({this.props.link.url})
          <div className="text-grey-darker text-xs">
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id
    await this.props.voteMutation({
      variables: {
        linkId
      },
      update: (store, { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, vote, linkId)
      }
    })
  }
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default graphql(VOTE_MUTATION, { name: 'voteMutation' })(Link)
