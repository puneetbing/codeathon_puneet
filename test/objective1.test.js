const nock = require('nock')
const objective_one = require('../src/objective1')
const github = require('@octokit/rest')()


// prevent all network activity to ensure mocks are used
nock.disableNetConnect()


describe('objective_one', () => {
    test('it is a function', () => {
      expect(typeof objective_one).toBe('function')
    })


    //******************Incorrect deployment group present
    test('Incorrect deployment group present', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend\
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 \
      Collaborators: akash \
      Deployment Type: hiver'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Deployment group not present ',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)
      expect(mock.isDone()).toBe(false)
    })


    //******************No Deployment group name present
    test('No Deployment group name present', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend\
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 \
      Collaborators: akash '
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Deployment group not present ',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)
      expect(mock.isDone()).toBe(false)
    })


    //******************Collaborators not present
    test('Collaborators not present', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend\
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 '
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Collaborators not present ',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)
      expect(mock.isDone()).toBe(false)
    })



    //******************Incorrect JIRA Link
    test('Incorrect JIRA Link', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend\
      JIRA URL: https://www.w3schools.com \
      Collaborators: akash \
      Deployment Type: AppEngine'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Jira link not present',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)
      expect(mock.isDone()).toBe(false)
    })


    //******************No Things to be tested present
    test('No Things to be tested TEST', async () => {
      const context = buildContext()
      context.payload.pull_request.body = '\
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 \
      Collaborators: akash \
      Deployment Type: AppEngine'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Things to test not present ',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)
      expect(mock.isDone()).toBe(false)
    })

    //******************No JIRA LINK
    test('No JIRA LINK', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend \
      Collaborators: akash \
      Deployment Type: AppEngine'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/puneetbing',
        description: 'Jira link not present',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)

      expect(mock.isDone()).toBe(false)
    })

    //******************All passed
    test('All passed', async () => {
      const context = buildContext()
      context.payload.pull_request.body = 'Things to be tested:Backend \
      JIRA URL: https://hiverhq.atlassian.net/browse/ENGG-1194 \
      Collaborators: akash \
      Deployment Type: AppEngine'
      const expectedBody = {
        state: 'success',
        target_url: 'https://github.com/puneetbing',
        description: 'success',
        context: 'Pull Request Tests'
      }
  
      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
  
      await objective_one(context)
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