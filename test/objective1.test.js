const nock = require('nock')
const objective_one = require('../src/objective1')
const github = require('@octokit/rest')()


// prevent all network activity to ensure mocks are used
nock.disableNetConnect()


describe('objective_one', () => {
    test('it is a function', () => {
      expect(typeof objective_one).toBe('function')
    })
  
    test('success for prequests before making a PR', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend \
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 \
      Collaborators: akash \
      Deployment Type: AppEngine'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Success',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(false)
    })
  
    test('failure for prequests before making a PR', async () => {
      const context = buildContext()
      context.payload.pull_request.body = '\
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 \
      Collaborators: akash \
      Deployment Type: appEngine'
      const expectedBody = {
        state: 'success',
        target_url: 'https://github.com/puneetbing',
        description: 'Things to test not present ',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(false)
    })
  })
  
  function buildContext (overrides) {
    const defaults = {
      log: () => { /* no-op */ },
  
      // an instantiated GitHub client like the one probot provides
      github: github,
  
      // context.repo() is a probot convenience function
      repo: (obj = {}) => {
        return Object.assign({ owner: 'sally', repo: 'project-x' }, obj)
      },
  
      payload: {
        pull_request: {
          number: 123,
          title: 'do a thing',
          head: {
            sha: 'abcdefg'
          }
        }
      }
    }
  
    return Object.assign({}, defaults, overrides)
  }
  
  function unsemanticCommits () {
    return [
      { commit: { message: 'fix something' } },
      { commit: { message: 'fix something else' } }
    ]
  }