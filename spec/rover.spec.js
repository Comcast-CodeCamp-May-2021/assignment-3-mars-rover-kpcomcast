const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  //test7
  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(10);
    expect(rover.position).toEqual(10);
    expect(rover.mode).toEqual("NORMAL");
    expect(rover.generatorWatts).toEqual(110);
  });
  //test8
  it("response returned by receiveMessage contains name of message", function() {
    let commands = [new Command("STATUS_CHECK")];
    let message = new Message("Test message", commands);
    let rover = new Rover(10);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual("Test message");
  });
  //test9
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
    let message = new Message("Test message with two commands", commands);
    let rover = new Rover(10);
    let response = rover.receiveMessage(message);
    expect((response.results).length).toEqual(2);
  });
  //test10
  it("responds correctly to status check command", function() {
    let commands = [new Command("STATUS_CHECK")];
    let message = new Message("Test message status check", commands);
    let rover = new Rover(9838);
    let response = rover.receiveMessage(message);
    expect(typeof response.results[0].roverStatus).toEqual("object");
    expect((response.results[0]).roverStatus.mode).toEqual(rover.mode);
    expect((response.results[0]).roverStatus.generatorWatts).toEqual(rover.generatorWatts);
    expect((response.results[0]).roverStatus.position).toEqual(rover.position);
  });
  //test11
  it("responds correctly to mode change command", function() {
    let command1 = [new Command("MODE_CHANGE", "LOW_POWER")];
    let command2 = [new Command("MODE_CHANGE", "NORMAL")];
    let message1 = new Message("testing command1", command1);
    let message2 = new Message("testing command2", command2);
    let rover = new Rover(9838);
    let response1 = rover.receiveMessage(message1);
    expect(response1.results[0].completed).toEqual(true);
    expect(rover.mode).toEqual("LOW_POWER");
    let response2 = rover.receiveMessage(message2);
    expect(response2.results[0].completed).toEqual(true);
    expect(rover.mode).toEqual("NORMAL");
  });
  //test12
  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 1234)];
    let message = new Message("testing move command, low power", commands);
    let rover = new Rover(4567);
    let response = rover.receiveMessage(message);
    expect(response.results[1].completed).toEqual(false);
    expect(rover.position).toEqual(4567);
  });
  //test13, finally
  it("responds with position for move command", function() {
    let command = [new Command("MOVE", 1234)];
    let message = new Message("test move, normal mode", command);
    let rover = new Rover(4567);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.position).toEqual(1234);
  });

});
