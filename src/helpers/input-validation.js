export const validateForm = (form) => {
  let errors = new Map();
  Object.values(form.target).forEach((element) => {
    if (
      element.tagName === "INPUT" ||
      element.name === "instructions" ||
      element.name === "description"
    ) {
      if (!validateInput(element)) {
        switch (element.name) {
          case "name":
            errors.set(element.name, "Ingresa un nombre válido.");
            break;
          case "lastName":
            errors.set(element.name, "Ingresa un apellido válido.");
            break;
          case "email":
            errors.set(element.name, "Ingresa un correo válido.");
            break;
          case "phone":
            errors.set(element.name, "Ingresa un celular válido.");
            break;
          case "password":
            errors.set(
              element.name,
              "Tu contraseña debe tener más de 5 caracteres."
            );
            break;
          case "class":
            errors.set(element.name, "Ingresa una asignatura válida.");
            break;
          case "title":
            errors.set(element.name, "Ingresa un título válido.");
            break;
          case "instructions":
            errors.set(element.name, "Ingresa instrucciones válidas.");
            break;
          case "format":
            errors.set(element.name, "Ingresa un formato válido.");
            break;
          case "documentNumber":
            errors.set(element.name, "Ingresa un documento valido");
            break;
          case "number":
            errors.set(element.name, "Ingresa un numero valido");
            break;
          case "cvc":
            errors.set(element.name, "Ingresa un CVC valido");
            break;
          case "subject":
            errors.set(element.name, "Ingresa un asunto");
            break;
          case "description":
            errors.set(element.name, "Ingresa una descripción");
            break;
          case "providerPrice":
            errors.set(
              element.name,
              "Ingresa una valor adecuado. Sin comas o espacios"
            );
            break;
          case "userEmail":
            errors.set(element.name, "Ingresa un formato de correo válido.");
            break;
          case "price":
            errors.set(
              element.name,
              "Ingresa una valor adecuado. Sin comas o espacios"
            );
            break;
          default:
        }
      }
    }
  });

  return errors;
};

export const validateInput = (input) => {
  const inputType = input.name;
  let inputValue = input.value;
  let isValid = false;
  // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const reDoc = /^([0-9]){5,}$/;
  const regCard = /^([0-9]){14,19}$/;
  const regCVC = /^([0-9]){3,4}$/;
  const reName = /^[a-z '-]{3,}$/i;
  const reProductName = /^[0-9A-Za-z\s-]+$/;
  const rePhone = /^[0-9]{10}$/;
  const rePrice = /^[0-9]+$/;

  switch (inputType) {
    case "name":
      isValid = reName.test(inputValue);
      break;
    case "productName":
      isValid = reProductName.test(inputValue);
      break;
    case "email":
      isValid = re.test(inputValue);
      break;
    case "phone":
      isValid = rePhone.test(inputValue);
      break;
    case "password":
      isValid = inputValue.length > 5;
      break;
    case "number":
      isValid = regCard.test(inputValue);
      break;
    case "cvc":
      isValid = regCVC.test(inputValue);
      break;
    case "documentNumber":
      isValid = reDoc.test(inputValue);
      break;
    case "subject":
      isValid = inputValue.length > 0;
      break;
    case "description":
      isValid = inputValue.length > 0;
      break;
    case "providerPrice":
      isValid = rePrice.test(inputValue);
      break;
    case "price":
      isValid = rePrice.test(inputValue);
      break;
    case "userEmail":
      isValid = re.test(inputValue);
      break;
    default:
      isValid = inputValue.trim() !== "";
  }

  return isValid;
};

export function formatMoney(
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}
