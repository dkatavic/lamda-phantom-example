# Info

This is AWS Lambda example that runs PhantomJS, makes screenshots of webpages and sends email report with attached screenshots

This script can login to FB and take screenshots while logged in

The app includes a PhantomJS binary (phantomjs) compiled for AWS Linux

Inspired by https://github.com/justengland/phantom-lambda-template

# Install

```
git clone git@github.com:dkatavic/lamda-phantom-example.git
```

# deploy

To deploy this package, you need to zip it and upload to AWS Lambda. I would suggest using https://www.npmjs.com/package/node-lambda for deploying

Zip it:

```node-lambda package -p "../"```

Upload to S3:


```s3-cli put ../PackageName.zip s3://lamda-phantom/PackageName.zip```


### Config

All configs are in config.js file
