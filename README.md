![Gyres](https://raw.githubusercontent.com/jsumnersmith/gyres/master/public/images/gyres.png 'Gyres Logo')
=================
> _THE GYRES! the gyres! Old Rocky Face, look forth; <br />
> Things thought too long can be no longer thought, <br />
> For beauty dies of beauty, worth of worth, <br />
> And ancient lineaments are blotted out._ <br />
> "The Gyres" W. B. Yeats


**Gyres** [jahy&middot;_uh_rs] is a basic tool to help you make sense of your next iteration milestone from either Basecamp Classic or Github.

# Early Alpha: Currently supports only Basecamp Classic

## Download and Install
1. Check out the project`$ git clone https://github.com/punkave/gyres.git project-name`
2. Run: <code>$ npm install</code>
3. Start up the app: `$ npm run`(or run your own process).

## Configuration
Create your own config.js using our sample-config.js: `$ cp sample-config.js config.js`

## Basecamp
One of Gyres' opinions revolves around milestone-driven iterations.
When using Basecamp Classic, then, it's important to structure your Basecamp projects to work with Gyres.

Importantly, you must create miletstones (in the future) with an associated to-do list.
Gyres looks for the next upcoming milestone (including today) and grabs the to-dos associated with it.
Without the appropriate Basecamp hygiene, Gyres will simply come up empty.

For more information about associating to-dos with milestones, see [this help article](https://help.37signals.com/basecamp/questions/223-what-does-it-mean-to-relate-a-to-do-list-to-a-milestone).

## To-Do
All to-dos for this project are kept in the issues with the tag "project."
