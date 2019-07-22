const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require ('cors')
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const PORT = 4000;
const blogRoutes = express.Router();
let Blog = require('./blog_model')
let User = require('./user_model');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(bodyParser.json({limit: '500mb'}));


mongoose.connect("mongodb://root:root@localhost:27017/blog?authSource=admin", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

blogRoutes.route('/log').post(function (req, res){
    console.log(req.query);
    let username = req.query.username;
    let pw = req.query.password;
    User.findOne({username: username, password: pw}).then( doc => {
      if(doc){
          console.log(doc)
          res.status(200).json({"creditentials": true, "level": doc.level})
      }else(res.status(404).json({"creditentials": false}))
    }).catch(err => {
        console.log("Error : ", err);
    });
})

blogRoutes.route('/add').post(function(req, res) {
    console.log('hmm');
    let todo = new Blog(req.query);
    console.log('----------');
    console.log(todo)
    let title = req.query.post_title;
    todo.save()
        .then(async todo => {
            res.status(200).json({'todo': 'todo added successfully'});
            //sending mails
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing

            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass // generated ethereal password
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Philippe Duval" <foo@example.com>', // sender address
                to: "bar@example.com, baz@example.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "My blog has just been updated ! Come check out my latest post <b>" + title + "</b> !" // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
            console.log(err);
        });
});


blogRoutes.route('/getPost').post(function(req, res)
{
    console.log(req.query)
    Blog.find({_id: req.query._id}).exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json({doc});
        })
        .catch(err => {
            console.log(err)
        })

});

blogRoutes.route('/getPosts').get(function(req, res)
{
    Blog.find().sort({post_date: -1}).exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json({doc});

        })
        .catch(err => {
            console.log(err)
        })

});

blogRoutes.route('/deletePost').post(function(req, res)
{
    Blog.deleteOne({_id: req.query._id}).exec()
        .then((_) => {
            res.status(200).json({"Del msg":"document " + req.query.post_title + " has been deleted"});

        })
        .catch(err => {
            console.log(err)
        })

});

app.use('/blog', blogRoutes);

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    console.log('erreur - headers', req.headers)
    console.log('erreur - url', req.url)
    console.log('erreur - baseUrl', req.baseUrl)
    console.log('erreur - method', req.method)
    console.log('erreur - body', req.body)
    console.log(err)
    console.log(err.message)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, (_) => {
    console.log('Server is running on Port: ' + PORT);
});
