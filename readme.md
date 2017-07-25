# Cloudsound Studio

A real-time, collaborative music making experience in the cloud. Users work together to interact with audio files via the Web Audio API to make their own mixes using a virtual studio.

## Getting Started

Fork and clone this repo, run `yarn install` to install the dependencies, then run `npm start` to spin up the server and allow you to use the app on a `localhost` port. To run a development server, run `npm run dev` and any changes you make to the server or client files will be automatically updated.

### Prerequisites

Cloudsound Studio currently streams the audio files from an Amazon S3 bucket.  To change the source of streaming audio you will need to edit the `baseUrl` within `public/app/studio/studio-service.js`. Also note that the current string manipulation code depends on the S3 bucket having a `:baseUrl/:category/:filename` format. For example: `s3-bucket-name/drums/bonham-drum-beat.mp3`.

## Deployment

This app is currently deployed on Heroku. To deploy, run:
```
$ git commit -m 'prep for deployment'
$ heroku create
$ git push heroku master
```

## Built With

* [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - All audio processing and visualizations
* [Socket.io](https://socket.io/) - For real-time communication
* [AngularJS v1.6](https://angularjs.org/) - Front end framework
* [Node.js/Express](https://expressjs.com/) - Lightweight server for handling web socket connections
* [Bulma.io](http://bulma.io/) - A modern CSS framework based on Flexbox
* [AWS S3](https://aws.amazon.com/s3/?nc2=h_l3_sc) - For hosting audio files


## Contributing

Fork and clone the [repo](https://github.com/mcdermz/cloudsound-studios) and make a pull request. That's it!


## Authors

* **[Sean McDermott](https://github.com/mcdermz)** - *Initial work and concept*


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* The developers at W3C who build and maintain the amazing Web Audio API
* Thanks to Wes, Derek, and all the other instructors at Galvanize Seattle
