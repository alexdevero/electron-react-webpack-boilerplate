import 'regenerator-runtime/runtime';
const async = require('async');

/////////////////////////////////////////////////////
// EXTERNAL FUNCTIONS
/////////////////////////////////////////////////////

const queueTask = function(taskFunc, taskParams){
	queue.push(new Task(taskFunc, taskParams), (err, {task}) => {
		if(err){
			console.log('An error occurred while processing task');
			return;
		}
		console.log('Finished task');
	});
}



const AsyncTaskQueue = function(){
	return ({
		queueTask,
	});
}

export default AsyncTaskQueue;

//////////////////////////////////////////////////
//INTERNAL FUNCTIONS
//////////////////////////////////////////////////

//object generator for task
const Task = function(taskAsyncFunction, parameters){
	this.func = taskAsyncFunction;
	this.params = parameters ? parameters : [];
}

// function run on queued tasks
const queue = async.queue(async (task, callback) => {
	console.log("Processing task: ");
	await task.func(task.params);
	callback(null, {task});
}, 1);

//call when que has nothing to run
queue.drain(() => {
   console.log('All items are succesfully processed !');
});








