module.exports = checkJira

async function checkJira (context, config) {
  const { pr_description, head } = context.payload.description
  // console.log("~~~~~~>>>>>>>",context)
  const collabCheck = pr_description.includes("Collaborators:")
  const deployCheck = pr_description.includes("Deployment Type:")
  const collabCheck = pr_description.includes("Collaborators: ")
  const jiraCheck = pr_description.includes("Collaborators: ")
  const state = wipPresent ? 'pending' : 'success'

  const status = {
    sha: head.sha,
    state,
    target_url: 'https://github.com/puneetbing',
    description: 'WIP present check',
    context: 'Pull Request Tests'
  }

  const result = await context.github.repos.createStatus(context.repo(status))
  return result
}
