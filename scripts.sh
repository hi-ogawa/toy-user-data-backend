#!/bin/bash

case $1 in
  dev-bash)
    docker-compose up -d node_dev postgres_dev
    docker-compose exec node_dev bash
  ;;
  dev-npm)
    shift
    docker-compose up -d node_dev postgres_dev
    docker-compose exec node_dev npm "${@}"
  ;;
  dev)
    docker-compose up -d node_dev postgres_dev
    docker-compose exec node_dev npm run start:watch:debug:docker
  ;;
  test)
    shift
    docker-compose up -d node_dev postgres_dev
    docker-compose exec node_dev npm run test:docker -- "${@}"
  ;;
  heroku-db)
    shift
    HEROKU_APP_NAME="yt-offline-db-0283"
    case $1 in
      setup)
        heroku apps:create "${HEROKU_APP_NAME}" &&\
        heroku addons:create --app="${HEROKU_APP_NAME}" heroku-postgresql
      ;;
      cleanup)
        heroku apps:destroy "${HEROKU_APP_NAME}"
      ;;
      check-connection)
        export DATABASE_URL=$(bash scripts.sh heroku-db url) DATABASE_SSL=true
        docker-compose run --rm node_dev npm run db -- checkConnection
      ;;
      migrate)
        export DATABASE_URL=$(bash scripts.sh heroku-db url) DATABASE_SSL=true
        docker-compose run --rm node_dev npm run db -- createTables
      ;;
      connect)
        export DATABASE_URL=$(bash scripts.sh heroku-db url) DATABASE_SSL=true
        docker-compose run --rm node_dev npm run console
      ;;
      info)
        heroku pg:info --app="${HEROKU_APP_NAME}"
      ;;
      url)
        heroku config --app="${HEROKU_APP_NAME}" --json | jq -r '.DATABASE_URL'
      ;;
      *) echo ":: Command [$@] not found." ;;
    esac
  ;;
  *) echo ":: Command [$@] not found." ;;
esac
