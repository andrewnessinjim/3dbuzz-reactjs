# Cards Against Humanity Clone
Application developed as part of "Production Ready Apps ReactJS" course. It's hosted for free at [https://archive.org/download/3dbuzz-archive](https://archive.org/download/3dbuzz-archive).

## Differences from original course
The course is outdated when it comes to dependencies and build system. However, there was still a lot to learn from it, especially in terms of code organization. All the dependencies have been updated where possible and the build system is improved using tools such as browserslistrc and webpack-merge. Babel and webpack configurations are also improved and simpler now. I used Typescript instead of JavaScript to make understanding the code easier.

## Running locally
1. Run `npm install` in the project root.
2. Run `gulp dev` in the project root.

The server should come up at http://localhost:3000

You can also just run `docker-compose up` to have the application running at http://localhost:3000, if you have docker and docker compose installed. 