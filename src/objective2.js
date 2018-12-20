module.exports = objective2

async function objective2 (context, config) {
  const pr_description = context.payload.pull_request.body
  const head = context.payload.pull_request.head
  // console.log("~~~~~~>>>>>>>",pr_description)
  const collabCheck = pr_description.match(/Collaborators:\s?(\w,?)+/g)
  const deployCheck = pr_description.match(/Deployment Type:\s?(AppEngine| Engine|AppExtension|Extension)/g)
  const jiraCheck = pr_description.match(/JIRA URL:\s?https:\/\/hiverhq\.atlassian\.net\/browse\/ENGG-\d+/)
  const thingsToTest = pr_description.match(/Things to be tested:\s?.+/g)
  // const jiraCheck = pr_description.includes("Collaborators: (AppEngine| Engine|AppExtension|Extension)")
  let willMerge = true;

  // console.log("~~~~~~>>>>>>>",collabCheck);
  // console.log("~~~~~~>>>>>>>",deployCheck);
  // console.log("~~~~~~>>>>>>>",jiraCheck);
  // console.log("~~~~~~>>>>>>>",thingsToTest);
  let bot_description = "";

  if(!deployCheck) {
    willMerge = false;
    bot_description = "Deployment group not present " 
  }
  if(!collabCheck) {
    willMerge = false;
    bot_description = "Collaborators not present " 
  }
  if(!jiraCheck) {
    willMerge = false;
    bot_description = "Jira link not present" 
  }
  if(!thingsToTest) {
    willMerge = false;
    bot_description = "Things to test not present " 
  }
 // if()
  const state = willMerge ? 'success' : 'pending'

  const status = {
    sha: head.sha,
    state,
    target_url: 'https://github.com/puneetbing',
    description: bot_description,
    context: 'Pull Request Tests'
  }

  const result = await context.github.repos.createStatus(context.repo(status))
  return result
}
