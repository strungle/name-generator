"use strict";
const fs = require('fs')
//const path = require('path');

/**
  * Check if there are all 3 entries on jsonlist "male","female" and "surname".
  * @param {string} jsonlist - Json list containing all 3 entries.
  */
function checkIfJsonHasRightEntries(jsonList) {
  if ("male" in jsonList && "female" in jsonList && "surname" in jsonList) {
    return true
  } else { 
    return false
  }
}


/**
  * Captalize the first letter of the name and lowercase other letters.
  * @param {string} name - Name to captalize the first letter.
  */
function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

/**
  * Return a random number between 1 and "max", including "max" number.
  * @param {number} max - Maximum number to sort between 1 and this number.
  */
function randomNumber(max=1) {
  if (max > 0) {
    const min = 1
    const luckyNumber = Math.floor( Math.random() * (max - min + 1) + min )
    return luckyNumber
  } else {
    throw Error(`Max number cannot be zero or negative!. Minimum number is 1.`)
  }
}

/**
  * Return a random name from given branch.
  * @param {string} list   - JSON list containing male, female and surname.
  * @param {string} branch - Branch could be "male", "female" or surname.
  */
function randomName(list,branch) {
  const max = list[branch].length
  const min = 0
  const index = Math.floor( Math.random() * (max - min) + min )
  return list[branch][index]
}

/**
  * Generate a single full name.
  * I did not put any limit on size of names here because this function is not visible to the world. 
  * @param {string} list   - JSON list containing male, female and surname.
  * @param {string} branch - Branch could be "male", "female" or surname.
  */
function randomFullName(jsonList, name, qtyName=1, qtySurname=2) {
  if (checkIfJsonHasRightEntries(jsonList) == true) {
    //Get the lenght of name and surnames
    const maxNames = jsonList[name].length
    const maxSurnames = jsonList['surname'].length
    //Quantity of names and surname of the list must be less than asked
    if (qtyName <= maxNames && qtySurname <= maxSurnames) {
      //Create new name and surname empty
      let newName = []
      let newSurname = []
      //Generate the name without repeat
      while (newName.length < qtyName) {
        let rndName = randomName(jsonList,name)
        //Check if the name was not already drawn
        if (newName.indexOf(rndName) === -1) {
          //Insert the name on array
          newName.push(rndName)
          //If the name was already drown, nothing will be done and will loop again.
        }
      }
      //Generate the surname without repeat if surname > 0
      if (qtySurname > 0) {
        while (newSurname.length < qtySurname) {
          let rndName = randomName(jsonList,'surname')
          //Check if the surname was not already drawn
          if (newSurname.indexOf(rndName) === -1) {
            //Insert the surname on array
            newSurname.push(rndName)
            //If the surname was already drown, nothing will be done and will loop again.
          }
        }
      }   
      //Send as JSON format
      let finalJsonName = {}
      finalJsonName = ({ "gender": name, "name": newName, "surname": newSurname })
      return finalJsonName
    } else {
      throw Error(`Json has less names/surnames than asked to generate.`)
    }
  } else {
      throw Error(`Json file does not have male and/or female and/or surname properties.`)
  }
}

const js = {
  /**
  * Load a JSON file containing the specified list of males, females and surnames.
  * If you did not pass the JSON file, it will a default JSON file.
  * @param {string} jsonFile - Relative path to JSON file.
  */
  loadNames : function(jsonFile='./node_modules/name-generator/human.json') {
      //Check if file is readable
      try {
        fs.accessSync(jsonFile, fs.constants.R_OK)
        //Import the JSON file
        const rawdata = fs.readFileSync(jsonFile)
        //Check if there is a "male", "female" and "surname" on the JSON
        const human = JSON.parse(rawdata)
        if (checkIfJsonHasRightEntries(human) == true) {
            return human
        } else {
            throw Error(`Json file does not have male and/or female and/or surname properties.`)
        }
      } catch (e) {
        throw Error(e)
      }
  },
  /**
   * Check if there is any duplicates on list of male, female, surname or all of them.
   * @param {string} jsonList - JSON list containing the names 
   * @param {string} list - Options are: male, female, surname, all (default).
   */
  checkDuplicates : function(jsonList, list='all') {
      if (list === 'all' || list === 'male' || list === 'female' || list === 'surname') {
        if (checkIfJsonHasRightEntries(jsonList) == true) {
          return true
        } else {
            throw Error(`Json file does not have male and/or female and/or surname properties.`)
        }
      } else {
        throw Error(`Valid list names is: male, female, surname, all (default).`)
      }
  },
  /**
  * Normalize all names to first letter in uppercase and the others on lowercase.
  * @param {string} jsonList - JSON list containing male, female and surname.
  */
  normalizeNames : function(jsonList) {
    if (checkIfJsonHasRightEntries(jsonList) == true) {
      //For each male, female and surname
      for (let i in jsonList){
        for (const j of Object.keys(jsonList[i])) {
          jsonList[i][j] = capitalizeFirstLetter(jsonList[i][j])
        }
      }
      return true
    } else {
        throw Error(`Json file does not have male and/or female and/or surname properties.`)
    }
  },
  /**
  * Sort all names.
  * @param {string} jsonList - JSON list containing male, female and surname.
  */
   sortNames : function(jsonList) {
    if (checkIfJsonHasRightEntries(jsonList) == true) {
      //For each male, female and surname
      for (const i in jsonList){
        jsonList[i].sort()      
      }
      return true
    } else {
        throw Error(`Json file does not have male and/or female and/or surname properties.`)
    }
  },
  /**
  * Remove all duplicate entries from each property.
  * @param {string} jsonList - JSON list containing male, female and surname.
  */
   removeDuplicateNames : function(jsonList) {
    if (checkIfJsonHasRightEntries(jsonList) == true) {
      //For each male, female and surname
      for (const i in jsonList){
        jsonList[i] = [...new Set(jsonList[i])]      
      }
      return true
    } else {
        throw Error(`Json file does not have male and/or female and/or surname properties.`)
    }
  },
  /**
  * Add a new entry to a list.
  * @param {string} jsonList - JSON list.
  * @param {string} list     - JSON array, should be male or female or surname.
  * @param {string} entry    - Your new entry.
  */
   addEntry : function(jsonList, list, entry) {
    if (checkIfJsonHasRightEntries(jsonList) == true) {
      if (list === 'male' || list === 'female' || list === 'surname') {
        //Check if entry already exists
        const captalizedEntry = capitalizeFirstLetter(entry)
        if (jsonList[list].indexOf(captalizedEntry) !==-1 ) {
          throw Error(`Entry "${captalizedEntry}" already exist in "${list}".`)  
        } else {
          //Add entry
          jsonList[list].push(captalizedEntry)
          //Sort list
          this.sortNames(jsonList)
          return true
        }
      } else {
        throw Error(`Array must be "male" or "female" or "surname".`)
      }
    } else {
        throw Error(`Json file does not have male and/or female and/or surname properties.`)
    }
  },
  /**
  * Remove an entry from a list.
  * @param {string} jsonList - JSON list.
  * @param {string} list     - JSON array, should be male or female or surname.
  * @param {string} entry    - Your entry to be removed.
  */
   removeEntry : function(jsonList, list, entry) {
    if (checkIfJsonHasRightEntries(jsonList) == true) {
      if (list === 'male' || list === 'female' || list === 'surname') {
        //Check if entry really exists
        const captalizedEntry = capitalizeFirstLetter(entry)
        if (jsonList[list].indexOf(captalizedEntry) !==-1 ) {
          //If exist, then remove it.
          jsonList[list].splice(jsonList[list].indexOf(captalizedEntry), 1);
          return true  
        } else {
          //If does not exists, then throw error
          throw Error(`Entry "${captalizedEntry}" does not exist in "${list}".`)
        }
      } else {
        throw Error(`Array must be "male" or "female" or "surname".`)
      }
    } else {
        throw Error(`Json file does not have male and/or female and/or surname properties.`)
    }
  },
  /**
  * Save your names to a JSON file.
  * If you did not pass the JSON file, it will a default JSON file.
  * @param {string} jsonList - JSON list.
  * @param {string} jsonFile - Relative path to JSON file.
  */
   saveNames : function(jsonList, jsonFile='./node_modules/name-generator/human.json') {
    try {
      //Save the JSON file
      const jsonContent = JSON.stringify(jsonList,null,4)
      fs.writeFileSync(jsonFile, jsonContent, 'utf8')
      return true
    } catch (e) {
      throw Error(e)
    }
  },
  /**
  * Generate a random name from male, female or surname.
  * If you ask to generate 3 names, then you must have at least 3 names, but cannot exceed 10 per each type.
  * Example: If you have 3 female names but asked to generate 4 female names, it will throw an error! 
  * If you ask to generate 2 male names and 2 surnames, the output will be like "Alex Andie Merna Abbott".
  * The name and surname will not repeat itself.
  * 
  * @param {string} list         - JSON list.
  * @param {string} name         - The option is "male" or "female".
  * @param {string} outputFormat - The output of name could be in "json" or "text". Default is "text".
  * @param {string} qtyName      - How many names you want, default is 1, minimum is 1 and maximum is 10.
  * @param {string} qtySurname   - How many surnames you want, default is 2, minimum is 0 and maximum is 10.

  */
   generateName : function(jsonList, name, outputFormat='text', qtyName=1, qtySurname=2) {
     if (outputFormat === 'text' || outputFormat ==='json') {
      if (qtyName > 0 && qtyName <= 10 && qtySurname > 0 && qtySurname <= 10 ) {
        const myName = randomFullName(jsonList, name, qtyName, qtySurname)
        if (outputFormat === 'text') {
          return myName.name.join(' ') + ' ' + myName.surname.join(' ')
        } else {
          return JSON.stringify(myName,null,4)
        }
      } else {
        throw Error(`The "qtyName" or "qtySurname" cannot exceed 10 each and cannot be null and must be at least 1.`)
      }
    } else {
      throw Error(`The "outputFormat" parameter option must be "json" or "text".`)
    }
  },
  /**
  * Generate a fully random within male or female.
  * If you ask to generate 3 names, then you must have at least 3 names, but cannot exceed 10 per each type.
  * Example: If you have 3 female names but asked to generate 4 female names, it will throw an error! 
  * If you ask to generate 2 male names and 2 surnames, the output will be like "Alex Andie Merna Abbott".
  * The name and surname will not repeat itself.
  * 
  * @param {string} list          - JSON list.
  * @param {string} name          - The option is "male", "female" or "any".
  * @param {string} outputFormat  - The output of name could be in "json" or "text". Default is "text".
  * @param {string} maxQtyName    - Maximum names you want, default is 1, minimum is 1 and maximum is 10.
  * @param {string} maxQtySurname - Maximum surnames you want, default is 2, minimum is 0 and maximum is 10.

  */
   generateRandomName : function(jsonList, name='any', outputFormat='text', maxQtyName=1, maxQtySurname=2) {
    if (name === 'male' || name === 'female' || name === 'any' ) {
      if (outputFormat === 'text' || outputFormat ==='json') {
        if (maxQtyName > 0 && maxQtyName <= 10 && maxQtySurname > 0 && maxQtySurname <= 10 ) {
          //If name is "any", then it will be random between 1 and 2. 1 = male, 2 = female
          let gender, aux
          if (name === 'any') {
            let aux = randomNumber(2)
            if (aux === 1) { //male
              gender = 'male'
            } else {
              gender = 'female'
            }
          } else {
            gender = name
          }          
          //Random a quantity for name and surname
          aux = randomNumber(maxQtyName)
          let qtyName = aux
          aux = randomNumber(maxQtySurname)
          let qtySurname = aux
          //Finally random a new name!
          const myName = randomFullName(jsonList, gender, qtyName, qtySurname)
          if (outputFormat === 'text') {
            return myName.name.join(' ') + ' ' + myName.surname.join(' ')
          } else {
            return JSON.stringify(myName,null,4)
          }
        } else {
          throw Error(`The "maxQtyName" or "maxQtySurname" cannot exceed 10 each and cannot be null and must be at least 1.`)
        }
      } else {
        throw Error(`The "outputFormat" parameter option must be "json" or "text".`)
      }
    } else {
      throw Error(`The "name" parameter option must be "male", "female" or "any".`)
    }    
 },
}

module.exports = js