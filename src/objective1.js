module.exports = checkJira

async function checkJira (context, config) {
  const prDescription = context.payload.pull_request.body
  const head = context.payload.pull_request.head
  // console.log("~~~~~~>>>>>>>",prDescription)
  const collabCheck = prDescription.match(/Collaborators:\s?(\w,?)+/g)
  const deployCheck = prDescription.match(/Deployment Type:\s?(AppEngine| Engine|AppExtension|Extension)/g)
  const jiraCheck = prDescription.match(/JIRA URL:\s?https:\/\/hiverhq\.atlassian\.net\/browse\/ENGG-\d+/)
  const thingsToTest = prDescription.match(/Things to be tested:\s?.+/g)
  // const jiraCheck = prDescription.includes("Collaborators: (AppEngine| Engine|AppExtension|Extension)")
  let willMerge = true;

  // console.log("~~~~~~>>>>>>>",collabCheck);
  // console.log("~~~~~~>>>>>>>",deployCheck);
  // console.log("~~~~~~>>>>>>>",jiraCheck);
  // console.log("~~~~~~>>>>>>>",thingsToTest);
  let botDescription = "success";

  if(!deployCheck) {
    willMerge = false;
    botDescription = "Deployment group not present " 
  }
  if(!collabCheck) {
    willMerge = false;
    botDescription = "Collaborators not present " 
  }
  if(!jiraCheck) {
    willMerge = false;
    botDescription = "Jira link not present" 
  }
  if(!thingsToTest) {
    willMerge = false;
    botDescription = "Things to test not present " 
  }
 // if()
  const state = willMerge ? 'success' : 'pending'

  const status = {
    sha: head.sha,
    state,
    target_url: 'https://github.com/puneetbing',
    description: botDescription,
    context: 'Pull Request Tests'
  }

  const result = await context.github.repos.createStatus(context.repo(status))
  return result
}
