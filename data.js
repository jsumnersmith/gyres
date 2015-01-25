/* ------------------------------------------------*/
// Projects Array (returned by /api/projects)
// Single Project (returned by /api/project/:id)
// Projects are stored individually in the DB.
/* ------------------------------------------------*/
projects: [
  {
    [id: [string], // The appropriate BC/GH id used for DB key(type+ID)
    type: [string], //BC vs GH
    title: [string],
    currentMilestone: {.
      title: [string],
      //description: string],
      dueDate: [date],
      progress: [number], //Number that takes completed-to-dos/total-to-dos
      todos: [
        {
          title: [string],
          dueDate: [date],
          complete: [boolean],
          user: [string] // An ID that calls the user from DB.
        }
      ],
      completedTodos: [
        {
          title: [string],
          dueDate: [date],
          complete: [boolean],
          user: [string] // An ID that calls the user from DB.
        }
      ]
    },
    completedMilestones: [
      {
        title: [string],
        dateCompleted: [date],
        //toDoCount: [number]
      }
    ],
    openMilestones: [
      {
        title: [string],
        dueDate: [date],
        //toDoCount: [number] // This is likely meaningless as most future to-do lists aren't populated
      }
    ]
  }
]

/* ------------------------------------------------*/
// Users Array (returned by /api/users)
// Single User (returned by /api/user/:id)
// Users are stored individually in the DB
/* ------------------------------------------------*/
users: [
  {
    id: [string], // likely composed of a concat of GH and BC user ID.
    userName: [string],
    avatar: {
      basecamp: [string], // URL string connecting to an avatar for BC
      github: [string], // URL string connecting to an avatar for GH
    }
  }
]
