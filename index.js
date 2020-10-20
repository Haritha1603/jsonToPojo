function processJson() {
  let data;
  try {
    data = JSON.parse(document.getElementById("jsonInput").value);
  } catch (err) {
    alert("Please enter valid json object");
    console.log(err);
  }

  let variableString = "";
  Object.keys(data).forEach((key) => {
    variableString += createVariable(key, data[key]) + ";" + "\n";
  });

  let setFunctionString = "";
  Object.keys(data).forEach((key) => {
    setFunctionString += createSetFunction(key, data[key]) + ";" + "\n";
  });

  let getFunctionString = "";
  Object.keys(data).forEach((key) => {
    getFunctionString += createGetFunction(key, data[key]) + ";" + "\n";
  });

  return `
import java.util.List;

public class Converted{

${variableString}

${setFunctionString}
${getFunctionString}
}
`;
}

const displayString = () => {
  const displayString = document.getElementById("convertedString");
  displayString.innerHTML = processJson();
};

const isInteger = (value) => {
  return Number.isInteger(value);
};

const isString = (value) => {
  return typeof value === "string";
};

const isArray = (value) => {
  return Array.isArray(value);
};

const isBoolean = (value) => {
  return typeof value === "boolean";
};

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

const findType = (value) => {
  let type;
  if (isInteger(value)) {
    type = "int";
  } else if (isBoolean(value)) {
    type = "Boolean";
  } else if (isString(value)) {
    type = "String";
  } else if (isFloat(value)) {
    type = "Long";
  } else if (isArray(value) && isFloat(value[0])) {
    type = "List < Long > ";
  }
  return type;
};

const createVariable = (key, value) => {
  return `private ${findType(value)} ${key.toString()}`;
};

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const createGetFunction = (key, value) => {
  return `public ${findType(value)} get${capitalize(key)}() {
    return ${key};    
}`;
};

const createSetFunction = (key, value) => {
  return `public void set${capitalize(key)}(${findType(value)} ${key}) {
    this.${key} = ${key};
}`;
};

function download(filename, text) {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function downloadPojo() {
  const javaString = processJson();
  download("main.java", javaString);
}
