var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/HackerEarth',function(err,reponsne){

if(err){
    console.log('some error occured ')
}
else{console.log('connection done')}
});

var EventSchema=mongoose.Schema({
    EventName:{
        type:String,
        required:true,
    },
    HostName:{
        type:String,
        //required:true,
    },
    StartDate:{
        type:String,
        //required:true,
    },
    EndDate:{
        type:String,
       // required:true,
    },
   Teams:[{ type:mongoose.Schema.Types.ObjectId, ref: 'Teams'}]
})


var TeamSchema=mongoose.Schema({
    TeamName:{type:String},
    Members:[{type:mongoose.Schema.Types.ObjectId,ref:'Participants'}],
    Rating:{type:Number}
})
mongoose.model('Teams',TeamSchema);

var ParticipantSchema=mongoose.Schema({
Name:{type:String},
Contact:{type:Number}
})
var eventss=mongoose.model('Events',EventSchema);
var team=mongoose.model('Teams',TeamSchema);
var partcipant=mongoose.model('Participants',ParticipantSchema);




var add=function(){
    var participate1=new partcipant({
        Name:'avishek',Contact:9933856397
    })
    participate1.save();
    var participate2=new partcipant({
        Name:'avi',Contact:999999996397
    })
    participate2.save();
    var team1=new team({name:'rockers',members:[participate1,participate2]})
    team1.save();
 var events=new eventss({EventName:'event1' ,HostName:'host1'});
 events.save(function(err,response){
if(err){
    console.log('error occured')
}
else{
    console.log('success',response)
}
 });
 eventss.find({HostName:'host1'}).populate('Teams').populate('Participants').exec(function(err,respone){
if(err){console.log('error is populate')}
else{
    console.log('populate done')
}
 })
}

add();