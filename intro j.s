const names = "willy thanji"
const age = 22
const favouriteLanguage = "javascript"

console.log("Name:", names)
console.log("Age:", age)
console.log("Favourite Language:", favouriteLanguage)

// Create an object
const person = {
  name: names,
  age: age,
  language: favouriteLanguage
}

console.log("\nPerson Object:", person)

// Create a function
function greet(name, language) {
  return `Hello ${name}! You love ${language}`
}

console.log(greet(person.name, person.language))

// Create an array
const languages = ["javascript", "python", "java", "c++"]

console.log("\nLanguages:", languages)

// Loop through array
console.log("\nLanguages I want to learn:")
languages.forEach((lang, index) => {
  console.log(`${index + 1}. ${lang}`)
})

// Conditionals
console.log("\n--- Conditionals ---")
if (age >= 18) {
  console.log(`${names} is an adult`)
} else {
  console.log(`${names} is a minor`)
}

// Check if language is in array
if (languages.includes(favouriteLanguage)) {
  console.log(`${favouriteLanguage} is in the learning list`)
}

// Map and filter
console.log("\nLanguages in uppercase:")
const uppercaseLangs = languages.map(lang => lang.toUpperCase())
console.log(uppercaseLangs)

// Filter languages with 6+ characters
const longLangs = languages.filter(lang => lang.length >= 6)
console.log("\nLanguages with 6+ characters:", longLangs)

// ES6 Classes
console.log("\n--- ES6 Classes ---")
class Developer {
  constructor(name, age, language) {
    this.name = name
    this.age = age
    this.language = language
  }

  introduce() {
    return `Hi, I'm ${this.name}, ${this.age} years old, and I code in ${this.language}`
  }

  canCode() {
    return this.age >= 18 ? "Yes, I can work professionally" : "Still learning"
  }
}

const dev = new Developer(names, age, favouriteLanguage)
console.log(dev.introduce())
console.log("Professional?", dev.canCode())

// Destructuring
console.log("\n--- Destructuring ---")
const { name, age: devAge, language } = person
console.log(`Destructured: ${name}, Age: ${devAge}, Language: ${language}`)

// Spread operator
console.log("\n--- Spread Operator ---")
const moreLangs = [...languages, "rust", "go"]
console.log("Extended languages:", moreLangs)

// Arrow functions with reduce
console.log("\n--- Advanced Array Methods ---")
const langLengths = languages.reduce((total, lang) => total + lang.length, 0)
console.log(`Total characters in language names: ${langLengths}`)

// Try-catch error handling
console.log("\n--- Error Handling ---")
try {
  const result = 10 / 2
  console.log(`10 divided by 2 is: ${result}`)
} catch (error) {
  console.log("Error:", error.message)
}

console.log("\n✅ All JavaScript concepts covered!")
console.log("Ready for submission!")

