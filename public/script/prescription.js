
var namespan=document.querySelector('#Pname');
var ageandsex = document.querySelector('#ageandsex');
var date = document.querySelector('#date');
var symptomsthis = document.querySelector('#symptoms');
var diagnosisthis = document.querySelector('#diagnosis');
var prescriptionthis = document.querySelector('#prescription');
var advicethis=document.querySelector('#advice');
var Dname=document.querySelector('#Dname');
var Ldegree=document.querySelector('#Ldegree');
var symptomvar=1;
var diagnosisvar=1;
var prescriptionvar=1;
var advicevar=1;
// var dataseting = document.querySelector("#divtemp");
// var str="";
// for(var i=0;i<nameofperson.length;i++)
//    str+=nameofperson[i];

// dataseting.textContent=str;

var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
date.textContent =utc;

 var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
 var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

 var grammar = '#JSGF V1.0;'

 var recognition = new SpeechRecognition();
 var speechRecognitionList = new SpeechGrammarList();
 speechRecognitionList.addFromString(grammar, 1);
 recognition.grammars = speechRecognitionList;
 recognition.lang = 'en-US';
 recognition.interimResults = false;

 recognition.onresult = function (event) {
     var last = event.results.length - 1;
     var command = event.results[last][0].transcript;
     console.log(command);
    //  message.textContent = 'Voice Input: ' + command + '.';

    var commandtest = command.toLowerCase();
    var yearbool=true;
    if (commandtest.indexOf('dr') != -1 || commandtest.indexOf('dr.') != -1||commandtest.indexOf('doctor')!=-1){
        
        var indexofdr=commandtest.indexOf('doctor');
        if(indexofdr!=-1)
        {
            Dname.textContent = "Dr."+command.slice(indexofdr+6,command.length);
        }
        else{
            Dname.textContent = command;
        }
    }
    else if(commandtest.indexOf('delete')!=-1||commandtest.indexOf('remove')!=-1){
        var index1 = numToDigit(commandtest);
        // console.log("index is "+index1);
        if(commandtest.indexOf('symptoms')!=-1||commandtest.indexOf('symptom')!=-1){
            deletefromlist(symptomsthis,index1);
        }
        if (commandtest.indexOf('diagnosis') != -1 || commandtest.indexOf('diagnose') != -1) {
            deletefromlist(diagnosisthis, index1);
        }
        if (commandtest.indexOf('prescriptions') != -1 || commandtest.indexOf('prescription') != -1) {
            deletefromlist(prescriptionthis, index1);
        }
        if (commandtest.indexOf('advices') != -1 || commandtest.indexOf('advice') != -1) {
            deletefromlist(advicethis, index1);
        }
    }
    else if (commandtest.indexOf('replace') != -1 || commandtest.indexOf('rewrite') != -1){
         var index1 = numToDigit(commandtest);
         // console.log("index is "+index1);
         var position=commandtest.indexOf('with');
        //  console.log(position);
         
         var data=command.slice(position+4,command.length);
         console.log(data);
         
         if (commandtest.indexOf('symptoms') != -1 || commandtest.indexOf('symptom') != -1) {
             replaceinlist(symptomsthis, index1,data);
         }
         if (commandtest.indexOf('diagnosis') != -1 || commandtest.indexOf('diagnose') != -1) {
             replaceinlist(diagnosisthis, index1,data);
         }
         if (commandtest.indexOf('prescriptions') != -1 || commandtest.indexOf('prescription') != -1) {
             replaceinlist(prescriptionthis, index1,data);
         }
         if (commandtest.indexOf('advices') != -1 || commandtest.indexOf('advice') != -1) {
             replaceinlist(advicethis, index1,data);
         }
    }
    else{
    if (commandtest.indexOf('years')!=-1 || commandtest.indexOf('year')!=-1){
        ageandsex.textContent=command;
        yearbool=false;
    }

    var namebool=true,symptomsbool=true,diagnosisbool=true,prescriptionbool=true;
    if(yearbool)
    for(var i=0;i<nameofperson.length;i++){
        if ((commandtest.indexOf(nameofperson[i]))!=-1){
            namespan.textContent=command;
            namebool=false;
            break;
        }
    }
    if(yearbool&&namebool){
        for(var i=0;i<symptoms.length;i++){
            if(commandtest.indexOf(symptoms[i])!=-1){
                createAndAttach(symptomsthis,command);
                symptomsbool=false;
                break;
            }
        }
    }
    if(yearbool&&yearbool&&namebool&&symptomsbool){
        for(var i=0;i<diagnosis.length;i++){
            if(commandtest.indexOf(diagnosis[i])!=-1)
            {
                createAndAttach(diagnosisthis,command);
                diagnosisbool=false;
                break;
            }
        }
    }
    if(yearbool&&namebool&&symptomsbool&&diagnosisbool){
        for(var i=0;i<prescription.length;i++){
            if(commandtest.indexOf(prescription[i])!=-1){
                createAndAttach(prescriptionthis, command);
                prescriptionbool = false;
                break;
            }
        }
    }
    var degreebool=true;
    if (yearbool && namebool && symptomsbool && diagnosisbool && prescriptionbool){
        for(var i=0;i<degree.length;i++){
            if(commandtest.indexOf(degree[i])!=-1){
                Ldegree.textContent=command;
                degreebool=false;
                break;
            }
        }
    }

    if (yearbool&&namebool && symptomsbool && diagnosisbool&&prescriptionbool&&degreebool){
        if(commandtest.length>15)
        {
            createAndAttach(advicethis,command);
        }
    }

    }
    setAllData();
    
 };

    recognition.onspeechend = function () {
        recognition.stop();
    };

    recognition.onerror = function (event) {
        message.textContent = 'Error occurred in recognition: ' + event.error;
    }

    document.querySelector('#buttontospeak').addEventListener('click', function () {
        recognition.start();

    });




function createAndAttach(listname,data){
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(data));
    switch(listname){
        case symptomsthis:
            entry.setAttribute('id', 'symptom' + symptomvar);
            entry.setAttribute('class','symptom4');
            symptomvar=symptomvar+1;
            break;
        case diagnosisthis:
            entry.setAttribute('id', 'diagnosis' + diagnosisvar);
            entry.setAttribute('class', 'diagnosis4');
            diagnosisvar=diagnosisvar+1;
            break;
        case prescriptionthis:
            entry.setAttribute('id', 'prescription' + prescriptionvar);
            entry.setAttribute('class', 'prescription4');
            prescriptionvar=prescriptionvar+1;
            break;
        case advicethis:
            entry.setAttribute('id', 'advice' + advicevar);
            entry.setAttribute('class', 'advice4');
            advicevar=advicevar+1
        
    }
    listname.appendChild(entry);
}

function deletefromlist(listname,index){
    switch (listname) {
        case symptomsthis:
            listname.removeChild(document.querySelector('#symptom'+index));
            break;
        case diagnosisthis:
            listname.removeChild(document.querySelector('#diagnosis' + index));
            break;
        case prescriptionthis:
            listname.removeChild(document.querySelector('#prescription' + index));
            break;
        case advicethis:
            listname.removeChild(document.querySelector('#advice' + index));

    }
}

function replaceinlist(listname,index,data){
    switch (listname) {
        case symptomsthis:
            document.querySelector('#symptom' + index).textContent=data;
            break;
        case diagnosisthis:
            document.querySelector('#diagnosis' + index).textContent=data;
            break;
        case prescriptionthis:
            document.querySelector('#prescription' + index).textContent=data
            break;
        case advicethis:
            document.querySelector('#advice' + index).textContent=data;

    }
}

function numToDigit(commandtest){
    if(commandtest.indexOf('first')!=-1)
        return 1;
    if (commandtest.indexOf('second') != -1)
        return 2;
    if (commandtest.indexOf('third') != -1)
        return 3;
    if (commandtest.indexOf('fourth') != -1)
        return 4;
    if (commandtest.indexOf('fifth') != -1)
        return 5;
    if (commandtest.indexOf('sixth') != -1)
        return 6;
    if (commandtest.indexOf('seventh') != -1)
        return 7;
    if (commandtest.indexOf('eight') != -1)
        return 8;
    if (commandtest.indexOf('ninth') != -1)
        return 9;
    return 0;
}

function setAllData(){
    var docname=document.querySelector('#docname1');
    var degree1=document.querySelector('#degree1');
    var patname = document.querySelector('#patname1');
    var agepat = document.querySelector('#age1');
    var date1 = document.querySelector('#date1');
    var symptom1 = document.querySelector('#spt');
    var diagnosis1 = document.querySelector('#dpt');
    var prescription1 = document.querySelector('#ppt');
    var advice1 = document.querySelector('#apt');
    docname.value=Dname.textContent;
    degree1.value=Ldegree.textContent;
    patname.value=namespan.textContent;
    agepat.value=ageandsex.textContent;
    date1.value=date.value;
    var symptom2=document.getElementsByClassName('symptom4');
    var diagnose2 = document.getElementsByClassName('diagnosis4');
    var prescription2 = document.getElementsByClassName('prescription4');
    var advice2 = document.getElementsByClassName('advice4');
    symptom1.value="";
    diagnosis1.value="";
    prescription1.value="";
    advice1.value="";
    for(var i=0;i<symptom2.length;i++){
        symptom1.value = symptom1.value + '*' + symptom2[i].textContent;
    }
    for (var i = 0; i <diagnose2.length ; i++) {
        diagnosis1.value = diagnosis1.value + '*' + diagnose2[i].textContent;
    }
    for (var i = 0; i < prescription2.length; i++) {
        prescription1.value = prescription1.value + '*' + prescription2[i].textContent;
    }
    for (var i = 0; i <advice2.length; i++) {
        advice1.value = advice1.value + '*' + advice2[i].textContent;
    }
    
}
