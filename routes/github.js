// // Gtihub specific stuff
// var Github = require('github');
// var github = new Github({
//     // required
//     version: "3.0.0",
//     // optional
//     //pathPrefix: "/api/v3", // for some GHEs
//     //timeout: 5000
// });

// github.authenticate({
//   type: "oauth",
//   token: "8b42bb0003be037e097ddaf19c6cf2755ca24e20",
// });


// github.repos.getCommits({user:"punkave", repo: "fandm"}, function(err, commits){
//   if (err) {
//     console.log("Oops. Couldn't get the comments");
//     console.log(err);
//   } else {
//     console.log("New Comments");
//     _.each(commits, function(item){
//       console.log(item.commit.message + " by " + item.committer.login);
//     });
//   }
// });

// mainRepo.show(function(err, repo) {
//   if (err) {
//     console.log("Oops. That repo is busted.");
//     console.log(err);
//   }
//   console.log(repo);
// });
