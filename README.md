# Pupi


## Abstract
Pupi is a mobile app that empowers users to engage with their digestive health by tracking their excreta, namely stool and urine. The user can track the frequency and times of day that they use the restroom; record excreta characteristics like color, shape, or duration of time spent; and tag each restroom session with potential affecting factors. Additionally, they can gain further insight into their health by viewing charts that visualize key excreta characteristics along with health recommendations based on those charts.

Lily Takahari and Yu-Hsuan Liu originally created Pupi with its basic record and analysis features as a course project for Prof. Majid Sarrafzadeh and Prof. Ramin Ramezani’s CS 205 Health Analytics in Winter 2023. I have extended the project to make it a more complete software product by implementing the aforementioned factor-tagging ability along with adding the following features: a tag filter for the records and charts, side-by-side comparison of two tags in the charts, reminder notifications that are suggested to the user based on analysis results, and the ability to export data as a .csv file.

## Presentation Slides, Demo Videos, Report
- [Original project introduction and demo](https://docs.google.com/presentation/d/1P2yXFnlpq9aZl5t1_gkgj2-YyJRLRKgezUlgco0q6-U/edit?usp=sharing)
- [Extension demo videos](https://docs.google.com/presentation/d/1G8qtUlbi9TG6OBSvzTxevqhG-5_yusgcJt7FV9IPsjI/edit?usp=sharing)
- [Extension report](https://docs.google.com/document/d/1ZXIg2GwY16POl2dXhkNRYxneg-0glR187b_dvHpZqPo/edit?usp=sharing)

## Run the app (requires MacOS)
1. Set up the [React Native development environment](https://reactnative.dev/docs/environment-setup) with MacOS as development OS and iOS as target OS.
2. Download or clone this repo.
3. Open terminal/command prompt, enter the `pupi` folder.
4. Use the command `$npm install` to install all the needed packages for the application.
5. `cd ios; pod install`
6. `npm run ios` will start the app on Simulator.
