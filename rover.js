class Rover {
  constructor(position) {
    this.position = position;
    this.mode = "NORMAL";
    this.generatorWatts = 110;
  }

  receiveMessage(message) {
    let arr = message.commands;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].commandType === "STATUS_CHECK") {
        arr[i] = {
          completed: true,
          roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
          }
        }
      } else if (arr[i].commandType === "MODE_CHANGE") {
        this.mode = arr[i].value;
        arr[i] = {
          completed: true
        }
      } else if (arr[i].commandType === "MOVE") {
        if (this.mode === "LOW_POWER") {
          arr[i] = {
            completed: false
          }
        } else if (this.mode === "NORMAL") {
          this.position = arr[i].value;
          arr[i] = {
            completed: true
          }
        }
      }
    }
    let resp = {
      message: message.name,
      results: arr
    }
    return resp;
  }
}

module.exports = Rover;