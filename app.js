require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require('ejs');
const multer =require('multer');
const path = require('path');
const nodemailer=require('nodemailer');
const firebase =require('firebase');



 var firebaseConfig = {
     apiKey: "AIzaSyBD5rbTPGCg2KSI_BTdO5p4IssW8JhNwr8",
     authDomain: "trialsih.firebaseapp.com",
     databaseURL: "https://trialsih.firebaseio.com",
     projectId: "trialsih",
     storageBucket: "trialsih.appspot.com",
     messagingSenderId: "703993460993",
     appId: "1:703993460993:web:4800ad93859442ff3f8300"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);


const app = express();



// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "12345",
//     database: "sihdataset"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     con.query("SELECT * FROM datasets", function (err, result, fields) {
//         if (err) throw err;
//         for(var i=0;i<result.length;i++)
//         {
//             datacheck.nameofperson.push(result[i].nameofpat);
//             // console.log(result[i].nameofpat+" "+result[i].symptoms+" "+result[i].diagnosis);
            
           
//         }
//     });
// });



var file1;
var nameofdoc;
//Required package
var pdf = require("pdf-creator-node");
var fs = require('fs');

// Read HTML Template
var html = fs.readFileSync('kkj.html', 'utf8');

var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",

          // Rendering options
            "base": "file:///F:/AtomWebFolder/SIHmedPres" ,
          // Zooming option, can be used to scale images if `options.type` is not pdf
          "zoomFactor": "1", // default is 1

          // File options
          "type": "pdf", // allowed file types: png, jpeg, pdf
          "quality": "75",

        };

/**********************Creating Storage**************************/
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './Images/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

/**********************************************************************/






app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/',function(req,res){
    res.render('prescription');
});

app.post('/',(req, res) =>{
        
     upload(req, res, (err) => {
         if (err) {
             
         } else{
         if (req.file == undefined) {
                console.log("File not found");       
            } 
        else {
                 
       

    nameofdoc = req.body.docname1;
    var degree1 = req.body.degree1;
    var nameofpat = req.body.patname1;
    var age=req.body.age1;
    var date = req.body.date1;
    var symptom = req.body.symptoms1;
    var diagnosis=req.body.diagnosis1;
    var prescription=req.body.prescription1;
    var advice=req.body.advice1;
    var symptomarr = symptom.split("*");
    var diagnosisarr=diagnosis.split("*");
    var prescriptionarr=prescription.split("*");
    var advicearr=advice.split("*");

    var symptomarr1=new Array();
    for(var i=1;i<symptomarr.length;i++){
        symptomarr1.push(symptomarr[i]);
    }

    var diagnosisarr1 = new Array();
    for (var i = 1; i < diagnosisarr.length; i++) {
        diagnosisarr1.push(diagnosisarr[i]);
    }
    var prescriptionarr1 = new Array();
    for (var i = 1; i < prescriptionarr.length; i++) {
        prescriptionarr1.push(prescriptionarr[i]);
    }
    var advicearr1 = new Array();
    for (var i = 1; i < advicearr.length; i++) {
        advicearr1.push(advicearr[i]);
    }
    
    var patientname=new Array();
    patientname.push(nameofpat);
    var doctorname = new Array();
    doctorname.push(nameofdoc);
    var degree = new Array();
    degree.push(degree1);
    var age2 = new Array();
    age2.push(age);
    var imgsrc=new Array();
    imgsrc.push("file:///F:/AtomWebFolder/SIHmedPres/Images/myImage.jpg");
    var date2 = new Array();
    date2.push(new Date().toJSON().slice(0, 10).replace(/-/g, '/'));
    var document = {
        html: html,
        data: {
            Symptoms:symptomarr1,
            Diagnosis: diagnosisarr1,
            Prescriptions:prescriptionarr1,
            Advices:advicearr1,
            patientname: patientname,
            doctorname:doctorname,
            degree:degree,
            age:age2,
            date:date2,
            imgsrc:imgsrc
        },
        path: "./pdfs/output.pdf"
    };


    pdf.create(document, options)
        .then(res1 => {
            console.log(res1);
            res.render('pdfPreview', { pdfsrc: "./pdfs/output.pdf" });
        })
        .catch(error => {
            console.error(error)
        });
    }
    }
    });
});

app.get('/edit',function(req,res){
    res.render('editpres');
});

app.get('/kkj',function(req,res){
    res.sendFile(__dirname+"/kkj.html");
});

app.get('/frame',function(req,res){
    res.render('framesend');
});

app.get('/pdfs',function(req,res){
    res.sendFile(__dirname +"/pdfs/output.pdf");
});

app.post('/sendEmail',function(req,res){
    var personEmail=req.body.email;
    //pdf file are in pdfs folder and person email is the mail to send
    //Step 1
let transporter=nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
);

//Step 2
let mailOptions={
    from:'bytpphyte@gmail.com',
    to:personEmail,
    cc:'bytpphyte@gmail.com',
    subject:'Regarding Registration as assured doctor in PRANKS',
    text:'This is your Prescription for the appointment with '+nameofdoc,
    attachments: [
        {
            filename:'output.pdf',
            path:'./pdfs/output.pdf'
        }
    ]
}

//Step 3
transporter.sendMail(mailOptions,function(err,data){
    if(err){
        console.log("Error Occurs"+err);
    }
    else{
        console.log("Email Sent!!!");
    }
});
    
    console.log(personEmail);
    res.redirect('edit');
});




app.post('/signup',function(req,res){

    var ureg = req.body.username;
    var otp=req.body.otp;
    var password=req.body.password;

    firebase.database().ref('otps/').once('value').then(function (snapshot) {
        var otpcome = (snapshot.val().ureg) || 'Anonymous';
        if(otp===otpcome){

        }
    });

    firebase.database().ref('doctors/' + regno).set(
        OtpString,
        function (error) {}

        );
});



app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000.");
});