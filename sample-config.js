module.exports = {
  dbName: "gyres",
  credentials: {
    basecamp: {
      url: "https://your-name.basecamphq.com",
      token: "your-basecamp-classic-token-id"
    },
    github: {
      token: "your-github-token-id"
    }
  },
  projects: [
    {
      title: "Sample Basecamp Project",
      type: "basecamp",
      id: "123456789"
    },
    {
      title: "Sample Github Project",
      type: "github",
      repo: "repo-name"
    }
  ]
};
