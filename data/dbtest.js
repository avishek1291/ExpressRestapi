//import { Buffer } from 'buffer';
var fs=require('fs');
const mongoose=require('mongoose');
//mongoose.connect('mongodb://localhost/hackathonDB',{autoReconnect:false},function(err,reponsne){
mongoose.connect('mongodb://aviwipro:aviwipro@ds255258.mlab.com:55258/hackathondbavi',function(err,reponsne){
   var _dash=require('lodash') 
if(err){
    console.log('some error occured ')
}
else{console.log('connection done')}
});
const myCollSchema = new mongoose.Schema({
	
        firstname:String,
        lastname:String,
        contact:String,
        emailid:{type:String,dropDups:true},
        password:String,
        role:String
});
const MemberSchema=mongoose.Schema({
   
    firstname:String,
    lastname:String,
    name:String,
    contact:Number,
    emailid:String,
    });
//

const TeamSchema=mongoose.Schema({
        TeamName:String,
        TeamLocation:String,
        Participants:[MemberSchema],
        SubmissionFilePath: String,
        FileName: String,
        FileDestination: String,
        UXRating:Number,
        FunctionRating: Number,
        Rating:Number,
        Comments: String						
    });

const EventSchema=mongoose.Schema({

    EventName:{type:String},
    StartDate:{type:String},
    EndDate:{type:String},
    winnerPrize:{type:String},
    Desc:{type:String},
    evaluatorName:{type:String},
    runnerPrize:{type:String},
    teamLimit:{type:String},
    HostName:{type:String},
    TeamList:[TeamSchema]//list of teams [team1:{TeamName:'flex',participants:[memeber1:{},member2:{}]}]

});





var EventModel=mongoose.model('EventCollection',EventSchema);
var MemberModel=mongoose.model('MemberCollection',MemberSchema);
var TeamModel=mongoose.model('TeamCollection',TeamSchema);
var coll = mongoose.model('coll', myCollSchema, 'hackUserCollection');
person1={
    name:'avishek',
    contact:9933856397,
    emailid:'avishek@gmail.com'
}
person2={
    name:'raj',
    contact:893893938
}
var member1=new MemberModel(person1);
var member2=new MemberModel(person2);

var Team1=new TeamModel();
Team1.TeamName='flex';
Team1.Rating=5;
Team1.Participants.push(member1);
Team1.Participants.push(member2);

var Event1=new EventModel();
Event1.EventName='CodingTest';
Event1.HostName='wipro';
Event1.StartDate='28/09/2018';
Event1.EndDate='28/10/2018';
Event1.TeamList.push(Team1);

//pre save for registration
var saveData=function(){
    //member1.save();
    //member2.save();
    //Team1.save();
    Event1.save(function(err,response){

        if(err){
            console.log('some error occured ')
        }
        else{
            console.log('sucesss>>>>',response)
        }
    });
}

//saveData();
_clone=function(item) {
return JSON.parse(JSON.stringify(item));
}

var dbApi={
    getEvents:function(callback) {
        EventModel.find({},function(err,response) {
            if(err) {
                console.log('some error occured.....');
                console.log(err);
            } else {
            callback(null,_clone(response));
            }
        });
    },

    getTeamsbyEvent:function(callback) {
        EventModel.aggregate([{$project: {_id: 0, EventName: 1, count: { $size:"$TeamList"}}}],function(err,response) {
            if(err) {
                console.log('some error occured...');
                console.log(err);
            } else {
            callback(null,_clone(response)); 
            }
        });
    },

    getEventbyId:function(id,callback) {
        console.log('inside db test',id)
        console.log('inside db test',typeof id)
        EventModel.findById(id,function(err,response) {
            callback(null,response);
        });
    },
        addEvent:function(newEvent,callback){
         console.log('new event',newEvent)
        var EventObj=new EventModel({EventName:newEvent.EventName,
            HostName:newEvent.HostName  });
       
     
        console.log('new eventobj',EventObj);              
        EventObj.save(function(err,response){
            if(err)
            console.log(err);
            else{
                callback(null,_clone(response))
                //mongoose.connection.close();
            }
               })
        

        },
        deleteEvent:function(id,callback){
            console.log('in dlete event',id)
            EventModel.findByIdAndRemove(id,function(err,response){
                callback(null,_clone(response));
            })
    
            },

        updateEvent:function(id,hostobj,callback){
            console.log('this is hostObj',hostobj);
        var Updateobj=new EventModel();
        Updateobj.StartDate=hostobj.StartDate;
        Updateobj.EndDate=hostobj.EndDate;
        Updateobj.teamLimit=hostobj.teamLimit;
        Updateobj.evaluatorName=hostobj.evaluatorName;
        
        EventModel.findByIdAndUpdate(id,hostobj,function(err,response){
            callback(null,_clone(response));
        })        

        },

        updateEventTeam:function(id,teamobj,callback){
       /* Updateobj=new EventModel();
        var teamArray=[];
        teamArray.push(teamobj)
        Updateobj.TeamList=teamArray;
       // EventModel.findByIdAndUpdate(id,Updateobj,function(err,response){
            callback(null,_clone(response));
        })*/
        console.log('dbtest, updateEventTeam, teamobj string ', JSON.stringify(teamobj))
        EventModel.update({_id:id},{TeamList:teamobj},function(err,response){
            callback(null,_clone(response));
        })
        },

        getEventbyHost:function(hostname,callback){
        EventModel.find({HostName:hostname},function(err,response){
         callback(null,_clone(response));
        })
        },

        //get by email
        getUserByEmailId:function(emailid,callback){
            console.log('inside db api of get by email id')
            coll.findOne({emailid:emailid},function(err,user){
                if(err){
                    console.log('getUserByEmailId err: ', err);
                }
                else {
                    console.log('getUserByEmailId user: ', user);
					callback (null, _clone(user)); 
                    }
            })
        },

        //get role=host
        getHostUser:function(callback){
            console.log('inside db api of getHostUser')
            coll.find({role:"host"},{_id:0,password:0,location:0,mobile:0,role:0,__v:0},function(err,user){
                if(err){
                    console.log('getHostUser err: ', err);
                }
                else {
                    console.log('getHostUser user: ', user);
                    callback (null, _clone(user)); 
                    }
            })
        },

        //get role=evaluator
        getEvaluatorUser:function(callback){
            console.log('inside db api of getEvaluatorUser')
            coll.find({role:"evaluator"},{_id:0,password:0,location:0,mobile:0,role:0,__v:0},function(err,user){
                if(err){
                    console.log('getEvaluatorUser err: ', err);
                }
                else {
                    console.log('getEvaluatorUser user: ', user);
                    callback (null, _clone(user)); 
                    }
            })
        },

        getEventbyEvaluator:function(evaluator,callback){
            EventModel.find({evaluatorName:evaluator},function(err,response){
             callback(null,_clone(response));
            })
        },
        
        addUser:function(newUser,callback){
           // console.log('new event',newEvent)
           var NewUser=new coll(newUser);
          
           //console.log('new eventobj',EventObj);              
           NewUser.save(function(err,response){
               if(err) {
                    callback(_clone(err),null);
			   }
               else {
                   callback(null,_clone(response))
               }
                  })
   
           },
           submitIdea:function(idea,callback){
           
        }
}


    module.exports.dbApi=dbApi;  